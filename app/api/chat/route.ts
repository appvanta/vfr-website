import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FAQ } from "@/lib/faq";
import { site } from "@/lib/site";
import { CHAT_KNOWLEDGE } from "@/lib/chat-knowledge";
import { listCourses, CATEGORY_LABEL, type Course } from "@/lib/flario";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_CHAT_MODEL ?? "claude-haiku-5-5";

// ============================================================================
// ANTI-ABUSE LIMITS
// ============================================================================
const MAX_MESSAGES_PER_SESSION = 20;
const MAX_MESSAGE_LENGTH = 500;
const MAX_TOTAL_INPUT_LENGTH = 8_000;

const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const DAILY_REQUEST_LIMIT = 500;

const SESSION_ID_REGEX = /^[A-Za-z0-9_-]{8,64}$/;

const BOT_UA_REGEX =
  /bot|crawler|spider|scraper|headlesschrome|curl\/|wget|python-requests|http-client|axios|java\/|go-http/i;

type Hit = number[];
const ipHits = new Map<string, Hit>();

let dailyCount = 0;
let dailyResetAt = startOfNextDayMs();

function startOfNextDayMs(): number {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}

function checkRateLimit(ip: string): { ok: boolean; retryInSeconds?: number } {
  const now = Date.now();
  if (now >= dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = startOfNextDayMs();
  }
  if (dailyCount >= DAILY_REQUEST_LIMIT) {
    return { ok: false, retryInSeconds: Math.ceil((dailyResetAt - now) / 1000) };
  }
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (ipHits.get(ip) ?? []).filter((t) => t > windowStart);
  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = hits[0];
    return { ok: false, retryInSeconds: Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000) };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 10_000) {
    for (const [k, v] of ipHits) {
      if (v[v.length - 1] < windowStart) ipHits.delete(k);
    }
  }
  return { ok: true };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

// ============================================================================
// System-Prompt — mit Live-Daten aus Flario
// ============================================================================

function formatEUR(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

function buildLiveCoursesBlock(courses: Course[]): string {
  if (!courses.length) {
    return "(aktuell keine Kurse gelistet — Interessent auf /termine-preise verweisen)";
  }
  const grouped = new Map<string, Course[]>();
  for (const c of courses) {
    if (c.bookable === false || c.publicVisible === false) continue;
    const key = CATEGORY_LABEL[c.category] ?? c.category;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(c);
  }
  const lines: string[] = [];
  for (const [label, list] of grouped) {
    lines.push(`\n### ${label}`);
    for (const c of list.slice(0, 6)) {
      const seats = c.seatsAvailable <= 0 ? "ausgebucht" : "verfügbar";
      lines.push(
        `- ${c.title} · Start ${formatDate(c.startDate)} · ${formatEUR(c.priceCents)} · ${seats}`,
      );
    }
    if (list.length > 6) {
      lines.push(`- (und ${list.length - 6} weitere — auf /termine-preise)`);
    }
  }
  return lines.join("\n");
}

function buildSystemPrompt(coursesBlock: string): string {
  const faqText = FAQ.map(
    (e, i) =>
      `[${i + 1}] Frage: ${e.q}\nAntwort: ${e.a}${e.source ? `\nQuelle: ${e.source}` : ""}`,
  ).join("\n\n");

  return `Du bist der freundliche Online-Assistent der VFR Verkehrsfachschule Rheinland GmbH in Niederkassel. Du berätst Besucher auf unserer Website fahrlehrer-portal.de — IMMER auf Deutsch.

## HARTE REGELN
1. **Nur aus unserem Wissen antworten:** (a) Live-Daten (Termine/Preise), (b) Website-Wissen, (c) FAQ. Nichts erfinden, nichts aus deinem allgemeinen Gedächtnis ergänzen.
2. **PREISE UND TERMINE AUSSCHLIESSLICH aus der LIVE-DATEN-LISTE.** Falls ein Kurs/Preis nicht in der Liste steht → ehrlich sagen: "Aktuelle Termine und Preise findest du auf /termine-preise — oder frag im Büro nach: ${site.phone}."
3. **Keine Rechtsberatung, keine Paragraphen-Auslegung.** Allgemeine Infos aus unserem Website-Wissen sind ok. Für konkrete Rechtsfragen: Verweis auf https://www.gesetze-im-internet.de + Beratungstermin auf /beratung.
4. **Wenn du etwas nicht sicher weißt → ehrlich:** "Das weiß ich nicht sicher — am besten Beratungstermin unter /beratung oder anrufen: ${site.phone}."
5. **Wenn jemand einen Menschen sprechen möchte:** "Gerne — ruf uns an: ${site.phone} oder WhatsApp, oder schreib an ${site.email}."

## Tonalität
du-Form, warm, kompetent, kurz. Keine Floskeln, keine Fachsprache ohne Not.

## Antwort-Format
- 1–3 Sätze, präzise
- Am Ende eine passende Aktion (Link auf eine unserer Seiten, Telefonnummer, Beratungstermin)
- Immer bei Unklarheit lieber zugeben + auf Beratung verweisen

## Kontakt-Kurzinfos
- Telefon: ${site.phone} · E-Mail: ${site.email}
- Adresse: ${site.address.street}, ${site.address.zip} ${site.address.city}
- Mo–Fr 07:30–16:00 Uhr
- Beratungstermine: /beratung · Alle Kurse: /termine-preise

## 🔴 LIVE-DATEN — aktuelle Termine und Preise (Nur hieraus zitieren)
${coursesBlock}

## 📘 UNSER WEBSITE-WISSEN (die einzige Wahrheitsquelle außerhalb Live-Daten)
${CHAT_KNOWLEDGE}

## 💬 Häufige Fragen (FAQ — nicht für Preise/Termine)
${faqText}`;
}

// ============================================================================
// POST — Chat-Nachricht
// ============================================================================

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent") ?? "";

  if (!ua || BOT_UA_REGEX.test(ua)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Du hast zu viele Nachrichten gesendet. Bitte warte kurz oder ruf uns an.",
        retryInSeconds: rl.retryInSeconds,
      },
      { status: 429 },
    );
  }

  try {
    const body = (await req.json()) as {
      sessionId: string;
      messages: { role: "user" | "assistant"; content: string }[];
      context?: { page?: string; userAgent?: string; referrer?: string };
    };

    if (!body.sessionId || !SESSION_ID_REGEX.test(body.sessionId)) {
      return NextResponse.json({ ok: false, error: "Ungültige Session" }, { status: 400 });
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ ok: false, error: "Ungültige Anfrage" }, { status: 400 });
    }

    if (body.messages.length > MAX_MESSAGES_PER_SESSION) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Dieser Chat ist zu lang. Bitte starte einen neuen Chat oder ruf uns an.",
        },
        { status: 400 },
      );
    }

    const lastUserMsg = body.messages[body.messages.length - 1];
    if (lastUserMsg.role !== "user") {
      return NextResponse.json({ ok: false, error: "Letzte Nachricht muss vom User sein" }, { status: 400 });
    }

    const lastContent = (lastUserMsg.content ?? "").trim();
    if (!lastContent) {
      return NextResponse.json({ ok: false, error: "Leere Nachricht" }, { status: 400 });
    }
    if (lastContent.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          error: `Deine Nachricht ist zu lang (max. ${MAX_MESSAGE_LENGTH} Zeichen).`,
        },
        { status: 400 },
      );
    }

    const totalLen = body.messages.reduce((s, m) => s + (m.content?.length ?? 0), 0);
    if (totalLen > MAX_TOTAL_INPUT_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Dieser Chat ist zu umfangreich. Bitte starte einen neuen Chat oder ruf uns an.",
        },
        { status: 400 },
      );
    }

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        reply:
          "Der Chat ist noch nicht vollständig eingerichtet. Ruf uns an oder vereinbare einen Beratungstermin.",
      });
    }

    const trimmed = body.messages
      .slice(-MAX_MESSAGES_PER_SESSION)
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          m.content?.trim() &&
          m.content.length <= MAX_MESSAGE_LENGTH * 2,
      );

    // Live-Termine von Flario holen (fail-safe: bei Fehler leere Liste)
    let coursesBlock = "(Termine werden gerade neu geladen, bitte auf /termine-preise prüfen.)";
    try {
      const courses = await listCourses({ onlyBookable: true });
      coursesBlock = buildLiveCoursesBlock(courses);
    } catch (err) {
      console.warn("[chat] Flario listCourses fehlgeschlagen:", (err as Error).message);
    }

    const client = new Anthropic({ apiKey });
    dailyCount += 1;

    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(coursesBlock),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply =
      resp.content
        .filter((c): c is Anthropic.Messages.TextBlock => c.type === "text")
        .map((c) => c.text)
        .join("\n") || "Sorry, ich konnte darauf gerade nicht antworten.";

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    const e = err as Error & { status?: number; type?: string };
    console.error("[chat]", e?.name, e?.message, e?.status, e?.type);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Bei der Antwort ist leider ein technisches Problem aufgetreten. Für schnelle Hilfe: " +
          site.phone +
          " (Mo–Fr 07:30–16:00) oder " +
          site.email +
          " — oder Beratungstermin unter /beratung.",
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// GET — Deaktiviert (Flario hat keine Chat-Session-Endpoints, wir brauchen
// daher kein Polling mehr. Mitarbeiter-Übernahme läuft aktuell nicht.)
// ============================================================================

export async function GET() {
  return NextResponse.json({ ok: true, humanTakeover: false, newMessages: [] });
}
