import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { HeroSlideshow } from "./HeroSlideshow";

const heroSlides = [
  { src: "/hero/startseite-flotte.jpg", alt: "VFR-Fahrzeugflotte vor dem Schulungsgebäude" },
  { src: "/hero/hero-fahnen.jpg", alt: "VFR-Beachflags vor dem Schulungsgebäude in Niederkassel" },
  { src: "/hero/hero-vfr-flaggen.jpg", alt: "VFR-Beachflags und Fuhrpark auf dem Gelände" },
  { src: "/hero/hero-schulungsraum.jpg", alt: "Vorbereiteter VFR-Schulungsraum für Fahrlehreranwärter" },
  { src: "/hero/hero-fahrsicherheit.jpg", alt: "Fahrsicherheitstraining auf unserem Übungsplatz" },
  { src: "/hero/hero-gruppe.jpg", alt: "VFR-Lehrgangsgruppe vor der Fahrzeugflotte" },
  { src: "/hero/hero-terrasse.jpg", alt: "VFR-Außenterrasse mit Liegestühlen in den Pausen" },
  { src: "/hero/hero-dart.jpg", alt: "Pausenraum mit Dartboards" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ height: "50vh", minHeight: 380 }}>
      <HeroSlideshow slides={heroSlides} />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <div className="relative z-20 h-full flex items-center">
        <div className="vfr-wrap text-left text-white w-full grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          {/* Linke Textspalte */}
          <div>
            <span
              className="vfr-eyebrow"
              style={{ color: "#fff", marginBottom: 20, display: "inline-block" }}
            >
              Amtlich anerkannte Fahrlehrerausbildungsstätte
            </span>
            <h1
              className="vfr-h1 mt-2"
              style={{
                color: "#fff",
                fontWeight: 700,
                textAlign: "left",
                maxWidth: "15ch",
              }}
            >
              Fahrlehrer werden. <em style={{ color: "#2080c0" }}>Praxisnah.</em>
            </h1>
            <p
              className="mt-7 font-light"
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: 19,
                maxWidth: 560,
                fontWeight: 400,
              }}
            >
              Starte deine berufliche Zukunft in Niederkassel — zwischen Köln
              und Bonn. Moderne Lernumgebung, praxisorientierter Unterricht
              und persönliche Betreuung von der Beratung bis zur Fahrlehrerlaubnis.
            </p>

            {/* Primary CTA mit großem Pfeil + sekundärer Textlink darunter */}
            <div className="mt-10">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-4 group"
                style={{
                  background: "var(--vfr-accent)",
                  color: "#fff",
                  padding: "18px 28px 18px 32px",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition: "background 0.25s ease",
                }}
              >
                <span>Jetzt Beratung vereinbaren</span>
                <span
                  className="flex items-center justify-center group-hover:translate-x-1 transition-transform"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Link
                  href="/termine-preise"
                  className="inline-flex items-center gap-2 hover:gap-3 transition-all"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.4)",
                    paddingBottom: 4,
                  }}
                >
                  Alle Kurse ansehen →
                </Link>
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                  }}
                >
                  Nächster Start · <strong style={{ color: "#fff" }}>13. Januar 2027</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Rechte Spalte — Google-Rating + Trust-Elemente (nicht als zweiter Button) */}
          <div
            className="hidden lg:block"
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.15)",
              paddingLeft: 40,
            }}
          >
            <div className="grid gap-7">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      fill="#ffc107"
                      stroke="#ffc107"
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  4,9
                </div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                  }}
                >
                  Google · 52 Rezensionen
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  AZAV
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Zertifiziert — Bildungsgutschein wird angenommen
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Seit 2010
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Inhabergeführt — über 15 Jahre Ausbildungserfahrung
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
