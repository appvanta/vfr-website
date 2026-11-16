"use client";

import { useMemo, useState } from "react";
import { Phone, Video, MapPin, Check, Loader2 } from "lucide-react";
import type { AppointmentKind, AppointmentSlot } from "@/lib/flario";
import { APPOINTMENT_KIND_LABEL } from "@/lib/flario";

type Props = { slots: AppointmentSlot[] };

const KIND_META: Record<
  AppointmentKind,
  { label: string; sub: string; Icon: typeof Phone }
> = {
  phone: {
    label: "Telefon",
    sub: "Wir rufen dich zur vereinbarten Zeit an.",
    Icon: Phone,
  },
  video: {
    label: "Video-Konferenz",
    sub: "Einwahl-Link bekommst du per E-Mail.",
    Icon: Video,
  },
  onsite: {
    label: "Vor Ort",
    sub: "In Niederkassel, Karl-Hass-Str. 13.",
    Icon: MapPin,
  },
};

function formatDateDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppointmentBooking({ slots }: Props) {
  const [kind, setKind] = useState<AppointmentKind | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { id: string }>(null);
  const [error, setError] = useState<string | null>(null);

  // Slots nach Kind filtern + nach Tag gruppieren
  const grouped = useMemo(() => {
    if (!kind) return [];
    const filtered = slots.filter((s) => s.availableFor.includes(kind));
    const map = new Map<string, AppointmentSlot[]>();
    for (const s of filtered) {
      const day = s.start.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(s);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 7); // Nur die nächsten 7 Werktage anzeigen
  }, [slots, kind]);

  const selectedSlot = slot ? slots.find((s) => s.start === slot) : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kind || !selectedSlot) return;
    setSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/appointment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          start: selectedSlot.start,
          durationMin: selectedSlot.durationMin,
          contact: {
            salutation: formData.get("salutation") || undefined,
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            topic: formData.get("topic") || undefined,
            message: formData.get("message") || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Buchung fehlgeschlagen");
      }
      setDone({ id: json.appointmentId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Done-State ────────────────────────────────────────
  if (done && selectedSlot && kind) {
    return (
      <div className="max-w-[640px] mx-auto text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="vfr-h2">Termin gebucht!</h2>
        <p className="text-[var(--vfr-fg-muted)] mt-4 text-[1.05rem]">
          Dein Termin für{" "}
          <strong>{APPOINTMENT_KIND_LABEL[kind]}</strong> am{" "}
          <strong>
            {formatDateDay(selectedSlot.start)} um{" "}
            {formatTime(selectedSlot.start)}
          </strong>{" "}
          ist eingetragen. Wir schicken dir eine Bestätigungs-Mail.
        </p>
        <p className="mt-6 text-[0.85rem] text-[var(--vfr-fg-soft)]">
          Referenz: {done.id}
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border border-[var(--vfr-rule)] bg-[var(--vfr-bg)] px-3 py-2.5 text-[0.95rem] text-[var(--vfr-fg)] focus:outline-2 focus:outline-[var(--vfr-accent)] rounded-[2px]";
  const labelCls =
    "block text-[0.72rem] font-semibold mb-1.5 uppercase tracking-[0.08em] text-[var(--vfr-fg-muted)]";

  return (
    <div className="max-w-[920px] mx-auto space-y-10">
      {/* Schritt 1 — Art ────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[var(--vfr-accent)] text-white inline-flex items-center justify-center text-[0.82rem] font-bold">
            1
          </span>
          <h2 className="vfr-h2 m-0 text-[1.4rem]">Wie möchtest du sprechen?</h2>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {(["phone", "video", "onsite"] as const).map((k) => {
            const meta = KIND_META[k];
            const active = kind === k;
            const Icon = meta.Icon;
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setKind(k);
                  setSlot(null);
                }}
                className={`group text-left p-5 rounded-[2px] transition flex flex-col gap-2 border-2 ${
                  active
                    ? "bg-[var(--vfr-accent)] text-white border-[var(--vfr-accent)]"
                    : "bg-[var(--vfr-card)] border-[var(--vfr-rule)] hover:border-[var(--vfr-accent)]"
                }`}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: active ? "white" : "var(--vfr-accent)" }}
                />
                <div className="font-semibold text-[1rem]">{meta.label}</div>
                <div
                  className="text-[0.82rem]"
                  style={{
                    color: active ? "rgba(255,255,255,0.85)" : "var(--vfr-fg-muted)",
                  }}
                >
                  {meta.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schritt 2 — Zeitfenster ───────────────────── */}
      {kind && (
        <div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[var(--vfr-accent)] text-white inline-flex items-center justify-center text-[0.82rem] font-bold">
              2
            </span>
            <h2 className="vfr-h2 m-0 text-[1.4rem]">Wann passt es dir?</h2>
          </div>
          <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] mt-2 mb-5">
            Je 30 Minuten · Mo–Fr · 9–16 Uhr · nächste zwei Wochen
          </p>

          {grouped.length === 0 ? (
            <p className="text-[var(--vfr-fg-muted)]">
              Aktuell keine freien Termine — bitte Kontakt per Telefon oder
              WhatsApp.
            </p>
          ) : (
            <div className="space-y-5">
              {grouped.map(([day, daySlots]) => (
                <div
                  key={day}
                  className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-4 rounded-sm"
                >
                  <div className="text-[0.85rem] font-semibold text-[var(--vfr-fg)] mb-3">
                    {formatDateDay(daySlots[0].start)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((s) => {
                      const active = slot === s.start;
                      return (
                        <button
                          key={s.start}
                          type="button"
                          onClick={() => setSlot(s.start)}
                          className={`px-4 py-2 text-[0.88rem] font-medium rounded-full border transition ${
                            active
                              ? "bg-[var(--vfr-accent)] text-white border-[var(--vfr-accent)]"
                              : "bg-[var(--vfr-bg)] text-[var(--vfr-fg)] border-[var(--vfr-rule)] hover:border-[var(--vfr-accent)]"
                          }`}
                        >
                          {formatTime(s.start)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schritt 3 — Kontaktdaten ─────────────────── */}
      {kind && selectedSlot && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-7 rounded-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-7 h-7 rounded-full bg-[var(--vfr-accent)] text-white inline-flex items-center justify-center text-[0.82rem] font-bold">
              3
            </span>
            <h2 className="vfr-h2 m-0 text-[1.4rem]">Deine Daten.</h2>
          </div>

          <div className="mb-5 p-4 bg-[var(--vfr-bg-alt)] border-l-4 border-[var(--vfr-accent)] text-[0.9rem]">
            <strong>{APPOINTMENT_KIND_LABEL[kind]}</strong> am{" "}
            <strong>
              {formatDateDay(selectedSlot.start)} um{" "}
              {formatTime(selectedSlot.start)}
            </strong>{" "}
            (30 Minuten)
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Anrede</label>
              <select name="salutation" className={inputCls} defaultValue="Herr">
                <option>Herr</option>
                <option>Frau</option>
                <option>Divers</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Vorname *</label>
              <input name="firstName" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Nachname *</label>
              <input name="lastName" required className={inputCls} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelCls}>E-Mail *</label>
              <input type="email" name="email" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefon *</label>
              <input type="tel" name="phone" required className={inputCls} />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelCls}>Thema (optional)</label>
            <input
              name="topic"
              placeholder="z.B. Klasse BE, Förderung, Fortbildung …"
              className={inputCls}
            />
          </div>

          <div className="mt-4">
            <label className={labelCls}>Nachricht (optional)</label>
            <textarea
              name="message"
              rows={3}
              placeholder="Kurz worum es geht."
              className={inputCls + " resize-y"}
            />
          </div>

          {error && (
            <div className="mt-4 bg-[#fbeae5] border border-[#b84b2a]/30 px-4 py-3 text-[0.88rem] text-[#8a3a1f]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-[var(--vfr-accent)] text-white py-4 font-semibold rounded-[2px] hover:bg-[var(--vfr-accent-dark)] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Termin verbindlich buchen
          </button>
        </form>
      )}
    </div>
  );
}
