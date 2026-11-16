import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FAQ } from "@/lib/faq";
import { site } from "@/lib/site";
import {
  upsertChatSession,
  appendChatMessages,
  pollChatSession,
} from "@/lib/flario";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_CHAT_MODEL ?? "claude-haiku-5-5";
const MAX_MESSAGES = 20;

function buildSystemPrompt(): string {
  const faqText = FAQ.map(
    (e, i) =>
      `[${i + 1}] Frage: ${e.q}\nAntwort: ${e.a}${e.source ? `\nQuelle: ${e.source}` : ""}`,
  ).join("\n\n");

  return `Du bist der freundliche Online-Assistent der VFR Verkehrsfachschule Rheinland GmbH in Niederkassel. Deine Aufgabe ist es, Besucher der Website schnell und präzise zu beraten — IMMER auf Deutsch.

## Deine Rolle
- Du kennst die VFR und ihre Angebote: Fahrlehrerausbildung (BE, A, CE, DE), Fortbildung nach § 53 FahrlG, Weiterbildung (Seminarleiter ASF/FES, Ausbildungsfahrlehrer, BWL), Feuerwehr-Spezialausbildung, Ladekran, Flurförderzeuge, Fördermöglichkeiten.
- Tonalität: du-Form, warm, kompetent, kurz. Keine Floskeln.

## WICHTIG — Grenzen & Guardrails
1. **Keine Rechtsberatung.** Zu Paragraphen/Gesetzen nur allgemeine Infos, keine Einzelfall-Auslegung.
2. **Nur aus diesem Material antworten.** Sonst: "Das weiß ich nicht genau — am besten Beratungstermin auf /beratung oder ${site.phone}."
3. **Keine Preise erfinden.**
4. **Wenn jemand explizit einen Menschen sprechen möchte,** sag: "Gerne — ich leite deine Frage an unser Büro weiter. Du kannst auch direkt anrufen: ${site.phone} oder WhatsApp."

## Kontaktinfos
- Telefon: ${site.phone} · E-Mail: ${site.email}
- Adresse: ${site.address.street}, ${site.address.zip} ${site.address.city}
- Mo–Fr 07:30–16:00 Uhr
- Beratungstermine: /beratung · Alle Kurse: /termine-preise

## Dein Wissen (FAQ)
${faqText}

## Antwort-Format
- 1–3 Sätze, präzise und freundlich
- Am Ende eine passende Aktion wenn sinnvoll
- Niemals erfinden. Lieber: "Dazu ruf bitte an oder vereinbare Beratungstermin."`;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const body = (await req.json()) as {
      sessionId: string;
      messages: { role: "user" | "assistant"; content: string }[];
      context?: { page?: string; userAgent?: string; referrer?: string };
    };

    if (!body.sessionId || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ ok: false, error: "Ungültige Anfrage" }, { status: 400 });
    }

    const lastUserMsg = body.messages[body.messages.length - 1];
    if (lastUserMsg.role !== "user") {
      return NextResponse.json({ ok: false, error: "Letzte Nachricht muss vom User sein" }, { status: 400 });
    }

    // Session bei Flario anlegen / anfrischen
    const session = await upsertChatSession({
      sessionId: body.sessionId,
      context: body.context,
    });

    const now = new Date().toISOString();

    // User-Nachricht spiegeln
    await appendChatMessages(body.sessionId, [
      { role: "user", content: lastUserMsg.content, at: now },
    ]);

    // Wenn Mitarbeiter übernommen hat → keine KI-Antwort
    if (session.humanTakeover) {
      return NextResponse.json({
        ok: true,
        reply: null,
        humanTakeover: true,
        info:
          "Ein Mitarbeiter liest gerade mit und meldet sich gleich persönlich.",
      });
    }

    // Kein Anthropic-Key → freundlicher Fallback
    if (!apiKey) {
      const fallback =
        "Der Chat ist noch nicht vollständig eingerichtet. Ruf uns an oder vereinbare einen Beratungstermin.";
      await appendChatMessages(body.sessionId, [
        {
          role: "assistant",
          content: fallback,
          at: new Date().toISOString(),
        },
      ]);
      return NextResponse.json({ ok: true, reply: fallback });
    }

    const trimmed = body.messages.slice(-MAX_MESSAGES).filter(
      (m) => (m.role === "user" || m.role === "assistant") && m.content?.trim(),
    );

    const client = new Anthropic({ apiKey });
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: buildSystemPrompt(),
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply =
      resp.content
        .filter((c): c is Anthropic.Messages.TextBlock => c.type === "text")
        .map((c) => c.text)
        .join("\n") || "Sorry, ich konnte darauf gerade nicht antworten.";

    // KI-Antwort auch spiegeln
    await appendChatMessages(body.sessionId, [
      {
        role: "assistant",
        content: reply,
        at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Der Chat ist gerade nicht erreichbar. Bitte ruf uns an oder schick eine E-Mail.",
      },
      { status: 500 },
    );
  }
}

/** Polling-Endpoint für neue Agent-Nachrichten */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  const since = url.searchParams.get("since") ?? undefined;
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "sessionId fehlt" }, { status: 400 });
  }
  try {
    const result = await pollChatSession(sessionId, since);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[chat poll]", err);
    return NextResponse.json({ ok: false, humanTakeover: false, newMessages: [] });
  }
}
