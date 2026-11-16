import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Gerichtsurteile für Fahrlehrer",
  description:
    "Kuratierte Gerichtsurteile mit Bezug zur Fahrlehrer-Tätigkeit — verständlich aufbereitet.",
  alternates: { canonical: "/gerichtsurteile" },
};

const urteile = [
  {
    az: "BVerwG 3 C 22.20",
    t: "Fahrerlaubnis bei Punktekonto über 8 Punkten",
    d: "Das Bundesverwaltungsgericht entschied über die Aufhebung der Fahrerlaubnis bei Erreichen von 8 Punkten im Fahreignungsregister.",
  },
  {
    az: "OLG Köln 1 RBs 145/22",
    t: "Aufsichtspflicht beim Fahrunterricht",
    d: "Klärung zur strafrechtlichen Verantwortung des Fahrlehrers bei Verkehrsverstößen des Fahrschülers.",
  },
  {
    az: "VG Aachen 3 K 1820/21",
    t: "Erlaubnisentzug bei mangelnder Eignung",
    d: "Voraussetzungen für den Entzug der Fahrlehrererlaubnis bei körperlicher oder geistiger Eignungseinschränkung.",
  },
];

export default function UrteilePage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        image={IMG.gerichtsurteile}
        title="Aktuelle Gerichtsurteile."
        lead="Kuratierte Urteile mit unmittelbarem Bezug zur Fahrlehrer-Tätigkeit — verständlich aufbereitet und regelmäßig ergänzt."
      />

      <section className="vfr-section">
        <div className="vfr-wrap grid gap-4">
          {urteile.map((u) => (
            <article
              key={u.az}
              className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-7"
            >
              <div className="text-[0.75rem] font-mono text-[var(--vfr-accent-dark)] tracking-wider">
                {u.az}
              </div>
              <h3 className="mt-2 font-[family-name:var(--font-serif)] text-[1.2rem] text-[var(--vfr-fg)] font-medium">
                {u.t}
              </h3>
              <p className="mt-2 text-[var(--vfr-fg-muted)] text-[0.95rem] m-0">
                {u.d}
              </p>
            </article>
          ))}
          <p className="mt-4 text-[0.82rem] text-[var(--vfr-fg-soft)]">
            Diese Zusammenfassungen ersetzen keine Rechtsberatung. Fragen zur
            Anwendung im Einzelfall klärst du am besten mit einer Fachanwältin
            oder einem Fachanwalt.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
