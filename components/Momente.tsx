import Link from "next/link";
import Image from "next/image";

type Shot = {
  src: string;
  alt: string;
  caption?: string;
  area: string;
};

const shots: Shot[] = [
  {
    src: "/impressionen/workshop-poster.jpg",
    alt: "Teilnehmer präsentieren ihre selbstgestalteten Unterrichtsmaterialien",
    caption: "Eigene Lehrmittel entwickeln",
    area: "big",
  },
  {
    src: "/impressionen/schulungsraum.jpg",
    alt: "Schulungsraum der VFR",
    caption: "Startklar zum Lehrgang",
    area: "a",
  },
  {
    src: "/impressionen/lernen-draussen.jpg",
    alt: "Straßenverkehrsrecht lernen im Außenbereich",
    caption: "Lernen auf unserer Lounge-Terrasse",
    area: "b",
  },
  {
    src: "/impressionen/nasstraining-auto.jpg",
    alt: "Fahrsicherheitstraining auf nassem Übungsplatz",
    caption: "Fahrsicherheitstraining auf dem Übungsplatz",
    area: "c",
  },
  {
    src: "/impressionen/terrasse-palme.jpg",
    alt: "Außenbereich der VFR mit Palme und Liegestühlen",
    caption: "Unsere Pausen-Oase",
    area: "d",
  },
];

export function Momente() {
  return (
    <section className="vfr-section" style={{ paddingBlock: "80px" }}>
      <div className="vfr-wrap">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div className="max-w-[560px]">
            <span className="vfr-eyebrow">Einblicke</span>
            <h2 className="vfr-h2 mt-2">So sieht's bei uns aus.</h2>
            <p
              className="mt-3"
              style={{ color: "var(--vfr-fg-muted)", fontSize: 17 }}
            >
              Moderne Schulungsräume, kreative Lernmethoden und eine
              Lounge-Terrasse zum Durchatmen — mehr als nur Theorie im
              Klassenraum.
            </p>
          </div>
          <Link
            href="/impressionen"
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
            Alle Impressionen ansehen →
          </Link>
        </div>

        {/* Mosaik-Grid */}
        <div
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "140px",
          }}
        >
          {shots.map((s) => {
            // Grid-Positionen pro Bild
            const gridArea: Record<string, React.CSSProperties> = {
              big: {
                gridColumn: "span 3",
                gridRow: "span 2",
              },
              a: { gridColumn: "span 3", gridRow: "span 1" },
              b: { gridColumn: "span 2", gridRow: "span 1" },
              c: { gridColumn: "span 2", gridRow: "span 2" },
              d: { gridColumn: "span 2", gridRow: "span 1" },
            };
            return (
              <div
                key={s.src}
                className="relative overflow-hidden group"
                style={{
                  ...gridArea[s.area],
                  minHeight: 140,
                }}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {s.caption && (
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 text-white"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {s.caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile-Fallback: Grid als vertikale Reihe */}
      <style>{`
        @media (max-width: 767px) {
          .vfr-section .grid[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 200px !important;
          }
          .vfr-section .grid[style*="grid-template-columns"] > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
