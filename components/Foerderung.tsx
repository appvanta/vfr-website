import Link from "next/link";
import Image from "next/image";

type Logo = {
  name: string;
  file: string;
  /**
   * Relativer Skalierungsfaktor für die visuelle Balance:
   * 1.0 = Normalhöhe. 1.2 = 20% größer. 0.9 = 10% kleiner.
   * Logos mit viel Weißraum oder komplexer Form bekommen mehr Scale.
   */
  scale: number;
  w: number;
  h: number;
};

const logos: Logo[] = [
  {
    name: "Bundesagentur für Arbeit",
    file: "/logos/ba.png",
    scale: 0.85,
    w: 600,
    h: 160,
  },
  {
    name: "Jobcenter",
    file: "/logos/jobcenter.png",
    scale: 0.85,
    w: 500,
    h: 100,
  },
  {
    name: "Aufstiegs-BAföG",
    file: "/logos/aufstiegs-bafoeg.jpg",
    scale: 1.0,
    w: 500,
    h: 300,
  },
  {
    name: "Bundesfreiwilligendienst",
    file: "/logos/bfd.jpg",
    scale: 1.0,
    w: 400,
    h: 220,
  },
  {
    name: "Deutsche Rentenversicherung",
    file: "/logos/drv.png",
    scale: 0.95,
    w: 500,
    h: 180,
  },
  {
    name: "DGUV",
    file: "/logos/dguv.jpg",
    scale: 1.0,
    w: 240,
    h: 220,
  },
  {
    name: "Bildungsscheck 2.0",
    file: "/logos/bildungsscheck.png",
    scale: 1.3,
    w: 900,
    h: 500,
  },
];

const BASE_HEIGHT = 70; // Pixel — Basis-Höhe eines "normalen" Logos

export function Foerderung() {
  return (
    <section
      className="vfr-section"
      style={{ background: "var(--vfr-bg-alt)", paddingBlock: "70px" }}
    >
      <div className="vfr-wrap">
        <div className="text-center max-w-[640px] mx-auto mb-12">
          <span className="vfr-eyebrow">Förderung durch</span>
          <h2
            className="mt-2"
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "var(--vfr-fg)",
            }}
          >
            Deine Fördermöglichkeiten im Überblick.
          </h2>
          <p
            className="mt-3"
            style={{ color: "var(--vfr-fg-muted)", fontSize: 15 }}
          >
            Verschiedene Programme kommen für deine Fahrlehrerausbildung in
            Betracht. Wir prüfen gemeinsam, was zu dir passt — keine pauschalen
            Zusagen.
          </p>
        </div>

        {/* Logo-Reihe auf weißer Karte — unterschiedliche Logo-Hintergründe werden so optisch zusammengefasst */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--vfr-rule)",
            borderRadius: 4,
            padding: "36px 24px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-10 items-center justify-items-center">
            {logos.map((l) => {
              const height = Math.round(BASE_HEIGHT * l.scale);
              const width = Math.round((l.w / l.h) * height);
              return (
                <div
                  key={l.name}
                  className="flex items-center justify-center"
                  style={{
                    width: "100%",
                    minHeight: 90,
                    padding: "0 4px",
                  }}
                  title={l.name}
                >
                  <Image
                    src={l.file}
                    alt={l.name}
                    width={width}
                    height={height}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/foerderung"
            className="inline-flex items-center gap-2"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--vfr-accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderBottom: "1px solid var(--vfr-accent)",
              paddingBottom: 3,
            }}
          >
            Fördermöglichkeiten prüfen →
          </Link>
        </div>

        <p
          className="text-center mt-5"
          style={{
            fontSize: 11,
            color: "var(--vfr-fg-soft)",
            maxWidth: 640,
            margin: "20px auto 0",
          }}
        >
          Logos der jeweiligen Rechteinhaber. Die VFR ist als AZAV-zertifizierte
          Einrichtung anerkannt; die konkrete Förderfähigkeit wird im Einzelfall
          durch den jeweiligen Kostenträger geprüft.
        </p>
      </div>
    </section>
  );
}
