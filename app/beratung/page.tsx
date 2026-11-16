import type { Metadata } from "next";
import { Heart, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { listAppointmentSlots } from "@/lib/flario";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Beratung buchen",
  description:
    "Buche deinen kostenlosen Beratungstermin: Telefon, Videokonferenz oder vor Ort in Niederkassel. Einfach Zeitfenster wählen und wir melden uns pünktlich. Unser Büro ist für dich da — vor, während und nach der Ausbildung.",
  alternates: { canonical: "/beratung" },
};

export default async function BeratungPage() {
  const slots = await listAppointmentSlots();

  return (
    <>
      <PageHero
        eyebrow="Kostenlose Beratung"
        image={IMG.kontakt ?? IMG.termine}
        title="Lass uns reden."
        lead="Telefon, Video oder bei uns vor Ort — wähle, was dir passt. In 30 Minuten klären wir deine Fragen zur Ausbildung, Förderung und zu passenden Terminen."
        breadcrumbs={[{ label: "Beratung", href: "/beratung" }]}
      />

      {/* Persönlich für dich — Bürokräfte-Vorstellung */}
      <section className="vfr-section">
        <div className="vfr-wrap">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
            {/* Bürokräfte-Foto Platzhalter */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] rounded-sm">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <svg
                  className="h-24 w-24 text-[var(--vfr-fg-soft)]/40 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="text-[0.9rem] text-[var(--vfr-fg-soft)]">
                  Team-Foto Büro folgt
                </div>
                <div className="text-[0.75rem] text-[var(--vfr-fg-soft)]/80 mt-1">
                  „Das sind wir — deine Ansprechpartner"
                </div>
              </div>
            </div>

            {/* Text rechts */}
            <div>
              <span className="vfr-eyebrow">Persönlich für dich</span>
              <h2 className="vfr-h2 mt-3">
                Unser Büro ist für dich da. Immer.
              </h2>
              <div className="mt-6 space-y-4 text-[1rem] leading-relaxed text-[var(--vfr-fg)]">
                <p className="m-0">
                  Bei uns bekommst du keine Hotline, keine Warteschleife und
                  kein Ticket-System. Du bekommst <strong>echte Menschen</strong>,
                  die dich mit Namen kennen und sich die Zeit nehmen, die du
                  brauchst.
                </p>
                <p className="m-0 text-[var(--vfr-fg-muted)]">
                  Egal ob du vor der Entscheidung stehst, mitten in der
                  Ausbildung Fragen hast oder auch{" "}
                  <strong>Jahre nach dem Abschluss</strong> zur Fortbildung
                  wiederkommst — wir sind für dich da.
                </p>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2 p-3 bg-[var(--vfr-bg-alt)] rounded-sm">
                  <Heart className="h-4 w-4 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
                  <div className="text-[0.82rem] text-[var(--vfr-fg)]">
                    <strong>Persönlich</strong><br />
                    <span className="text-[var(--vfr-fg-muted)]">
                      Du kennst uns beim Namen
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-[var(--vfr-bg-alt)] rounded-sm">
                  <Phone className="h-4 w-4 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
                  <div className="text-[0.82rem] text-[var(--vfr-fg)]">
                    <strong>Erreichbar</strong><br />
                    <span className="text-[var(--vfr-fg-muted)]">
                      Mo–Fr 07:30–16:00
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-[var(--vfr-bg-alt)] rounded-sm">
                  <MessageCircle className="h-4 w-4 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
                  <div className="text-[0.82rem] text-[var(--vfr-fg)]">
                    <strong>Auch nach</strong><br />
                    <span className="text-[var(--vfr-fg-muted)]">
                      der Ausbildung
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap">
          <AppointmentBooking slots={slots} />
        </div>
      </section>
    </>
  );
}
