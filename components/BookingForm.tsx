"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  FileText,
  CreditCard,
  Receipt,
  Mail,
  Plus,
  Trash2,
  Users,
  Building2,
} from "lucide-react";
import type {
  Course,
  QualificationKey,
  LicenseClassKey,
  DrivingLicenseKey,
} from "@/lib/flario";
import {
  QUALIFICATION_LABEL,
  LICENSE_CLASS_LABEL,
  DRIVING_LICENSE_LABEL,
} from "@/lib/flario";
import { formatEUR, formatDate } from "@/lib/utils";

const CONTRACT_VERSION = "2026-v1";

const QUALIFICATION_KEYS: QualificationKey[] = [
  "ausbildungsfahrlehrer",
  "seminarleiter-asf",
  "seminarleiter-fes",
  "bwl",
];

const LICENSE_KEYS: LicenseClassKey[] = ["be", "a", "ce", "de"];
const DRIVING_LICENSE_KEYS: DrivingLicenseKey[] = ["c", "ce", "d", "de"];

// ── Schemas ─────────────────────────────────────────────

const qualificationSchema = z.object({
  selected: z.boolean().optional(),
  year: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^(19|20)\d{2}$/.test(v),
      "Jahr: 4-stellig (z.B. 2018)",
    ),
});

const licenseSchema = z.object({
  selected: z.boolean().optional(),
  grantedDate: z.string().optional(),
});

const participantSchema = z.object({
  salutation: z.enum(["Herr", "Frau", "Divers"]),
  firstName: z.string().min(2, "Vorname zu kurz"),
  lastName: z.string().min(2, "Nachname zu kurz"),
  email: z.string().email("Gültige E-Mail erforderlich"),
  phone: z.string().min(5, "Telefon erforderlich"),
  birthDate: z.string().optional(),
  street: z.string().min(3, "Straße & Hausnummer"),
  zip: z.string().regex(/^\d{4,5}$/, "PLZ ungültig"),
  city: z.string().min(2, "Ort angeben"),
  licenses: z.record(z.string(), licenseSchema).optional(),
  drivingLicenses: z.record(z.string(), licenseSchema).optional(),
  qualifications: z.record(z.string(), qualificationSchema).optional(),
});

const billingSchema = z.object({
  company: z.string().optional(),
  salutation: z.enum(["Herr", "Frau", "Divers"]).optional(),
  firstName: z.string().min(2, "Vorname zu kurz"),
  lastName: z.string().min(2, "Nachname zu kurz"),
  email: z.string().email("Gültige E-Mail erforderlich"),
  phone: z.string().optional(),
  street: z.string().min(3, "Straße & Hausnummer"),
  zip: z.string().regex(/^\d{4,5}$/, "PLZ ungültig"),
  city: z.string().min(2, "Ort angeben"),
  vatId: z.string().optional(),
});

const schema = z.object({
  participants: z.array(participantSchema).min(1, "Mindestens 1 Teilnehmer"),
  billingSeparate: z.boolean(),
  billing: billingSchema.optional(),
  bildungsgutschein: z.boolean().optional(),
  agbAccepted: z.literal(true, {
    errorMap: () => ({ message: "AGB & Vertrag bestätigen" }),
  }),
  widerrufAccepted: z.literal(true, {
    errorMap: () => ({ message: "Widerrufsbelehrung bestätigen" }),
  }),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Datenschutz bestätigen" }),
  }),
});

type FormData = z.infer<typeof schema>;

const emptyParticipant = (): FormData["participants"][number] => ({
  salutation: "Herr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  street: "",
  zip: "",
  city: "",
  licenses: {},
  drivingLicenses: {},
  qualifications: {},
});

// ── Komponente ──────────────────────────────────────────

export function BookingForm({ course }: { course: Course }) {
  const [submitting, setSubmitting] = useState<null | "card" | "invoice">(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      participants: [emptyParticipant()],
      billingSeparate: false,
      billing: {
        company: "",
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        zip: "",
        city: "",
      },
      agbAccepted: undefined as never,
      widerrufAccepted: undefined as never,
      privacyAccepted: undefined as never,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const billingSeparate = watch("billingSeparate");

  const canCard = course.paymentOptions?.includes("card") ?? true;
  const canInvoice = course.paymentOptions?.includes("invoice") ?? true;

  // ── Builder ────────────────────────────────────────────

  const buildParticipants = (data: FormData) =>
    data.participants.map((p) => ({
      salutation: p.salutation,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      birthDate: p.birthDate,
      street: p.street,
      zip: p.zip,
      city: p.city,
      country: "DE",
      licenses: LICENSE_KEYS.flatMap((key) => {
        const l = p.licenses?.[key];
        if (!l?.selected) return [];
        return [{ key, grantedDate: l.grantedDate || undefined }];
      }),
      drivingLicenses: DRIVING_LICENSE_KEYS.flatMap((key) => {
        const l = p.drivingLicenses?.[key];
        if (!l?.selected) return [];
        return [{ key, grantedDate: l.grantedDate || undefined }];
      }),
      qualifications: QUALIFICATION_KEYS.flatMap((key) => {
        const q = p.qualifications?.[key];
        if (!q?.selected) return [];
        return [
          {
            key,
            grantedYear: q.year ? Number(q.year) : undefined,
          },
        ];
      }),
    }));

  const buildBilling = (data: FormData) => {
    if (data.billingSeparate && data.billing) {
      return {
        company: data.billing.company || undefined,
        salutation: data.billing.salutation,
        firstName: data.billing.firstName,
        lastName: data.billing.lastName,
        email: data.billing.email,
        phone: data.billing.phone,
        street: data.billing.street,
        zip: data.billing.zip,
        city: data.billing.city,
        country: "DE",
        vatId: data.billing.vatId || undefined,
      };
    }
    // kein getrennter Billing-Block → nimm ersten Teilnehmer
    const p = data.participants[0];
    return {
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      street: p.street,
      zip: p.zip,
      city: p.city,
      country: "DE",
    };
  };

  // ── Submit-Pfade ───────────────────────────────────────

  const submitCard = async (data: FormData) => {
    setSubmitting("card");
    setError(null);
    try {
      const res = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          participants: buildParticipants(data),
          billing: buildBilling(data),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Buchung konnte nicht gestartet werden");
      }
      window.location.href = json.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      setSubmitting(null);
    }
  };

  const submitInvoice = async (data: FormData) => {
    setSubmitting("invoice");
    setError(null);
    try {
      const billing = buildBilling(data);
      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          participants: buildParticipants(data),
          billing,
          acceptedAgb: data.agbAccepted,
          acceptedWiderruf: data.widerrufAccepted,
          acceptedDatenschutz: data.privacyAccepted,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Anmeldung konnte nicht abgeschickt werden");
      }
      window.location.href = `/buchung/check-email?email=${encodeURIComponent(billing.email)}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      setSubmitting(null);
    }
  };

  const handlePay = handleSubmit(submitCard);
  const handleInvoice = handleSubmit(submitInvoice);

  // ── Styles ─────────────────────────────────────────────

  const inputCls =
    "w-full border border-[var(--vfr-rule)] bg-[var(--vfr-bg)] px-3 py-2.5 text-[0.95rem] text-[var(--vfr-fg)] focus:outline-2 focus:outline-[var(--vfr-accent)] focus:border-[var(--vfr-accent)] rounded-[2px]";
  const labelCls =
    "block text-[0.72rem] font-semibold mb-1.5 uppercase tracking-[0.08em] text-[var(--vfr-fg-muted)]";
  const errCls = "mt-1 text-[0.78rem] text-[#b84b2a]";

  return (
    <form
      className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-8 space-y-8"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* ── Schritt 1 — Teilnehmer ──────────────────────── */}
      <div>
        <span className="vfr-eyebrow">Schritt 1 — Teilnehmer</span>
        <h2 className="vfr-h2 mt-3 text-[1.4rem] flex items-center gap-2">
          <Users className="h-5 w-5 text-[var(--vfr-accent)]" />
          Wer nimmt teil?
        </h2>
        <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] mt-2">
          Du kannst mehrere Teilnehmer gleichzeitig anmelden — z.B. wenn du
          Fahrlehrer aus einer Fahrschule schickst.
        </p>
      </div>

      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="border border-[var(--vfr-rule)] p-6 bg-[var(--vfr-bg-alt)] rounded-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[var(--vfr-fg)]">
              Teilnehmer {idx + 1}
            </h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="flex items-center gap-1 text-[0.82rem] text-[#b84b2a] hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Entfernen
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Anrede *</label>
              <select
                {...register(`participants.${idx}.salutation`)}
                className={inputCls}
              >
                <option>Herr</option>
                <option>Frau</option>
                <option>Divers</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Vorname *</label>
              <input {...register(`participants.${idx}.firstName`)} className={inputCls} />
              {errors.participants?.[idx]?.firstName && (
                <p className={errCls}>{errors.participants[idx]?.firstName?.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Nachname *</label>
              <input {...register(`participants.${idx}.lastName`)} className={inputCls} />
              {errors.participants?.[idx]?.lastName && (
                <p className={errCls}>{errors.participants[idx]?.lastName?.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelCls}>E-Mail *</label>
              <input
                type="email"
                {...register(`participants.${idx}.email`)}
                className={inputCls}
              />
              {errors.participants?.[idx]?.email && (
                <p className={errCls}>{errors.participants[idx]?.email?.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Telefon *</label>
              <input
                type="tel"
                {...register(`participants.${idx}.phone`)}
                className={inputCls}
              />
              {errors.participants?.[idx]?.phone && (
                <p className={errCls}>{errors.participants[idx]?.phone?.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-[1fr_120px_1fr] gap-4 mt-4">
            <div>
              <label className={labelCls}>Straße & Hausnr. *</label>
              <input {...register(`participants.${idx}.street`)} className={inputCls} />
              {errors.participants?.[idx]?.street && (
                <p className={errCls}>{errors.participants[idx]?.street?.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>PLZ *</label>
              <input {...register(`participants.${idx}.zip`)} className={inputCls} />
              {errors.participants?.[idx]?.zip && (
                <p className={errCls}>{errors.participants[idx]?.zip?.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Ort *</label>
              <input {...register(`participants.${idx}.city`)} className={inputCls} />
              {errors.participants?.[idx]?.city && (
                <p className={errCls}>{errors.participants[idx]?.city?.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className={labelCls}>Geburtsdatum</label>
            <input
              type="date"
              {...register(`participants.${idx}.birthDate`)}
              className={inputCls + " max-w-[220px]"}
            />
          </div>

          {/* Fahrlehrerlaubnis-Klassen */}
          <div className="mt-6 pt-5 border-t border-[var(--vfr-rule)]">
            <div className={labelCls + " mb-3"}>
              Vorhandene Fahrlehrerlaubnis (optional)
            </div>
            <div className="space-y-3">
              {LICENSE_KEYS.map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[1fr_180px] gap-3 items-center"
                >
                  <label className="flex items-center gap-2 text-[0.88rem] text-[var(--vfr-fg)]">
                    <input
                      type="checkbox"
                      {...register(
                        `participants.${idx}.licenses.${key}.selected`,
                      )}
                      className="h-4 w-4"
                    />
                    {LICENSE_CLASS_LABEL[key]}
                  </label>
                  <input
                    type="date"
                    aria-label={`Erteilungsdatum ${LICENSE_CLASS_LABEL[key]}`}
                    {...register(
                      `participants.${idx}.licenses.${key}.grantedDate`,
                    )}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 p-3 bg-[var(--vfr-bg)] border border-[var(--vfr-rule)] rounded-sm">
              <svg className="h-4 w-4 text-[var(--vfr-accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-[0.82rem] text-[var(--vfr-fg)]">
                <strong>Erinnerungs-Service:</strong> Mit deinem Erteilungsdatum
                erinnern wir dich gerne rechtzeitig an deine
                <strong> Pflichtfortbildung</strong> nach § 53 FahrlG
                (alle 4 Jahre, 3 Tage oder 3×1 Tag). Du bekommst dann eine Mail
                mit den nächsten passenden Terminen.
              </div>
            </div>
          </div>

          {/* Fahrerlaubnis (Führerschein C/CE/D/DE) */}
          <div className="mt-6 pt-5 border-t border-[var(--vfr-rule)]">
            <div className={labelCls + " mb-3"}>
              Vorhandene Fahrerlaubnis / Führerschein (optional)
            </div>
            <div className="space-y-3">
              {DRIVING_LICENSE_KEYS.map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[1fr_180px] gap-3 items-center"
                >
                  <label className="flex items-center gap-2 text-[0.88rem] text-[var(--vfr-fg)]">
                    <input
                      type="checkbox"
                      {...register(
                        `participants.${idx}.drivingLicenses.${key}.selected`,
                      )}
                      className="h-4 w-4"
                    />
                    {DRIVING_LICENSE_LABEL[key]}
                  </label>
                  <input
                    type="date"
                    aria-label={`Erteilungsdatum Führerschein ${DRIVING_LICENSE_LABEL[key]}`}
                    {...register(
                      `participants.${idx}.drivingLicenses.${key}.grantedDate`,
                    )}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.78rem] text-[var(--vfr-fg-soft)]">
              Eigener LKW-/Bus-Führerschein. Wichtig z.B. bei der
              Fahrlehrerausbildung Klasse CE/DE — du brauchst den
              entsprechenden Führerschein als Voraussetzung.
            </p>
          </div>

          {/* Zusatz-Qualifikationen */}
          <div className="mt-6 pt-5 border-t border-[var(--vfr-rule)]">
            <div className={labelCls + " mb-3"}>
              Weitere Qualifikationen (optional)
            </div>
            <div className="space-y-3">
              {QUALIFICATION_KEYS.map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[1fr_120px] gap-3 items-center"
                >
                  <label className="flex items-center gap-2 text-[0.88rem] text-[var(--vfr-fg)]">
                    <input
                      type="checkbox"
                      {...register(
                        `participants.${idx}.qualifications.${key}.selected`,
                      )}
                      className="h-4 w-4"
                    />
                    {QUALIFICATION_LABEL[key]}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Erteilt (Jahr)"
                    {...register(
                      `participants.${idx}.qualifications.${key}.year`,
                    )}
                    className={inputCls + " text-center"}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.78rem] text-[var(--vfr-fg-soft)]">
              Zusatzqualifikationen über die Fahrlehrerlaubnis hinaus. Jahr der
              Erteilung ist optional, hilft aber bei der Planung.
            </p>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(emptyParticipant())}
        className="w-full border-2 border-dashed border-[var(--vfr-rule)] py-3 text-[var(--vfr-accent)] font-semibold hover:bg-[var(--vfr-bg-alt)] transition flex items-center justify-center gap-2 rounded-[2px]"
      >
        <Plus className="h-4 w-4" />
        Weiteren Teilnehmer hinzufügen
      </button>

      {/* ── Schritt 2 — Rechnungsadresse ──────────────────── */}
      <div className="border-t border-[var(--vfr-rule)] pt-7">
        <span className="vfr-eyebrow">Schritt 2 — Rechnung</span>
        <h3 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-[var(--vfr-fg)] font-medium mt-3 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[var(--vfr-accent)]" />
          Rechnungsadresse.
        </h3>
        <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] mt-2">
          Standardmäßig geht die Rechnung an den ersten Teilnehmer. Bei
          Firmen-Anmeldungen kannst du eine abweichende Adresse angeben.
        </p>

        <label className="mt-5 flex items-center gap-2 text-[0.92rem] text-[var(--vfr-fg)]">
          <input
            type="checkbox"
            {...register("billingSeparate")}
            className="h-4 w-4"
          />
          Abweichende Rechnungsadresse (z.B. Firma) verwenden
        </label>

        {billingSeparate && (
          <div className="mt-5 border border-[var(--vfr-rule)] p-6 bg-[var(--vfr-bg-alt)] rounded-sm space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Firma (optional)</label>
                <input {...register("billing.company")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>USt-IdNr. (optional)</label>
                <input
                  {...register("billing.vatId")}
                  placeholder="DE…"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Anrede</label>
                <select {...register("billing.salutation")} className={inputCls}>
                  <option value="">—</option>
                  <option>Herr</option>
                  <option>Frau</option>
                  <option>Divers</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Vorname *</label>
                <input {...register("billing.firstName")} className={inputCls} />
                {errors.billing?.firstName && (
                  <p className={errCls}>{errors.billing.firstName.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Nachname *</label>
                <input {...register("billing.lastName")} className={inputCls} />
                {errors.billing?.lastName && (
                  <p className={errCls}>{errors.billing.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>E-Mail (Rechnungsempfang) *</label>
                <input
                  type="email"
                  {...register("billing.email")}
                  className={inputCls}
                />
                {errors.billing?.email && (
                  <p className={errCls}>{errors.billing.email.message}</p>
                )}
                <p className="mt-1 text-[0.75rem] text-[var(--vfr-fg-soft)]">
                  An diese Adresse geht die Bestätigungs-Mail und später die Rechnung.
                </p>
              </div>
              <div>
                <label className={labelCls}>Telefon (optional)</label>
                <input
                  type="tel"
                  {...register("billing.phone")}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-[1fr_120px_1fr] gap-4">
              <div>
                <label className={labelCls}>Straße & Hausnr. *</label>
                <input {...register("billing.street")} className={inputCls} />
                {errors.billing?.street && (
                  <p className={errCls}>{errors.billing.street.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>PLZ *</label>
                <input {...register("billing.zip")} className={inputCls} />
                {errors.billing?.zip && (
                  <p className={errCls}>{errors.billing.zip.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Ort *</label>
                <input {...register("billing.city")} className={inputCls} />
                {errors.billing?.city && (
                  <p className={errCls}>{errors.billing.city.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {course.fundingEligible && (
          <label className="mt-5 flex items-start gap-2 p-4 bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)]">
            <input
              type="checkbox"
              {...register("bildungsgutschein")}
              className="mt-1 h-4 w-4"
            />
            <span className="text-[0.88rem] text-[var(--vfr-fg)]">
              Es wird mit <strong>Bildungsgutschein</strong> der Agentur für
              Arbeit oder des Jobcenters abgerechnet. Bitte kontaktiert uns zur
              Abrechnung.
            </span>
          </label>
        )}
      </div>

      {/* ── Schritt 3 — Vertrag ─────────────────────────── */}
      <div className="border-t border-[var(--vfr-rule)] pt-7">
        <span className="vfr-eyebrow">Schritt 3 — Vertrag</span>
        <h3 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-[var(--vfr-fg)] font-medium mt-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--vfr-accent)]" />
          Ausbildungsvertrag lesen und bestätigen.
        </h3>

        <div className="mt-4 bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] rounded-sm max-h-[280px] overflow-y-auto p-5 text-[0.88rem] text-[var(--vfr-fg)] leading-relaxed">
          <h4 className="font-semibold mt-0 mb-2">Verbindliche Anmeldung</h4>
          <p className="m-0 mb-3">
            Zwischen <strong>VFR Verkehrsfachschule Rheinland GmbH</strong>,
            Lülsdorfer Straße 24, 53859 Niederkassel („VFR") und
            dem/der Rechnungsempfänger:in bzw. den aufgeführten Teilnehmer:innen
            wird folgender Ausbildungsvertrag geschlossen:
          </p>
          <p className="m-0 mb-3">
            <strong>§ 1 Kurs:</strong> {course.title}
            {course.subtitle ? ` (${course.subtitle})` : ""} —
            vom {formatDate(course.startDate)} bis {formatDate(course.endDate)} in {course.location}.
          </p>
          <p className="m-0 mb-3">
            <strong>§ 2 Kursgebühr:</strong> {formatEUR(course.priceCents)} je Teilnehmer
            {course.vatExempt ? " (USt-befreit nach § 4 Nr. 21 UStG)" : ""}.
            Die Rechnung wird nach Zahlungseingang bzw. nach Anmeldung per
            E-Mail zugestellt.
          </p>
          <p className="m-0 mb-3">
            <strong>§ 3 Widerruf:</strong> Teilnehmer:innen haben ein
            14-tägiges Widerrufsrecht gemäß Verbraucherwiderrufsrecht. Details
            siehe{" "}
            <a href="/widerruf" target="_blank" className="text-[var(--vfr-accent)] underline">
              Widerrufsbelehrung
            </a>.
          </p>
          <p className="m-0 mb-3">
            <strong>§ 4 AGB:</strong> Es gelten unsere{" "}
            <a href="/agb" target="_blank" className="text-[var(--vfr-accent)] underline">
              Allgemeinen Geschäftsbedingungen
            </a>.
          </p>
          <p className="m-0 mb-3">
            <strong>§ 5 Datenschutz:</strong> Die Datenverarbeitung erfolgt
            gemäß unserer{" "}
            <a href="/datenschutz" target="_blank" className="text-[var(--vfr-accent)] underline">
              Datenschutzerklärung
            </a>.
          </p>
          <p className="m-0 mb-3">
            <strong>§ 6 Bestätigung per E-Mail:</strong> Nach Absenden erhält
            der Rechnungsempfänger eine E-Mail mit einem Bestätigungslink.
            Erst nach Klick auf diesen Link ist die Anmeldung verbindlich. Der
            Kursplatz ist nach schriftlicher Bestätigung durch VFR fest
            reserviert — spätestens innerhalb von 3 Werktagen.
          </p>
          <p className="m-0 text-[var(--vfr-fg-muted)] text-[0.82rem] italic">
            Vertragsstand: {CONTRACT_VERSION}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("agbAccepted")}
              className="mt-1 h-4 w-4"
            />
            <span className="text-[0.88rem] text-[var(--vfr-fg)]">
              Ich akzeptiere die{" "}
              <a href="/agb" target="_blank" className="text-[var(--vfr-accent-dark)] underline">
                AGB
              </a>{" "}
              und den Ausbildungsvertrag oben. *
            </span>
          </label>
          {errors.agbAccepted && <p className={errCls}>{errors.agbAccepted.message}</p>}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("widerrufAccepted")}
              className="mt-1 h-4 w-4"
            />
            <span className="text-[0.88rem] text-[var(--vfr-fg)]">
              Ich wurde über das{" "}
              <a href="/widerruf" target="_blank" className="text-[var(--vfr-accent-dark)] underline">
                Widerrufsrecht
              </a>{" "}
              belehrt. *
            </span>
          </label>
          {errors.widerrufAccepted && (
            <p className={errCls}>{errors.widerrufAccepted.message}</p>
          )}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("privacyAccepted")}
              className="mt-1 h-4 w-4"
            />
            <span className="text-[0.88rem] text-[var(--vfr-fg)]">
              Ich habe die{" "}
              <a href="/datenschutz" target="_blank" className="text-[var(--vfr-accent-dark)] underline">
                Datenschutzerklärung
              </a>{" "}
              gelesen. *
            </span>
          </label>
          {errors.privacyAccepted && (
            <p className={errCls}>{errors.privacyAccepted.message}</p>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 p-4 bg-[var(--vfr-bg-alt)] border-l-4 border-[var(--vfr-accent)]">
          <Mail className="h-5 w-5 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
          <div className="text-[0.88rem] text-[var(--vfr-fg)]">
            <strong>Bestätigung per E-Mail:</strong> Nach Absenden bekommt der
            Rechnungsempfänger eine E-Mail mit Bestätigungslink. Erst nach Klick
            auf den Link ist die Anmeldung verbindlich — sicherer als eine
            handschriftliche Unterschrift und funktioniert auf jedem Gerät.
          </div>
        </div>
      </div>

      {/* ── Schritt 4 — Zahlungsweg ─────────────────────── */}
      <div className="border-t border-[var(--vfr-rule)] pt-7">
        <span className="vfr-eyebrow">Schritt 4 — Zahlungsweg</span>
        <h3 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-[var(--vfr-fg)] font-medium mt-3">
          Wie möchtest du bezahlen?
        </h3>
        <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] mt-2">
          Gesamtpreis für <strong>{fields.length}</strong> Teilnehmer:{" "}
          <strong>{formatEUR(course.priceCents * fields.length)}</strong>
        </p>

        {error && (
          <div className="mt-4 bg-[#fbeae5] border border-[#b84b2a]/30 px-4 py-3 text-[0.88rem] text-[#8a3a1f]">
            {error}
          </div>
        )}

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {canCard && (
            <button
              type="button"
              onClick={handlePay}
              disabled={submitting !== null}
              className="group text-left p-5 bg-[var(--vfr-accent)] text-white hover:bg-[var(--vfr-accent-dark)] transition rounded-[2px] disabled:opacity-60 flex flex-col gap-2"
            >
              <CreditCard className="h-5 w-5" />
              <div className="font-semibold text-[1rem] flex items-center gap-2">
                {submitting === "card" && <Loader2 className="h-4 w-4 animate-spin" />}
                Jetzt bezahlen
              </div>
              <div className="text-[0.82rem] text-white/85">
                Apple Pay, Google Pay, Kreditkarte, SEPA — sofort abgeschlossen,
                Rechnung per E-Mail.
              </div>
            </button>
          )}

          {canInvoice && (
            <button
              type="button"
              onClick={handleInvoice}
              disabled={submitting !== null}
              className="group text-left p-5 bg-[var(--vfr-bg)] border-2 border-[var(--vfr-fg)] text-[var(--vfr-fg)] hover:bg-[var(--vfr-fg)] hover:text-white transition rounded-[2px] disabled:opacity-60 flex flex-col gap-2"
            >
              <Receipt className="h-5 w-5" />
              <div className="font-semibold text-[1rem] flex items-center gap-2">
                {submitting === "invoice" && <Loader2 className="h-4 w-4 animate-spin" />}
                Verbindlich anmelden — Rechnung folgt
              </div>
              <div className="text-[0.82rem] opacity-80">
                Anmeldung jetzt absenden, Bestätigungslink per E-Mail, Rechnung
                danach mit 14 Tagen Zahlungsziel.
              </div>
            </button>
          )}
        </div>

        <p className="mt-4 text-[0.78rem] text-[var(--vfr-fg-soft)]">
          Mit dem Absenden erfolgt eine verbindliche Anmeldung (nach E-Mail-
          bzw. Zahlungs-Bestätigung). Die Plätze sind nach schriftlicher
          Bestätigung durch VFR fest reserviert (in der Regel innerhalb 1–3
          Werktage).
        </p>
      </div>
    </form>
  );
}
