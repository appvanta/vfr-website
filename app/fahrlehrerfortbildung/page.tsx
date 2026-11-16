import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CourseCard } from "@/components/CourseCard";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { faqByTopicStrict } from "@/lib/faq";
import { listCourses } from "@/lib/flario";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Fahrlehrerfortbildung — § 53 FahrlG",
  description:
    "Pflichtfortbildungen für aktive Fahrlehrer:innen: § 53 (1), ASF und FES nach § 53 (2), Ausbildungsfahrlehrer nach § 53 (3), § 7 BKrFQV.",
  alternates: { canonical: "/fahrlehrerfortbildung" },
};

const themen = [
  {
    code: "§ 53 (1)",
    title: "Allgemeine Fortbildung",
    text: "Pflichtfortbildung für alle Fahrlehrerinnen und Fahrlehrer. 4 Tage Theorie und aktuelle Themen, spätestens alle 4 Jahre zu absolvieren.",
  },
  {
    code: "§ 53 (2)",
    title: "ASF- und FES-Fortbildung",
    text: "Fortbildung für Seminarleiter im Aufbauseminar (ASF) und im Fahreignungsseminar (FES). Jeweils in eigenen Terminen.",
  },
  {
    code: "§ 53 (3)",
    title: "Ausbildungsfahrlehrer-Fortbildung",
    text: "Für Fahrlehrer, die Fahrlehreranwärter im Lehrpraktikum begleiten. Rechtsgrundlagen und aktuelle Praxis.",
  },
  {
    code: "§ 7",
    title: "BKrFQV-Fortbildung",
    text: "Für Fahrlehrer, die in der Berufskraftfahrer-Qualifikation unterrichten. Nach § 7 BKrFQV.",
  },
  {
    code: "Reform",
    title: "Reform der Fahrausbildung",
    text: "Alles zu den neuen Inhalten und Terminen der aktuellen Reform. Was ändert sich für Fahrschulen konkret?",
  },
];

export default async function FortbildungPage() {
  const courses = await listCourses({ category: "fortbildung", onlyBookable: true });

  return (
    <>
      <PageHero
        eyebrow="Fortbildung"
        image="/impressionen/schulungsraum.jpg"
        title="Fortbildung für aktive Fahrlehrer:innen."
        lead="Wir erfüllen deine gesetzliche Fortbildungspflicht nach § 53 FahrlG — praxisnah, didaktisch sauber und mit Inhalten, die du sofort im Unterricht einsetzen kannst."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Übersicht</span>
          <h2 className="vfr-h2 mt-4">Finde deine passende Fortbildung.</h2>
          <p className="text-[var(--vfr-fg-muted)] max-w-[55ch] mb-10">
            Wir decken alle Pflicht-Varianten ab. Schau durch die Module oder
            ruf kurz an — dann klären wir gemeinsam, welche Fortbildung in
            deinem Fall vorgeschrieben ist.
          </p>

          <div className="grid lg:grid-cols-2 gap-px bg-[var(--vfr-rule)] border border-[var(--vfr-rule)]">
            {themen.map((t) => (
              <div
                key={t.code}
                className="bg-[var(--vfr-card)] p-7 flex flex-col min-h-[200px]"
              >
                <div className="font-[family-name:var(--font-serif)] text-[1.5rem] font-medium text-[var(--vfr-accent)] leading-none mb-3 tracking-tight">
                  {t.code}
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-[1.2rem] text-[var(--vfr-fg)] mb-2 font-medium">
                  {t.title}
                </h3>
                <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] m-0">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gemeinsames Mittagessen — unser Fortbildungs-Mehrwert */}
      <section
        className="vfr-section"
        style={{
          background: "var(--vfr-dark)",
          color: "#fff",
          paddingBlock: "80px",
        }}
      >
        <div className="vfr-wrap grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          <div>
            <span
              className="vfr-eyebrow"
              style={{ color: "#fff", opacity: 0.85 }}
            >
              Mittags mit Kollegen
            </span>
            <h2
              className="mt-3"
              style={{
                fontSize: "clamp(28px, 3.8vw, 42px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "#fff",
              }}
            >
              Fortbildung endet nicht im Seminarraum.
            </h2>
            <p
              className="mt-5"
              style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: 17,
                lineHeight: 1.6,
              }}
            >
              In unseren Fortbildungen gehen wir mittags gemeinsam essen — ganz
              bewusst abseits vom Unterricht. Zeit zum Austausch unter Kollegen,
              zum Vernetzen und für Gespräche, die man im Seminarraum selten
              führen kann.
            </p>
            <p
              className="mt-4"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Das Mittagessen ist Teil der Fortbildung — keine zusätzlichen
              Kosten. Wir übernehmen die Organisation, du musst nur Appetit
              mitbringen.
            </p>
          </div>

          {/* Mosaik-Grid mit 4 Essen-Fotos */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "140px",
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ gridColumn: "span 2", gridRow: "span 2" }}
            >
              <Image
                src="/impressionen/fortbildung-mittagessen.jpg"
                alt="Teilnehmer beim gemeinsamen Mittagessen"
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden">
              <Image
                src="/impressionen/buffet-warm.jpg"
                alt="Warmes Buffet"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden">
              <Image
                src="/impressionen/essen-detail.jpg"
                alt="Spätzle und Beilagen"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div
              className="relative overflow-hidden"
              style={{ gridColumn: "span 3", gridRow: "span 2" }}
            >
              <Image
                src="/impressionen/gemeinsames-essen.jpg"
                alt="Gemeinsames Mittagessen in Gesellschaft"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div>
              <span className="vfr-eyebrow">Nächste Termine</span>
              <h2 className="vfr-h2 mt-4">Fortbildungs-Starttermine.</h2>
            </div>
            <Link href="/termine-preise" className="vfr-btn vfr-btn--ghost !py-3 !px-5">
              Alle Termine ansehen →
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="text-[var(--vfr-fg-muted)]">
              Aktuell keine Termine verfügbar. Trag dich gerne in unseren
              Newsletter ein, dann melden wir uns bei neuen Terminen.
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
        entries={faqByTopicStrict("fortbildung", "buchung-zahlung")}
        title="Fragen zur Fortbildung."
      />

      <CTASection
        title="Nicht sicher, welche Fortbildung du brauchst?"
        lead="Ruf uns an — wir helfen dir, deine Pflichtfortbildung rechtzeitig zu planen."
        primaryLabel="Kurz anrufen"
        primaryHref="/kontakt"
      />
    </>
  );
}
