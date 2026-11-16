import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Impressionen aus dem Schulalltag",
  description:
    "Einblicke bei der VFR: Schulungsräume, kreative Lernmethoden, Team-Events und unsere Lounge-Terrasse. Fotos vom VFR-Alltag.",
  alternates: { canonical: "/impressionen" },
};

type Orient = "quer" | "hoch";
type Shot = { src: string; alt: string; caption: string; orient: Orient };
type Section = { title: string; lead: string; shots: Shot[] };

const sections: Section[] = [
  {
    title: "Fahrsicherheitstraining",
    lead: "Praxistag auf dem Übungsplatz — Nasshandling, Bremsen, Ausweichen. Erleben, worüber du später unterrichtest.",
    shots: [
      {
        src: "/impressionen/nasstraining-auto.jpg",
        alt: "Fahrzeug auf nassem Übungsplatz mit Wasserspray",
        caption: "Grenzbereich auf dem gesicherten Übungsplatz",
        orient: "hoch",
      },
      {
        src: "/impressionen/nasstraining-detail.jpg",
        alt: "Wasserspray am Verkehrsleitkegel",
        caption: "Sprüh-Anlage für realistische Bedingungen",
        orient: "quer",
      },
      {
        src: "/impressionen/sichertraining-gruppe-sommer.jpg",
        alt: "Teilnehmer-Gruppe vor VW-Fahrzeugen",
        caption: "Jahrgang Sommer — vor dem Praxistag",
        orient: "quer",
      },
      {
        src: "/impressionen/sichertraining-gruppe-herbst.jpg",
        alt: "Teilnehmer vor der VW-Flotte im Herbst",
        caption: "Jahrgang Herbst — bei nassem Wetter",
        orient: "quer",
      },
    ],
  },
  {
    title: "Lernen bei uns",
    lead: "Moderne Räume, eigene Lehrmittel, Lernen auch mal draußen.",
    shots: [
      {
        src: "/impressionen/workshop-poster.jpg",
        alt: "Teilnehmer mit selbstgestalteten Lern-Postern",
        caption: "Teilnehmer präsentieren selbstgestaltete Unterrichtsmaterialien",
        orient: "quer",
      },
      {
        src: "/impressionen/schulungsraum.jpg",
        alt: "Modern ausgestatteter Schulungsraum mit VFR-Ordnern",
        caption: "Startklar zum Lehrgang — ausgestattet mit VFR-Ordnern & Lehrmitteln",
        orient: "quer",
      },
      {
        src: "/impressionen/lernen-draussen.jpg",
        alt: "Straßenverkehrsrecht lernen auf der Terrasse",
        caption: "Straßenverkehrsrecht pauken bei Sonne auf der Terrasse",
        orient: "hoch",
      },
      {
        src: "/impressionen/lernen-draussen-2.jpg",
        alt: "Weitere Perspektive der Lern-Terrasse",
        caption: "Gemeinsam vorbereiten — Lounge-Atmosphäre statt Klassenraum",
        orient: "hoch",
      },
    ],
  },
  {
    title: "Campus & Atmosphäre",
    lead: "Unser Außenbereich mit Lounge-Terrasse — direkt am Schulungsgelände.",
    shots: [
      {
        src: "/impressionen/terrasse-palme.jpg",
        alt: "Lounge-Terrasse mit Palme und Liegestühlen",
        caption: "Unsere Lounge-Terrasse mit Palme",
        orient: "hoch",
      },
      {
        src: "/impressionen/liegestuehle.jpg",
        alt: "VFR-gebrandete Liegestühle im Außenbereich",
        caption: "Liegestühle für die Lernpause",
        orient: "hoch",
      },
    ],
  },
  {
    title: "Momente mit Teilnehmern",
    lead: "Gemeinsame Essen, Sommer-Grillen, Pizza-Events und Weihnachtsfeier — wir sind mehr als nur Unterricht.",
    shots: [
      {
        src: "/impressionen/pizza-event.jpg",
        alt: "Teilnehmer beim Pizza-Event im Sommer",
        caption: "Pizza-Event im Sommer",
        orient: "quer",
      },
      {
        src: "/impressionen/bbq.jpg",
        alt: "BBQ-Grill mit Steaks und Gemüse",
        caption: "Sommer-Grillen auf dem Campus",
        orient: "hoch",
      },
      {
        src: "/impressionen/pause-sommer.jpg",
        alt: "Teilnehmer entspannen draußen",
        caption: "Pause unter Sonnenschirmen",
        orient: "quer",
      },
      {
        src: "/impressionen/gemeinsames-essen.jpg",
        alt: "Teilnehmer beim gemeinsamen Essen",
        caption: "Gemeinsames Essen nach dem Kurs",
        orient: "quer",
      },
      {
        src: "/impressionen/pizza-auslage.jpg",
        alt: "Pizza-Auslage in Kartons",
        caption: "Große Pizzen für alle",
        orient: "hoch",
      },
      {
        src: "/impressionen/weihnachtsfeier.jpg",
        alt: "Teilnehmer bei der Weihnachtsfeier",
        caption: "Weihnachtsfeier mit dem Jahrgang",
        orient: "quer",
      },
      {
        src: "/impressionen/buffet.jpg",
        alt: "Buffet-Auslage",
        caption: "Buffet beim Jahrgangstreffen",
        orient: "hoch",
      },
      {
        src: "/impressionen/buffet-warm.jpg",
        alt: "Warmes Buffet",
        caption: "Warmes Buffet",
        orient: "quer",
      },
      {
        src: "/impressionen/buffet-nachtisch.jpg",
        alt: "Nachtisch-Buffet",
        caption: "Nachtisch zum Abschluss",
        orient: "hoch",
      },
      {
        src: "/impressionen/essen-detail.jpg",
        alt: "Essen Detail",
        caption: "Gemeinsam genießen",
        orient: "quer",
      },
      {
        src: "/impressionen/fortbildung-mittagessen.jpg",
        alt: "Mittagessen bei der Fortbildung",
        caption: "Mittagessen bei der Fortbildung",
        orient: "quer",
      },
    ],
  },
];

export default function ImpressionenPage() {
  return (
    <>
      <PageHero
        eyebrow="Impressionen"
        image="/impressionen/terrasse-palme.jpg"
        title="Einblicke aus dem Schulalltag."
        lead="So sieht VFR aus: moderne Räume, kreative Methoden, Team-Atmosphäre. Alle Fotos aus unserem echten Alltag — Teilnehmerfotos nur mit Zustimmung."
      />

      {sections.map((sec) => (
        <section
          key={sec.title}
          className="vfr-section"
          style={{ paddingBlock: "70px" }}
        >
          <div className="vfr-wrap">
            <div className="max-w-[640px] mb-8">
              <span className="vfr-eyebrow">{sec.title}</span>
              <h2
                className="vfr-h2 mt-2"
                style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
              >
                {sec.lead}
              </h2>
            </div>

            <div className="vfr-masonry">
              {sec.shots.map((s) => {
                const w = s.orient === "quer" ? 2000 : 1125;
                const h = s.orient === "quer" ? 1125 : 2000;
                return (
                  <figure key={s.src} className="vfr-masonry-item group">
                    <div className="relative overflow-hidden">
                      <Image
                        src={s.src}
                        alt={s.alt}
                        width={w}
                        height={h}
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                        style={{ background: "var(--vfr-bg-alt)" }}
                      />
                      <figcaption
                        className="absolute bottom-0 left-0 right-0 p-4 text-white"
                        style={{
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {s.caption}
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <CTASection />

      <style>{`
        .vfr-masonry {
          column-count: 3;
          column-gap: 12px;
        }
        .vfr-masonry-item {
          break-inside: avoid;
          margin: 0 0 12px 0;
          display: block;
        }
        @media (max-width: 1023px) {
          .vfr-masonry { column-count: 2; }
        }
        @media (max-width: 639px) {
          .vfr-masonry { column-count: 1; }
        }
      `}</style>
    </>
  );
}
