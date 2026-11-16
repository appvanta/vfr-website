import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { faqByTopicStrict } from "@/lib/faq";
import { IMG } from "@/lib/images";


export const metadata: Metadata = {
  title: "Förderung & Finanzierung",
  description:
    "Fördermöglichkeiten für deine Fahrlehrerausbildung: Agentur für Arbeit, Jobcenter, Aufstiegs-BAföG, BFD Bundeswehr, Rentenversicherung, Bildungsscheck.",
  alternates: { canonical: "/foerderung" },
};

const optionen = [
  {
    title: "Agentur für Arbeit",
    sub: "Bildungsgutschein",
    text: "Bildungsgutschein nach § 81 SGB III. Als AZAV-zertifizierte Einrichtung können wir eingelöste Bildungsgutscheine annehmen. Die Bewilligung erfolgt individuell durch die Arbeitsagentur.",
    logo: "/logos/ba.png",
    logoW: 600,
    logoH: 160,
  },
  {
    title: "Jobcenter",
    sub: "Einzelfallförderung",
    text: "Förderung nach SGB II im individuellen Fall. Das Jobcenter prüft, ob eine Ausbildung zur beruflichen Zukunft passt und finanziert werden kann.",
    logo: "/logos/jobcenter.png",
    logoW: 500,
    logoH: 100,
  },
  {
    title: "Aufstiegs-BAföG",
    sub: "nach Prüfung",
    text: "Das Aufstiegs-BAföG kann unter bestimmten Voraussetzungen für die Fahrlehrerausbildung in Betracht kommen. Vor Veröffentlichung einer Förderzusage wird die konkrete Förderfähigkeit des Lehrgangs geprüft.",
    logo: "/logos/aufstiegs-bafoeg.jpg",
    logoW: 500,
    logoH: 300,
  },
  {
    title: "Berufsförderungsdienst der Bundeswehr",
    sub: "BFD",
    text: "Für Soldatinnen und Soldaten auf Zeit stehen über den BFD Förderwege zur Verfügung. Ansprechpartner ist der jeweilige BFD vor Ort.",
    logo: "/logos/bfd.jpg",
    logoW: 400,
    logoH: 220,
  },
  {
    title: "Deutsche Rentenversicherung",
    sub: "Leistungen zur Teilhabe am Arbeitsleben",
    text: "Die DRV kann unter bestimmten gesundheitlichen und beruflichen Voraussetzungen Leistungen zur Teilhabe am Arbeitsleben (LTA) gewähren.",
    logo: "/logos/drv.png",
    logoW: 500,
    logoH: 180,
  },
  {
    title: "DGUV",
    sub: "Berufsgenossenschaften",
    text: "Berufsgenossenschaften können im Rahmen der Teilhabe am Arbeitsleben Umschulungen und Weiterbildungen fördern — z.B. nach einem Arbeitsunfall.",
    logo: "/logos/dguv.jpg",
    logoW: 240,
    logoH: 220,
  },
  {
    title: "Weitere Programme",
    sub: "z. B. Bildungsscheck",
    text: "Je nach Bundesland und persönlicher Situation kommen weitere Programme wie der Bildungsscheck infrage. Aktuelle Verfügbarkeit und Voraussetzungen prüfen wir gemeinsam.",
    logo: "/logos/bildungsscheck.png",
    logoW: 900,
    logoH: 500,
  },
];

export default function FoerderungPage() {
  return (
    <>
      <PageHero
        eyebrow="Fördermöglichkeiten"
        image={IMG.foerderung}
        title="Deine Fördermöglichkeiten."
        lead="Für deine Fahrlehrerausbildung können verschiedene Förder- und Finanzierungsmöglichkeiten infrage kommen. Wir unterstützen dich dabei, die passenden Möglichkeiten zu prüfen."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Übersicht</span>
          <h2 className="vfr-h2 mt-4">Mögliche Förderwege.</h2>
          <p className="text-[var(--vfr-fg-muted)] max-w-[60ch] mb-10">
            Welcher Weg der richtige ist, hängt von deiner persönlichen Situation
            ab. Wir prüfen gemeinsam, was realistisch ist — ohne pauschale
            Versprechen.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            {optionen.map((o) => {
              const logoH = 48;
              const logoW = Math.round((o.logoW / o.logoH) * logoH);
              return (
                <div
                  key={o.title}
                  className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-7 flex flex-col"
                >
                  <div
                    className="flex items-center justify-start mb-5"
                    style={{ minHeight: 60 }}
                  >
                    <Image
                      src={o.logo}
                      alt={o.title}
                      width={logoW}
                      height={logoH}
                      style={{
                        maxWidth: 180,
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] mb-2 font-semibold">
                    {o.sub}
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-[var(--vfr-fg)] mb-3 font-medium">
                    {o.title}
                  </h3>
                  <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] m-0">
                    {o.text}
                  </p>
                </div>
              );
            })}
          </div>

          <p
            className="text-center mt-10"
            style={{
              fontSize: 11,
              color: "var(--vfr-fg-soft)",
              maxWidth: 640,
              margin: "32px auto 0",
            }}
          >
            Logos der jeweiligen Rechteinhaber. Die VFR ist als AZAV-zertifizierte
            Einrichtung anerkannt; die konkrete Förderfähigkeit wird im Einzelfall
            durch den jeweiligen Kostenträger geprüft.
          </p>
        </div>
      </section>

      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <span className="vfr-eyebrow">So gehen wir vor</span>
            <h2 className="vfr-h2 mt-4">Von der Anfrage zur Entscheidung.</h2>
            <ol className="mt-6 space-y-5 list-none p-0">
              {[
                {
                  n: "01",
                  t: "Erstberatung",
                  d: "Du schilderst uns deine Ausgangslage — beruflich und zeitlich.",
                },
                {
                  n: "02",
                  t: "Förderwege prüfen",
                  d: "Wir sagen dir, welche Programme für dich plausibel sind und worauf zu achten ist.",
                },
                {
                  n: "03",
                  t: "Antrag vorbereiten",
                  d: "Wir unterstützen bei den nötigen Unterlagen und Nachweisen — die eigentliche Bewilligung liegt beim jeweiligen Träger.",
                },
                {
                  n: "04",
                  t: "Start der Ausbildung",
                  d: "Sobald die Förderung bewilligt ist, melden wir dich zum passenden Lehrgang an.",
                },
              ].map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="font-[family-name:var(--font-serif)] italic text-[var(--vfr-accent)] text-[0.95rem]">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-sans text-[1rem] font-semibold text-[var(--vfr-fg)]">
                      {s.t}
                    </h3>
                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] mt-1">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-7 h-fit">
            <h3 className="font-[family-name:var(--font-serif)] text-[1.3rem] text-[var(--vfr-fg)] font-medium">
              Wichtiger Hinweis
            </h3>
            <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] mt-3">
              Fördermöglichkeiten sind keine pauschalen Zusagen. Jede Maßnahme,
              die persönlichen Voraussetzungen und die aktuelle Programmlage
              müssen individuell geprüft werden. Wir vermitteln keine
              automatischen Bewilligungen — die Entscheidung trifft der jeweilige
              Kostenträger.
            </p>
          </aside>
        </div>
      </section>

      <FAQ
        entries={faqByTopicStrict("foerderung", "buchung-zahlung")}
        title="Fragen zur Förderung."
      />

      <CTASection
        title="Lass uns deinen Förderweg gemeinsam prüfen."
        lead="Kostenlose Erstberatung — telefonisch oder per Mail."
      />
    </>
  );
}
