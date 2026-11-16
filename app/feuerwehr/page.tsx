import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { faqByTopicStrict } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Feuerwehr-Schulungen bei der VFR",
  description:
    "Spezialausbildung für Feuerwehren: Fahrerlaubnis Klasse C & CE, Einweisungsfahrten, Einsatzfahrten nach § 35/§ 38 StVO, Ladungssicherung, Geländetraining. Von erfahrenen Ausbildern.",
  alternates: { canonical: "/feuerwehr" },
};

const angebote = [
  {
    nr: "01",
    titel: "Fahrerlaubnis Klasse C & CE",
    text: "Führerschein-Ausbildung für Feuerwehr-Angehörige — Klasse C (LKW über 3,5 t) und CE (LKW mit Anhänger). Theorie- und Praxisunterricht speziell im Hinblick auf Einsatzfahrzeuge: LF, HLF, TLF und Rüstwagen. Auf Wunsch mit Kostenübernahme durch die Kommune.",
  },
  {
    nr: "02",
    titel: "Einweisungsfahrten auf Einsatzfahrzeugen",
    text: "Individuelle Einweisung neuer Maschinisten auf das konkrete Einsatzfahrzeug — direkt an eurem Standort oder bei uns. Fahrzeugspezifika, Maße, Lastverhalten, Besonderheiten im Alarmfall. Auch für Umsteiger von PKW auf große Einsatzfahrzeuge.",
  },
  {
    nr: "03",
    titel: "Einsatzfahrten nach § 35 und § 38 StVO",
    text: "Sonder- und Wegerechte sicher anwenden. Rechtliche Grenzen, Verantwortung des Fahrzeugführers, Fahrtechnik unter Einsatzbedingungen. Theoretische und praktische Module.",
  },
  {
    nr: "04",
    titel: "Ladungssicherung-Seminar",
    text: "Richtiges Sichern von Ausrüstung, Gerätschaften und Material auf Einsatzfahrzeugen. Rechtliche Grundlagen, Praxisübungen am echten Fahrzeug, Dokumentation. Für Maschinisten und Gerätewarte.",
  },
  {
    nr: "05",
    titel: "Geländetraining für Feuerwehr",
    text: "Sicheres Fahren abseits befestigter Straßen — Wiese, Wald, Hanglage. Fahrphysik unter schwierigen Bedingungen, Fahrzeugspezifika, Bergen & Abschleppen. Mit eigenem Übungsgelände.",
  },
];

export default function FeuerwehrPage() {
  return (
    <>
      <PageHero
        eyebrow="Spezialausbildung · Feuerwehr"
        slides={[
          { src: "/feuerwehr/fw-truck-112.jpg", alt: "Feuerwehr-Fahrzeuge vor der VFR" },
          { src: "/feuerwehr/fw-kuga-sunrise.jpg", alt: "Feuerwehr-Kommandofahrzeug Ford Kuga" },
          { src: "/feuerwehr/fw-gruppe-gelaende.jpg", alt: "Feuerwehr-Lehrgang auf dem Übungsgelände" },
          { src: "/feuerwehr/fw-einweisung.jpg", alt: "Einweisung an einem Feuerwehr-Fahrzeug" },
          { src: "/feuerwehr/fw-ford-kuga.jpg", alt: "Feuerwehr-Kommandowagen" },
          { src: "/feuerwehr/fw-ladeflaeche.jpg", alt: "Ladungssicherung im Einsatzfahrzeug" },
          { src: "/feuerwehr/fw-gelaende-nass.jpg", alt: "Geländetraining im schwierigen Gelände" },
        ]}
        title="Von der Fahrerlaubnis bis zur Einsatzfahrt."
        lead="Wir bilden Feuerwehr-Angehörige komplett aus — Führerschein Klasse C und CE, Einweisungsfahrten auf eure Einsatzfahrzeuge, Einsatzfahrten nach § 35/§ 38 StVO, Ladungssicherung und Geländetraining. Alles aus einer Hand."
      />

      {/* Angebote */}
      <section className="vfr-section" style={{ paddingBlock: "80px" }}>
        <div className="vfr-wrap">
          <div className="max-w-[640px] mb-12">
            <span className="vfr-eyebrow">Unsere Angebote</span>
            <h2 className="vfr-h2 mt-2">Alles für den Einsatz.</h2>
            <p
              className="mt-3"
              style={{ color: "var(--vfr-fg-muted)", fontSize: 17 }}
            >
              Von der ersten Fahrerlaubnis bis zum routinierten Maschinisten —
              alle Module sind auf die besonderen Anforderungen von Feuerwehren
              zugeschnitten: Einsatzfahrzeuge, Belastungsszenarien, rechtliche
              Besonderheiten.
            </p>
          </div>

          <div className="grid gap-8 max-w-[800px]">
            {angebote.map((a) => (
              <article
                key={a.nr}
                className="grid grid-cols-[60px_1fr] gap-6 pb-8"
                style={{ borderBottom: "1px solid var(--vfr-rule)" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontStyle: "italic",
                    fontSize: 36,
                    fontWeight: 400,
                    color: "var(--vfr-accent)",
                    lineHeight: 1,
                  }}
                >
                  {a.nr}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "var(--vfr-fg)",
                      letterSpacing: "-0.01em",
                      marginBottom: 8,
                    }}
                  >
                    {a.titel}
                  </h3>
                  <p
                    style={{
                      color: "var(--vfr-fg-muted)",
                      fontSize: 16,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {a.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Fotos aus der Praxis */}
      <section
        className="vfr-section"
        style={{ background: "var(--vfr-bg-alt)", paddingBlock: "80px" }}
      >
        <div className="vfr-wrap">
          <div className="max-w-[640px] mb-10">
            <span className="vfr-eyebrow">Aus der Praxis</span>
            <h2 className="vfr-h2 mt-2">Schulungen bei uns vor Ort.</h2>
            <p
              className="mt-3"
              style={{ color: "var(--vfr-fg-muted)", fontSize: 17 }}
            >
              Direkt am echten Einsatzfahrzeug, mit erfahrenen Ausbildern und auf
              unserem Übungsgelände.
            </p>
          </div>

          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(6, 1fr)",
              gridAutoRows: "180px",
            }}
          >
            {[
              {
                src: "/feuerwehr/feuerwehr-ladungssicherung-1.jpg",
                cap: "Einweisung direkt am Einsatzfahrzeug",
                col: 3,
                row: 2,
              },
              {
                src: "/feuerwehr/feuerwehr-briefing.jpg",
                cap: "Briefing vor dem Praxisteil",
                col: 3,
                row: 1,
              },
              {
                src: "/feuerwehr/feuerwehr-ladungssicherung-2.jpg",
                cap: "Übung direkt am LKW",
                col: 3,
                row: 1,
              },
              {
                src: "/feuerwehr/feuerwehr-ladungssicherung-3.jpg",
                cap: "Dokumentation der Sicherung",
                col: 2,
                row: 1,
              },
              {
                src: "/feuerwehr/feuerwehr-fahrzeuge.jpg",
                cap: "Mehrere Fahrzeuge im Einsatzübungsszenario",
                col: 2,
                row: 1,
              },
              {
                src: "/feuerwehr/gelaende-training.jpg",
                cap: "Geländetraining mit MAN-Einsatzfahrzeug",
                col: 2,
                row: 1,
              },
            ].map((shot) => (
              <div
                key={shot.src}
                className="relative overflow-hidden group"
                style={{
                  gridColumn: `span ${shot.col}`,
                  gridRow: `span ${shot.row}`,
                  minHeight: 180,
                }}
              >
                <Image
                  src={shot.src}
                  alt={shot.cap}
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 text-white"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {shot.cap}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gut zu wissen */}
      <section className="vfr-section" style={{ paddingBlock: "70px" }}>
        <div className="vfr-wrap grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <span className="vfr-eyebrow">Gut zu wissen</span>
            <h2 className="vfr-h2 mt-2">So läuft eine Schulung ab.</h2>
            <p
              className="mt-4"
              style={{ color: "var(--vfr-fg-muted)", fontSize: 16 }}
            >
              Die Schulungen finden bei uns in Niederkassel statt — direkt auf
              unserem Gelände mit Werkstatt-Nähe und Übungsflächen. Auf Wunsch
              kommen wir auch zu euch ins Feuerwehrhaus.
            </p>
            <p
              className="mt-3"
              style={{ color: "var(--vfr-fg-muted)", fontSize: 16 }}
            >
              Teilnehmerzahl flexibel ab 6 Personen, Dauer je nach Modul 1–2
              Tage. Zertifikat über die Teilnahme inklusive.
            </p>
          </div>

          <div
            className="p-7"
            style={{
              background: "var(--vfr-bg-alt)",
              border: "1px solid var(--vfr-rule)",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--vfr-fg)",
                marginBottom: 16,
              }}
            >
              Was bringen wir mit?
            </h3>
            <ul className="list-none p-0 m-0 space-y-3">
              {[
                "Ausbilder mit Feuerwehr-Hintergrund",
                "Eigene LKW-Flotte für Führerschein C/CE",
                "Einweisung direkt auf eurem Einsatzfahrzeug möglich",
                "Schulungsmaterial & rechtliche Grundlagen",
                "Dokumentation & Teilnahmezertifikat",
                "Individuelle Modulgestaltung nach Absprache",
              ].map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[20px_1fr] gap-3 items-baseline"
                  style={{ fontSize: 15, color: "var(--vfr-fg)" }}
                >
                  <span
                    style={{
                      color: "var(--vfr-accent)",
                      fontWeight: 700,
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FAQ
        entries={faqByTopicStrict("feuerwehr")}
        title="Fragen zur Feuerwehr-Ausbildung."
      />

      <CTASection
        title="Interesse an einer Schulung für eure Wehr?"
        lead="Wir stimmen Modul, Termin und Gruppengröße individuell mit euch ab — ein kurzer Anruf reicht."
        primaryLabel="Anfrage senden"
        primaryHref="/kontakt"
      />
    </>
  );
}
