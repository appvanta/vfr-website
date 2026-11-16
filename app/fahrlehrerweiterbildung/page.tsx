import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CourseCard } from "@/components/CourseCard";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { faqByTopicStrict } from "@/lib/faq";
import { listCourses } from "@/lib/flario";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Fahrlehrerweiterbildung — BWL, Seminarleitung, Ausbildungsfahrlehrer",
  description:
    "Weiterbildungen für Fahrlehrerinnen und Fahrlehrer: Seminarleitung, Ausbildungsfahrlehrer, BWL für Fahrschulinhaber, MPU-Berater.",
  alternates: { canonical: "/fahrlehrerweiterbildung" },
};

const themen = [
  {
    title: "Grundeinweisung Seminarleitung",
    text: "Grundlagen für die Leitung von Aufbauseminaren und Fahreignungsseminaren.",
  },
  {
    title: "Seminarleiter:in ASF",
    text: "Qualifikation zur Leitung von Aufbauseminaren für Fahranfänger.",
  },
  {
    title: "Seminarleiter:in FES",
    text: "Qualifikation zur Leitung von Fahreignungsseminaren.",
  },
  {
    title: "Ausbildungsfahrlehrer:in",
    text: "Ausbildung zum Begleiter von Fahrlehreranwärtern im Lehrpraktikum.",
  },
  {
    title: "BWL für Fahrschulinhaber:innen",
    text: "Betriebswirtschaftliche Grundlagen für die selbstständige Tätigkeit.",
  },
  {
    title: "MPU-Berater:in",
    text: "Qualifizierte Beratung von Teilnehmern vor der medizinisch-psychologischen Untersuchung.",
  },
];

export default async function WeiterbildungPage() {
  const courses = await listCourses({
    category: "weiterbildung",
    onlyBookable: true,
  });

  return (
    <>
      <PageHero
        eyebrow="Weiterbildung"
        image="/impressionen/schulungsraum.jpg"
        title="Deine nächste Karrierestufe."
        lead="Ob Seminarleiter, Ausbildungsfahrlehrer, selbstständiger Fahrschulinhaber oder MPU-Berater: Wir bilden die Qualifikationen aus, die du für den nächsten Schritt brauchst."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Weiterbildungs-Themen</span>
          <h2 className="vfr-h2 mt-4">Qualifikationen im Überblick.</h2>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themen.map((t, i) => (
              <div
                key={t.title}
                className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-6"
              >
                <div className="font-[family-name:var(--font-serif)] italic text-[0.85rem] text-[var(--vfr-accent)] mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-[1.15rem] text-[var(--vfr-fg)] mb-2 font-medium">
                  {t.title}
                </h3>
                <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] m-0">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div>
              <span className="vfr-eyebrow">Nächste Termine</span>
              <h2 className="vfr-h2 mt-4">Weiterbildungs-Starttermine.</h2>
            </div>
            <Link href="/termine-preise" className="vfr-btn vfr-btn--ghost !py-3 !px-5">
              Alle Termine ansehen →
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="text-[var(--vfr-fg-muted)]">
              Aktuell keine Termine verfügbar. Ruf uns gerne an oder trag dich in
              den Newsletter ein.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FAQ
        entries={faqByTopicStrict("weiterbildung", "buchung-zahlung")}
        title="Fragen zur Weiterbildung."
      />

      <CTASection />
    </>
  );
}
