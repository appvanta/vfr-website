import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "VFR erleben — Impressionen aus unserer Ausbildung",
  description:
    "Schulungsräume, eigene Fahrzeug-Flotte, Praxistraining, Fahrsicherheitstrainings, Gemeinschaft und Blaulicht-Ausbildung — ein Blick auf die VFR Verkehrsfachschule Rheinland in Niederkassel.",
  alternates: { canonical: "/erleben" },
};

type Bild = { src: string; alt: string; wide?: boolean; tall?: boolean };

type Kategorie = {
  title: string;
  lead: string;
  bilder: Bild[];
};

const kategorien: Kategorie[] = [
  {
    title: "Schulungsräume & Lernen",
    lead: "Moderne Räume, gute Technik und — wenn das Wetter mitspielt — auch mal draußen.",
    bilder: [
      { src: "/hero/hero-schulungsraum.jpg", alt: "Vorbereiteter Schulungsraum mit VFR-Ordnern", wide: true },
      { src: "/impressionen/schulungsraum.jpg", alt: "Blick in den Schulungsraum" },
      { src: "/impressionen/lernen-draussen.jpg", alt: "Lernen im Außenbereich" },
      { src: "/impressionen/lernen-draussen-2.jpg", alt: "Gruppenarbeit draußen" },
      { src: "/impressionen/workshop-poster.jpg", alt: "Workshop mit Postern" },
    ],
  },
  {
    title: "Praxis & Fahrsicherheit",
    lead: "Auf unserem Gelände, auf dem Trainingsplatz und bei Fahrsicherheitstrainings — Praxis, die hängen bleibt.",
    bilder: [
      { src: "/hero/hero-fahrsicherheit.jpg", alt: "Fahrsicherheitstraining mit Trainer", wide: true },
      { src: "/impressionen/sichertraining-gruppe-sommer.jpg", alt: "Fahrsicherheitstraining Sommer" },
      { src: "/impressionen/sichertraining-gruppe-herbst.jpg", alt: "Fahrsicherheitstraining Herbst" },
      { src: "/impressionen/nasstraining-auto.jpg", alt: "Nasshandling-Training" },
      { src: "/impressionen/nasstraining-detail.jpg", alt: "Nasstraining Detail" },
    ],
  },
  {
    title: "Fuhrpark & Gelände",
    lead: "Eigene Fahrzeug-Flotte, eigenes Trainingsgelände — direkt bei uns in Niederkassel.",
    bilder: [
      { src: "/hero/startseite-flotte.jpg", alt: "VFR-Fahrzeugflotte vor dem Schulungsgebäude", wide: true },
      { src: "/hero/hero-fahnen.jpg", alt: "VFR-Beachflags vor dem Standort" },
      { src: "/hero/hero-gruppe.jpg", alt: "Lehrgangsgruppe vor der Flotte" },
      { src: "/hero/hero-ce-lkw.jpg", alt: "LKW-Ausbildung Klasse CE" },
    ],
  },
  {
    title: "Pausen & Gemeinschaft",
    lead: "Dart, Basketball, Außenterrasse mit Palmen, Liegestühle und eine große Küche — Pausen gehören dazu.",
    bilder: [
      { src: "/hero/hero-terrasse.jpg", alt: "VFR-Außenterrasse mit Liegestühlen", wide: true },
      { src: "/hero/hero-dart.jpg", alt: "Dart-Bereich im Pausenraum" },
      { src: "/impressionen/terrasse-palme.jpg", alt: "Palme auf der Terrasse" },
      { src: "/impressionen/liegestuehle.jpg", alt: "VFR-Liegestühle" },
      { src: "/impressionen/pause-sommer.jpg", alt: "Sommerpause draußen" },
    ],
  },
  {
    title: "Events & Feiern",
    lead: "BBQ, Pizza-Abende, Weihnachtsfeier — gemeinsame Momente neben der Ausbildung.",
    bilder: [
      { src: "/impressionen/weihnachtsfeier.jpg", alt: "Weihnachtsfeier mit Teilnehmern", wide: true },
      { src: "/impressionen/bbq.jpg", alt: "BBQ-Event" },
      { src: "/impressionen/pizza-event.jpg", alt: "Pizza-Event" },
      { src: "/impressionen/pizza-auslage.jpg", alt: "Pizza-Auslage" },
    ],
  },
  {
    title: "Gemeinsames Essen",
    lead: "In unseren Fortbildungen gehen wir mittags zusammen essen — Teil des Tages, nicht Zusatzkosten.",
    bilder: [
      { src: "/impressionen/fortbildung-mittagessen.jpg", alt: "Gemeinsames Mittagessen", wide: true },
      { src: "/impressionen/gemeinsames-essen.jpg", alt: "Essen am großen Tisch" },
      { src: "/impressionen/buffet.jpg", alt: "Buffet" },
      { src: "/impressionen/buffet-warm.jpg", alt: "Warmes Buffet" },
      { src: "/impressionen/buffet-nachtisch.jpg", alt: "Buffet mit Nachtisch" },
      { src: "/impressionen/essen-detail.jpg", alt: "Detailaufnahme vom Buffet" },
    ],
  },
  {
    title: "Blaulicht-Ausbildung",
    lead: "Fahrerlaubnis C/CE, Einweisungsfahrten, Einsatzfahrten nach § 35/§ 38 StVO, Ladungssicherung und Geländetraining für Feuerwehren.",
    bilder: [
      { src: "/feuerwehr/fw-truck-112.jpg", alt: "Feuerwehr-LKW 112 am VFR-Standort", wide: true },
      { src: "/feuerwehr/fw-gruppe-gelaende.jpg", alt: "Feuerwehr-Lehrgang auf dem Übungsgelände" },
      { src: "/feuerwehr/fw-kuga-sunrise.jpg", alt: "Feuerwehr-Kommandofahrzeug bei Sonnenaufgang" },
      { src: "/feuerwehr/fw-ford-kuga.jpg", alt: "Ford Kuga Kommandowagen" },
      { src: "/feuerwehr/fw-einweisung.jpg", alt: "Einweisung an Einsatzfahrzeugen" },
      { src: "/feuerwehr/fw-ladeflaeche.jpg", alt: "Ladefläche mit Rollcontainern" },
      { src: "/feuerwehr/fw-gelaende-nass.jpg", alt: "Geländetraining im schwierigen Gelände" },
      { src: "/feuerwehr/feuerwehr-briefing.jpg", alt: "Briefing vor dem Praxisteil" },
      { src: "/feuerwehr/feuerwehr-ladungssicherung-1.jpg", alt: "Praxistag am Einsatzfahrzeug" },
    ],
  },
];

function BildKachel({ bild, i }: { bild: Bild; i: number }) {
  const span = bild.wide ? "sm:col-span-2" : "";
  const aspect = bild.wide ? "aspect-[16/10]" : "aspect-[4/3]";
  return (
    <div
      className={`relative ${aspect} ${span} overflow-hidden bg-[var(--vfr-bg-alt)]`}
    >
      <Image
        src={bild.src}
        alt={bild.alt}
        fill
        sizes={bild.wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="object-cover transition-transform duration-500 hover:scale-105"
        priority={i < 2}
      />
    </div>
  );
}

export default function ErlebenPage() {
  const totalBilder = kategorien.reduce((sum, k) => sum + k.bilder.length, 0);

  return (
    <>
      <PageHero
        eyebrow="VFR erleben"
        slides={[
          { src: "/hero/hero-gruppe.jpg", alt: "Lehrgangsgruppe vor der Flotte" },
          { src: "/hero/hero-schulungsraum.jpg", alt: "Schulungsraum" },
          { src: "/hero/hero-terrasse.jpg", alt: "Außenterrasse" },
          { src: "/hero/hero-fahrsicherheit.jpg", alt: "Fahrsicherheitstraining" },
          { src: "/feuerwehr/fw-truck-112.jpg", alt: "Feuerwehr-Ausbildung" },
          { src: "/impressionen/weihnachtsfeier.jpg", alt: "Gemeinsame Feiern" },
        ]}
        title="So sieht's bei uns aus."
        lead={`Mehr als ${Math.floor(totalBilder / 5) * 5} Einblicke in unseren Ausbildungsalltag — Schulungsräume, Praxis, Fahrsicherheit, Feiern und Blaulicht-Ausbildung. Alles echte VFR.`}
        breadcrumbs={[{ label: "VFR erleben", href: "/erleben" }]}
      />

      {kategorien.map((k, idx) => (
        <section
          key={k.title}
          className="vfr-section"
          style={{
            background:
              idx % 2 === 0 ? "var(--vfr-bg)" : "var(--vfr-bg-alt)",
            paddingBlock: "64px",
          }}
        >
          <div className="vfr-wrap">
            <div className="mb-8 max-w-[640px]">
              <span className="vfr-eyebrow">Kategorie · {String(idx + 1).padStart(2, "0")}</span>
              <h2 className="vfr-h2 mt-3">{k.title}</h2>
              <p className="mt-4 text-[var(--vfr-fg-muted)] text-[1rem] leading-relaxed">
                {k.lead}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {k.bilder.map((b, i) => (
                <BildKachel key={b.src} bild={b} i={i} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <CTASection
        title="Komm vorbei und sieh es dir live an."
        lead="Infoveranstaltung oder persönliche Beratung — wir zeigen dir unsere Räume, Fahrzeuge und das Trainingsgelände."
        primaryLabel="Beratung vereinbaren"
        primaryHref="/kontakt"
        secondaryLabel="Nächste Info-Veranstaltung"
        secondaryHref="/info-veranstaltungen"
      />
    </>
  );
}
