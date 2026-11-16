import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Stellenbörse für Fahrlehrer:innen",
  description:
    "Offene Fahrlehrer-Stellen von Partnerfahrschulen aus dem VFR-Netzwerk im Rheinland und darüber hinaus.",
  alternates: { canonical: "/stellenboerse" },
};

const jobs = [
  {
    title: "Fahrlehrer:in Klasse BE",
    company: "Fahrschule Partner Köln",
    region: "Köln",
    salary: "nach Vereinbarung",
  },
  {
    title: "Fahrlehrer:in Klasse CE",
    company: "LKW-Schule im Rheinland",
    region: "Bonn",
    salary: "nach Vereinbarung",
  },
  {
    title: "Praxis-Ausbilder:in Klasse A",
    company: "Motorrad-Partner Düsseldorf",
    region: "Düsseldorf",
    salary: "nach Vereinbarung",
  },
  {
    title: "Fahrlehrer:in Klasse DE",
    company: "ÖPNV-Partner Rhein-Sieg",
    region: "Siegburg",
    salary: "nach Vereinbarung",
  },
];

export default function StellenPage() {
  return (
    <>
      <PageHero
        eyebrow="Stellenbörse"
        image={IMG.stellenboerse}
        title="Offene Stellen aus unserem Netzwerk."
        lead="Unsere Partnerfahrschulen suchen regelmäßig Fahrlehrerinnen und Fahrlehrer. Wir vermitteln gern Kontakte — die Entscheidung über Anstellung und Konditionen trifft der jeweilige Betrieb."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          <div className="grid gap-4">
            {jobs.map((j) => (
              <article
                key={j.title + j.company}
                className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-6 flex flex-wrap gap-4 items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold">
                    {j.region}
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] text-[1.2rem] text-[var(--vfr-fg)] font-medium mt-1">
                    {j.title}
                  </h3>
                  <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] mt-1 m-0">
                    {j.company} · Vergütung: {j.salary}
                  </p>
                </div>
                <Link
                  href="/kontakt#rueckruf"
                  className="vfr-btn vfr-btn--ghost !py-3 !px-5"
                >
                  Kontakt anfragen →
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-8 text-[0.88rem] text-[var(--vfr-fg-soft)]">
            Konkrete Vergütung, Umfang und Startzeitpunkt werden direkt mit der
            jeweiligen Fahrschule geklärt. Wir sprechen den Kontakt nur mit
            deiner Zustimmung an.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
