import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ShieldCheck, CreditCard } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BookingForm } from "@/components/BookingForm";
import { getCourse } from "@/lib/flario";
import { formatDate, formatEUR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kurs buchen",
  robots: { index: false, follow: false },
};

export default async function BuchungPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course || !course.bookable || course.seatsAvailable <= 0) notFound();

  return (
    <>
      <PageHero
        eyebrow="Buchung"
        title={<>{course.title} <em>buchen.</em></>}
        lead="In wenigen Schritten zum Platz — sicher bezahlen mit PayPal, Kreditkarte oder SEPA-Lastschrift."
      />

      <section className="vfr-section">
        <div className="vfr-wrap grid lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14 items-start">
          <div className="min-w-0">
            <BookingForm course={course} />
          </div>

          <aside className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-7 h-fit lg:sticky lg:top-24">
            <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold">
              Deine Buchung
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-[1.2rem] text-[var(--vfr-fg)] font-medium mt-2">
              {course.title}
            </h2>
            {course.subtitle && (
              <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] mt-1 italic m-0">
                {course.subtitle}
              </p>
            )}

            <div className="mt-5 space-y-3 text-[0.9rem] text-[var(--vfr-fg)]">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-[var(--vfr-accent)] mt-1 shrink-0" />
                <span>
                  {formatDate(course.startDate)} – {formatDate(course.endDate)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[var(--vfr-accent)] mt-1 shrink-0" />
                <span>{course.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-[var(--vfr-accent)] mt-1 shrink-0" />
                <span>Plätze verfügbar</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--vfr-rule)]">
              <div className="flex items-baseline justify-between">
                <span className="text-[var(--vfr-fg-muted)] text-[0.9rem]">Gesamtpreis</span>
                <span className="font-[family-name:var(--font-serif)] text-[1.8rem] text-[var(--vfr-fg)] tabular-nums font-medium">
                  {formatEUR(course.priceCents)}
                </span>
              </div>
              {course.vatExempt && (
                <div className="text-[0.75rem] text-[var(--vfr-fg-soft)] mt-1">
                  USt-frei nach § 4 Nr. 21 UStG
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2 text-[0.78rem] text-[var(--vfr-fg-muted)]">
              <p className="flex items-start gap-2 m-0">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
                Sichere Bezahlung über Stripe (PCI-DSS Level 1)
              </p>
              <p className="flex items-start gap-2 m-0">
                <CreditCard className="h-3.5 w-3.5 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
                PayPal, Visa, Mastercard, SEPA, Klarna
              </p>
              <p className="flex items-start gap-2 m-0">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--vfr-accent)] shrink-0 mt-0.5" />
                Rechnung automatisch nach Zahlungseingang
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
