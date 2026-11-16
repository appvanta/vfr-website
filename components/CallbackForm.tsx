"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Bitte Name angeben"),
  phone: z.string().min(5, "Telefonnummer benötigt"),
  email: z.string().email("Bitte gültige E-Mail").optional().or(z.literal("")),
  desiredDate: z.string().min(1, "Datum wählen"),
  desiredTime: z.string().min(1, "Uhrzeit wählen"),
  topic: z.string().optional(),
  message: z.string().optional(),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Datenschutz bestätigen" }),
  }),
});

type FormData = z.infer<typeof schema>;

export function CallbackForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Fehler beim Senden");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-[var(--vfr-accent)] mx-auto" />
        <h3 className="mt-4 font-[family-name:var(--font-serif)] text-[1.3rem] text-[var(--vfr-fg)] font-medium">
          Anfrage gesendet.
        </h3>
        <p className="mt-2 text-[var(--vfr-fg-muted)]">
          Wir rufen zu deinem Wunschtermin zurück. Die Bestätigung bekommst du
          per E-Mail.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border border-[var(--vfr-rule)] bg-[var(--vfr-bg)] px-3 py-2.5 text-[0.95rem] text-[var(--vfr-fg)] focus:outline-2 focus:outline-[var(--vfr-accent)] focus:border-[var(--vfr-accent)] rounded-[2px]";
  const labelCls =
    "block text-[0.72rem] font-semibold mb-1.5 uppercase tracking-[0.08em] text-[var(--vfr-fg-muted)]";
  const errCls = "mt-1 text-[0.78rem] text-[#b84b2a]";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-8 space-y-5"
    >
      <div>
        <span className="vfr-eyebrow">Kostenloser Rückruf</span>
        <h2 className="vfr-h2 mt-4 text-[1.4rem]">Wir rufen dich zurück.</h2>
        <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] mt-2">
          Sag uns, wann es dir passt — wir rufen pünktlich zurück.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input {...register("name")} className={inputCls} />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Telefon *</label>
          <input type="tel" {...register("phone")} className={inputCls} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>E-Mail (optional)</label>
        <input type="email" {...register("email")} className={inputCls} />
        {errors.email && <p className={errCls}>{errors.email.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Wunschdatum *</label>
          <input
            type="date"
            min={today}
            {...register("desiredDate")}
            className={inputCls}
          />
          {errors.desiredDate && (
            <p className={errCls}>{errors.desiredDate.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Wunschuhrzeit *</label>
          <input
            type="time"
            {...register("desiredTime")}
            className={inputCls}
          />
          {errors.desiredTime && (
            <p className={errCls}>{errors.desiredTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelCls}>Thema (optional)</label>
        <select {...register("topic")} className={inputCls}>
          <option value="">Bitte wählen</option>
          <option>Fahrlehrerausbildung BE</option>
          <option>Fahrlehrerausbildung A</option>
          <option>Fahrlehrerausbildung CE</option>
          <option>Fahrlehrerausbildung DE</option>
          <option>Fortbildung / Weiterbildung</option>
          <option>Bildungsgutschein</option>
          <option>Allgemeine Frage</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Nachricht (optional)</label>
        <textarea
          rows={4}
          {...register("message")}
          className={inputCls + " resize-y"}
        />
      </div>

      <label className="flex items-start gap-2 text-[0.82rem] text-[var(--vfr-fg-muted)]">
        <input
          type="checkbox"
          {...register("privacy")}
          className="mt-1 h-4 w-4"
        />
        <span>
          Ich habe die{" "}
          <a
            href="/datenschutz"
            className="text-[var(--vfr-accent-dark)] underline"
          >
            Datenschutzerklärung
          </a>{" "}
          gelesen und stimme der Kontaktaufnahme zu. *
        </span>
      </label>
      {errors.privacy && <p className={errCls}>{errors.privacy.message}</p>}

      {error && (
        <div className="bg-[#fbeae5] border border-[#b84b2a]/30 px-4 py-3 text-[0.88rem] text-[#8a3a1f]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[var(--vfr-fg)] text-[var(--vfr-bg)] py-3.5 font-semibold hover:bg-[var(--vfr-accent)] transition flex items-center justify-center gap-2 rounded-[2px] disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Rückruf anfordern
      </button>
    </form>
  );
}
