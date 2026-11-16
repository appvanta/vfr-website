import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Spezialschulungen & Service",
  description:
    "Spezialschulungen für Unternehmen und Behörden: Feuerwehr, Ladungssicherung, Cybersicherheit, Smartboardschulung und mehr.",
  alternates: { canonical: "/service" },
};

const spezial = [
  {
    title: "Feuerwehr-Spezialausbildung",
    text: "Fahrerlaubnis C & CE, Einweisungsfahrten auf Einsatzfahrzeuge, Einsatzfahrten nach § 35/§ 38 StVO, Ladungssicherung, Geländetraining. Eigene Seite mit allen Details.",
    href: "/feuerwehr",
    highlight: true,
  },
  {
    title: "Bürokräfteschulung",
    text: "Strukturierte Schulung für Mitarbeitende: Anmeldung, Terminverwaltung, Abrechnung.",
  },
  {
    title: "Ladungssicherung Unternehmen",
    text: "Für Berufskraftfahrer, Ausbilder und Flottenverantwortliche.",
  },
  {
    title: "Arbeits- und Gesundheitsschutz",
    text: "Pflichtschulung für Betriebe mit Fahrzeugen. Praxisnahes Modul.",
  },
  {
    title: "Smartboardschulung",
    text: "Nutzung interaktiver Whiteboards im Theorie-Unterricht — Hands-on.",
  },
];

const service = [
  { t: "Downloads", d: "Anmeldungen, Lehrpläne, Förder-Infos als PDF.", href: "/downloads" },
  { t: "Team & Dozenten", d: "Die Menschen hinter der VFR.", href: "/team" },
  { t: "Impressionen", d: "Einblicke in Räume und Fahrzeuge.", href: "/impressionen" },
  { t: "Stellenbörse", d: "Offene Stellen aus unserem Fahrschul-Netzwerk.", href: "/stellenboerse" },
  { t: "Info-Veranstaltungen", d: "Kostenlose Termine zum Kennenlernen.", href: "/info-veranstaltungen" },
  { t: "Gerichtsurteile", d: "Aktuelle Urteile rund um die Fahrlehrer-Tätigkeit.", href: "/gerichtsurteile" },
];

export default function ServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Spezialschulungen & Service"
        image={IMG.service}
        title="Mehr als Fahrlehrerausbildung."
        lead="Für Unternehmen und Behörden bieten wir fachspezifische Schulungen rund um Fahrzeuge, Sicherheit und Didaktik — und für dich als Fahrlehrer alle wichtigen Services auf einen Blick."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Spezialschulungen</span>
          <h2 className="vfr-h2 mt-4">Schulungen für Unternehmen und Behörden.</h2>
          <p className="text-[var(--vfr-fg-muted)] max-w-[55ch] mb-10">
            Anfragen gerne über das Beratungsformular — wir stellen dir ein
            passendes Angebot zusammen.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spezial.map((s, i) => {
              const inner = (
                <>
                  <div
                    className="text-[var(--vfr-accent)] mb-3"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--vfr-fg)",
                      letterSpacing: "-0.01em",
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] m-0">
                    {s.text}
                  </p>
                  {s.href && (
                    <span
                      className="inline-flex items-center gap-1 mt-4 group-hover:gap-2 transition-all"
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--vfr-accent)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Zur Seite →
                    </span>
                  )}
                </>
              );
              const sharedClass = `group p-6 ${
                s.highlight
                  ? "bg-[var(--vfr-accent)] text-white border border-[var(--vfr-accent)]"
                  : "bg-[var(--vfr-card)] border border-[var(--vfr-rule)]"
              } ${s.highlight ? "[&_h3]:!text-white [&_p]:!text-white/90 [&_div]:!text-white/80 [&_span]:!text-white" : ""}`;
              return s.href ? (
                <Link
                  key={s.title}
                  href={s.href}
                  className={`${sharedClass} no-underline hover:shadow-md transition`}
                >
                  {inner}
                </Link>
              ) : (
                <div key={s.title} className={sharedClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Weitere Services</span>
          <h2 className="vfr-h2 mt-4">Rund um deine Ausbildung.</h2>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--vfr-rule)] border border-[var(--vfr-rule)]">
            {service.map((s) => (
              <Link
                key={s.t}
                href={s.href}
                className="group bg-[var(--vfr-card)] p-6 hover:bg-[var(--vfr-bg-alt)] transition no-underline"
              >
                <h3 className="font-[family-name:var(--font-serif)] text-[1.05rem] text-[var(--vfr-fg)] mb-2 font-medium">
                  {s.t}
                </h3>
                <p className="text-[0.88rem] text-[var(--vfr-fg-muted)] m-0">{s.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[var(--vfr-accent-dark)] group-hover:gap-2 transition-all">
                  Öffnen →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
