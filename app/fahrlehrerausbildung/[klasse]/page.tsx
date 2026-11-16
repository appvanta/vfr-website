import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CourseCard } from "@/components/CourseCard";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { AusbildungAblauf } from "@/components/AusbildungAblauf";
import { NaechsteInfoVeranstaltung } from "@/components/NaechsteInfoVeranstaltung";
import { faqByTopicStrict } from "@/lib/faq";
import type { FaqTopic } from "@/lib/faq";
import { listCourses, type CourseCategory } from "@/lib/flario";
import { IMG } from "@/lib/images";

type Slide = { src: string; alt: string };

type KlassenInfo = {
  cat: CourseCategory;
  title: string;
  short: string;
  lead: string;
  image: string;
  /** Optional: Slideshow im Hero statt Einzelbild */
  slides?: Slide[];
  body: React.ReactNode;
  inhalte: string[];
  voraussetzungen: string[];
  /** Vorgeschriebene praktische Unterrichtseinheiten (im Preis enthalten) */
  praxisUE: number;
  /** 3 Bilder für die Collage rechts (groß links, dann 2 × klein rechts) */
  collage: [Slide, Slide, Slide];
};

const KLASSE_MAP: Record<string, KlassenInfo> = {
  be: {
    cat: "ausbildung-be",
    title: "Fahrlehrerausbildung Klasse BE",
    short: "Klasse BE",
    image: "/hero/startseite-flotte.jpg",
    lead:
      "Du möchtest beruflich neue Wege gehen und gerne mit Menschen arbeiten? Die Klasse BE ist die Grundausbildung zum Fahrlehrer und die Basis für alle weiteren Klassen.",
    body: (
      <p>
        Bei der VFR begleiten wir dich auf dem Weg zur Fahrlehrerlaubnis der
        Klasse BE. Du beschäftigst dich mit Verkehrsrecht, Fahrzeugtechnik,
        Verkehrsverhalten und Pädagogik und lernst, Inhalte verständlich zu
        vermitteln. Unser zusätzliches kostenloses Repetitorium jeden Dienstag
        hilft dir, Wissen zu festigen und offene Fragen zu klären.
      </p>
    ),
    inhalte: [
      "Pädagogik und Didaktik",
      "Verkehrsrecht und Verkehrsverhalten",
      "Fahrphysik und Fahrzeugtechnik",
      "Unterrichtsplanung und Methodik",
      "Lehrpraktikum in einer Partnerfahrschule",
      "Prüfungsvorbereitung mit Simulationen",
    ],
    voraussetzungen: [
      "Führerschein Klasse BE, mindestens 3 Jahre Besitz",
      "Mindestalter 22 Jahre",
      "Abgeschlossene Berufsausbildung oder mittlere Reife mit Berufserfahrung",
      "Persönliche Eignung (Führungszeugnis, Punkteauszug)",
      "Körperliche und geistige Eignung (ärztliches Gutachten)",
    ],
    praxisUE: 30,
    collage: [
      { src: "/be/be-theorie.jpg", alt: "Theorie-Unterricht im VFR-Schulungsraum" },
      { src: "/be/be-fuhrpark.jpg", alt: "VFR-Transporter mit Fahrlehrerausbildungs-Anhänger" },
      { src: "/be/be-fahrsicherheit.jpg", alt: "Fahrsicherheitstraining auf dem Übungsplatz" },
    ],
  },
  a: {
    cat: "ausbildung-a",
    title: "Erweiterung Klasse A — Motorrad",
    short: "Klasse A",
    image: IMG.klasseA,
    lead:
      "Mit der Fahrlehrerlaubnis Klasse A erweiterst du dein Angebotsspektrum als Fahrlehrer um Motorräder.",
    body: (
      <p>
        Die Klasse A wird in Kombination mit einer Grundausbildung oder bereits
        vorhandener Fahrlehrerlaubnis absolviert. Praxis auf eigenem Übungsplatz
        mit modernen Maschinen und erfahrenen Trainern.
      </p>
    ),
    inhalte: [
      "Fahrphysik Motorrad",
      "Didaktik der Zweirad-Ausbildung",
      "Praktische Übungen auf dem Übungsplatz",
      "Begleitete Praxisfahrten",
    ],
    voraussetzungen: [
      "Führerschein Klasse A, mindestens 3 Jahre Besitz",
      "Mindestalter 21 Jahre",
      "Fahrlehrerlaubnis BE oder parallele Grundausbildung",
    ],
    praxisUE: 18,
    collage: [
      { src: "/a/a-motorrad-uebungsplatz.jpg", alt: "Motorrad-Ausbildung auf dem Übungsplatz" },
      { src: "/a/a-motorrad-gruppe.jpg", alt: "Praxis-Einweisung am Motorrad in der Gruppe" },
      { src: "/a/a-motorrad-energica.jpg", alt: "Energica Elektromotorrad in der VFR-Flotte" },
    ],
  },
  ce: {
    cat: "ausbildung-ce",
    title: "Erweiterung Klasse CE — LKW & Sattelzug",
    short: "Klasse CE",
    image: IMG.klasseCE,
    slides: [
      { src: "/hero/hero-ce-lkw.jpg", alt: "LKW-Ausbildung bei der VFR" },
      { src: "/hero/hero-schulungsraum.jpg", alt: "Vorbereiteter VFR-Schulungsraum" },
      { src: "/hero/hero-terrasse.jpg", alt: "VFR-Außenterrasse für die Pausen" },
      { src: "/hero/hero-dart.jpg", alt: "Pausenraum mit Dartboards" },
    ],
    lead:
      "Mit der Klasse CE qualifizierst du dich für die Ausbildung von Fahrschülern auf LKWs ab 3,5 t — in Theorie und Praxis.",
    body: (
      <p>
        Der Güterkraftverkehr ist einer der gefragtesten Bereiche. Fahrschulen
        suchen Fahrlehrer mit CE-Lizenz, und die Verdienstmöglichkeiten sind
        entsprechend attraktiv.
      </p>
    ),
    inhalte: [
      "Fahrzeugtechnik LKW und Sattelzug",
      "Besonderheiten im Güterkraftverkehr",
      "Didaktik der Berufskraftfahrer-Ausbildung",
      "Praxis mit echten Fahrzeugen",
    ],
    voraussetzungen: [
      "Führerschein Klasse CE, mindestens 3 Jahre Besitz",
      "Mindestalter 23 Jahre",
      "Fahrlehrerlaubnis BE oder parallele Grundausbildung",
    ],
    praxisUE: 22,
    collage: [
      { src: "/ce/ce-lkw-flotte.jpg", alt: "LKW-Flotte für die CE-Ausbildung bei der VFR" },
      { src: "/ce/ce-lkw-gruppe.jpg", alt: "Fahrzeug-Einweisung am Sattelzug" },
      { src: "/ce/ce-schulungsraum.jpg", alt: "Theorie-Unterricht im VFR-Schulungsraum" },
    ],
  },
  de: {
    cat: "ausbildung-de",
    title: "Erweiterung Klasse DE — Bus",
    short: "Klasse DE",
    image: IMG.klasseDE,
    lead:
      "Busfahrer werden immer benötigt — Fahrlehrer der Klasse DE entsprechend. Ein wachsender Bereich im ÖPNV und Reiseverkehr.",
    body: (
      <p>
        Die Erweiterung Klasse DE qualifiziert dich für die Ausbildung in Bus
        und Bus mit Anhänger. Praxis mit echten Linien- und Reisebussen in
        Kooperation mit regionalen Verkehrsbetrieben.
      </p>
    ),
    inhalte: [
      "Fahrzeugtechnik Omnibus",
      "Besonderheiten im Personenverkehr",
      "Didaktik der Berufskraftfahrer-Ausbildung Personenverkehr",
      "Praxis in Linien- und Reisebussen",
    ],
    voraussetzungen: [
      "Führerschein Klasse DE, mindestens 3 Jahre Besitz",
      "Mindestalter 24 Jahre",
      "Fahrlehrerlaubnis BE oder parallele Grundausbildung",
    ],
    praxisUE: 22,
    collage: [
      { src: "/de/de-flaggen.jpg", alt: "VFR-Fahnen mit Fuhrpark" },
      { src: "/de/de-praxis.jpg", alt: "Praxis am Sattelzug" },
      { src: "/de/de-schulungsraum.jpg", alt: "Theorie-Unterricht im VFR-Schulungsraum" },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(KLASSE_MAP).map((klasse) => ({ klasse }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ klasse: string }>;
}): Promise<Metadata> {
  const { klasse } = await params;
  const k = KLASSE_MAP[klasse];
  if (!k) return {};
  return {
    title: k.title,
    description: k.lead,
    alternates: { canonical: `/fahrlehrerausbildung/${klasse}` },
  };
}

export default async function KlassePage({
  params,
}: {
  params: Promise<{ klasse: string }>;
}) {
  const { klasse } = await params;
  const k = KLASSE_MAP[klasse];
  if (!k) notFound();

  // Flario kategorisiert manche Weiterbildungs-Kurse (z. B. „Ausbildungsfahrlehrer",
  // „Reflexion") fälschlicherweise als `ausbildung-be` etc. → zusätzlich per Titel
  // filtern: Ausbildungs-Kurse haben bei VFR den Prefix „FLA <KLASSE>".
  const klasseUpper = k.short.replace("Klasse ", ""); // BE, A, CE, DE
  const flaRegex = new RegExp(`\\bFLA\\s+${klasseUpper}\\b`, "i");
  const rawUpcoming = await listCourses({ category: k.cat, onlyBookable: true });
  const upcoming = rawUpcoming.filter((c) => flaRegex.test(c.title));

  return (
    <>
      <PageHero
        eyebrow={`Fahrlehrerausbildung · ${k.short}`}
        image={k.image}
        slides={k.slides}
        title={k.title}
        lead={k.lead}
        breadcrumbs={[
          { label: "Ausbildung", href: "/fahrlehrerausbildung" },
          { label: k.short, href: `/fahrlehrerausbildung/${klasse}` },
        ]}
      />

      {k.cat === "ausbildung-be" && <NaechsteInfoVeranstaltung />}

      {/* Impressionen-Teaser — Text links, Bilder-Collage rechts */}
      <section className="vfr-section" style={{ paddingBlock: "60px" }}>
        <div className="vfr-wrap grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-14 items-center">
          {/* Text links */}
          <div>
            <span className="vfr-eyebrow">Einblicke</span>
            <h2 className="vfr-h2 mt-3">Das erwartet dich bei uns.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-[var(--vfr-fg-muted)]">
              Moderne Schulungsräume mit Smartboards, eigene Fahrzeug-Flotte für
              die Praxisstunden und — soweit möglich — gemeinsame Praxistage
              wie das Fahrsicherheitstraining. Drei Einblicke in unseren
              Ausbildungsalltag.
            </p>
            <ul className="mt-5 space-y-2 text-[0.92rem] text-[var(--vfr-fg)] list-none p-0">
              <li className="flex items-start gap-2">
                <span className="text-[var(--vfr-accent)] font-bold mt-0.5">·</span>
                <span>
                  <strong>Schulungsräume</strong> in Niederkassel — hell,
                  modern, bestens ausgestattet
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vfr-accent)] font-bold mt-0.5">·</span>
                <span>
                  <strong>Praxistraining</strong> auf unserem Gelände — mit
                  echten Fahrzeugen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vfr-accent)] font-bold mt-0.5">·</span>
                <span>
                  <strong>Fahrsicherheitstraining</strong> (nach Möglichkeit) —
                  Fahrphysik hautnah erleben
                </span>
              </li>
            </ul>
          </div>

          {/* Collage rechts — echte Fotos aus dem VFR-Betrieb */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-1 row-span-2 aspect-[3/4] overflow-hidden rounded-sm">
              <Image
                src={k.collage[0].src}
                alt={k.collage[0].alt}
                fill
                sizes="(min-width: 1024px) 400px, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={k.collage[1].src}
                alt={k.collage[1].alt}
                fill
                sizes="(min-width: 1024px) 400px, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={k.collage[2].src}
                alt={k.collage[2].alt}
                fill
                sizes="(min-width: 1024px) 400px, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="vfr-section">
        <div className="vfr-wrap grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16">
          <article className="min-w-0">
            <div className="text-[var(--vfr-fg-muted)] space-y-4 max-w-[62ch]">
              {k.body}
            </div>

            <h2 className="vfr-h2 mt-12 text-[1.6rem]">Inhalte der Ausbildung</h2>
            <ul className="mt-5 grid gap-2 max-w-[62ch]">
              {/* Hervorgehobener Eintrag: Praxisstunden im Preis enthalten */}
              <li
                className="flex gap-3 items-start py-3 px-3 rounded-sm text-[0.95rem]"
                style={{
                  background: "var(--vfr-bg-alt)",
                  border: "1px solid var(--vfr-rule)",
                  borderLeft: "3px solid var(--vfr-accent)",
                  marginBottom: 6,
                }}
              >
                <span className="text-[var(--vfr-accent)] font-bold tabular-nums shrink-0">
                  {k.praxisUE} UE
                </span>
                <span className="text-[var(--vfr-fg)]">
                  <strong>Praktische Ausbildung</strong> — alle gesetzlich
                  vorgeschriebenen Stunden auf unseren Fahrzeugen,{" "}
                  <strong>bereits im Kurspreis enthalten</strong>.
                </span>
              </li>
              {k.inhalte.map((h) => (
                <li
                  key={h}
                  className="flex gap-3 items-start py-2 border-b border-[var(--vfr-rule)] text-[0.95rem]"
                >
                  <span className="text-[var(--vfr-accent)] font-semibold">—</span>
                  <span className="text-[var(--vfr-fg)]">{h}</span>
                </li>
              ))}
            </ul>

            <h2 className="vfr-h2 mt-12 text-[1.6rem]">Voraussetzungen</h2>
            <ul className="mt-5 grid gap-2 max-w-[62ch]">
              {k.voraussetzungen.map((h) => (
                <li
                  key={h}
                  className="flex gap-3 items-start py-2 border-b border-[var(--vfr-rule)] text-[0.95rem]"
                >
                  <span className="text-[var(--vfr-accent)] font-semibold">—</span>
                  <span className="text-[var(--vfr-fg)]">{h}</span>
                </li>
              ))}
            </ul>

            {k.cat === "ausbildung-be" && (
              <>
                {/* Das macht die VFR-BE besonders — tiefe Differenzierer aus Masterplan 13.3+13.4+13.5 */}
                <h2 className="vfr-h2 mt-12 text-[1.6rem]">
                  Das macht die VFR-BE besonders.
                </h2>
                <p className="mt-3 text-[var(--vfr-fg-muted)] max-w-[62ch]">
                  Drei Bausteine, die den Unterschied ausmachen — jenseits von
                  Pflichtstunden und Lehrplan.
                </p>

                <div className="mt-6 grid gap-5 max-w-[62ch]">
                  {/* Block 1 — Praxis auf eigenem Gelände + Simulator */}
                  <article
                    className="p-6 rounded-sm border-l-4"
                    style={{
                      background: "var(--vfr-bg-alt)",
                      borderColor: "var(--vfr-rule)",
                      borderWidth: 1,
                      borderLeftColor: "var(--vfr-accent)",
                      borderLeftWidth: 4,
                    }}
                  >
                    <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-2">
                      Praxis · direkt vor Ort
                    </div>
                    <h3 className="font-sans text-[1.08rem] font-semibold text-[var(--vfr-fg)] mb-2">
                      Eigenes Trainingsgelände + Fahrsimulator.
                    </h3>
                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] leading-relaxed m-0">
                      Grundfahraufgaben lassen sich auf unserem eigenen Gelände mit
                      verschiedenen Fahrzeugkombinationen gezielt üben. Beim
                      Rangieren mit Anhänger kann der Simulator ergänzend eingesetzt
                      werden — virtuelle Übungen bereiten den realen Einsatz vor.
                      Der Simulator ersetzt keine vorgeschriebenen praktischen
                      Ausbildungsanteile.
                    </p>
                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] leading-relaxed mt-3 mb-0">
                      Teilnehmer beurteilen sich zusätzlich gegenseitig anhand des
                      Fahraufgabenkatalogs in unserer App — so wird neben dem
                      Fahren auch die fachliche Beurteilungskompetenz geschult.
                    </p>
                  </article>

                  {/* Block 2 — Digitale Lernbegleitung */}
                  <article
                    className="p-6 rounded-sm border-l-4"
                    style={{
                      background: "var(--vfr-bg-alt)",
                      borderColor: "var(--vfr-rule)",
                      borderWidth: 1,
                      borderLeftColor: "var(--vfr-accent)",
                      borderLeftWidth: 4,
                    }}
                  >
                    <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-2">
                      Lernen · mit System
                    </div>
                    <h3 className="font-sans text-[1.08rem] font-semibold text-[var(--vfr-fg)] mb-2">
                      Digitale App + Lernzielkontrollen.
                    </h3>
                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] leading-relaxed m-0">
                      Regelmäßige Lernzielkontrollen und Prüfungsfragen helfen uns,
                      Stärken und Lernbedarf frühzeitig zu erkennen. Du siehst
                      jederzeit, wo du stehst — und wir können gezielt
                      unterstützen.
                    </p>
                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] leading-relaxed mt-3 mb-0">
                      In der Teilnehmer-App findest du Termine, Unterlagen,
                      Streckenaufzeichnung und Fahraufgabenbewertungen an einem
                      Ort. Als Lernfragen nutzen wir offiziell lizenzierte Fragen
                      aus dem Fahrerlaubnis-Prüfungsfragenkatalog und zusätzliche
                      eigene Multiple-Choice-Fragen speziell für die
                      Fahrlehrerausbildung — klar voneinander getrennt.
                    </p>
                  </article>

                  {/* Block 3 — Technik & Werkstatttag */}
                  <article
                    className="p-6 rounded-sm border-l-4"
                    style={{
                      background: "var(--vfr-bg-alt)",
                      borderColor: "var(--vfr-rule)",
                      borderWidth: 1,
                      borderLeftColor: "var(--vfr-accent)",
                      borderLeftWidth: 4,
                    }}
                  >
                    <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-2">
                      Technik · zum Anfassen
                    </div>
                    <h3 className="font-sans text-[1.08rem] font-semibold text-[var(--vfr-fg)] mb-2">
                      Originalmodelle + Werkstatttag.
                    </h3>
                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] leading-relaxed m-0">
                      An angetriebenen Originalmodellen werden technische Vorgänge
                      nachvollziehbar: Schaltgetriebe mit Allradantrieb, DSG- und
                      Automatikgetriebe, Motoren, SCR-Abgasnachbehandlung und
                      Common-Rail-Einspritzung.
                    </p>

                    {/* 4 Schnittmodelle als Beweis-Collage */}
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { src: "/impressionen/technik-motor.webp", alt: "4-Zylinder-Motor-Schnittmodell mit Lichtmaschine" },
                        { src: "/impressionen/technik-dsg.webp", alt: "DSG-/Automatikgetriebe-Schnittmodell" },
                        { src: "/impressionen/technik-schaltgetriebe.webp", alt: "Schaltgetriebe-Schnittmodell" },
                        { src: "/impressionen/technik-allrad.webp", alt: "Schaltgetriebe mit Allradantrieb" },
                      ].map((m) => (
                        <div
                          key={m.src}
                          className="relative aspect-square flex items-center justify-center p-2"
                          style={{
                            background: "#fff",
                            border: "1px solid var(--vfr-rule)",
                            borderRadius: 2,
                          }}
                        >
                          <Image
                            src={m.src}
                            alt={m.alt}
                            fill
                            sizes="(min-width: 640px) 120px, 40vw"
                            style={{
                              objectFit: "contain",
                              padding: "8px",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <p className="text-[0.92rem] text-[var(--vfr-fg-muted)] leading-relaxed mt-5 mb-0">
                      Beim Werkstatttag — <strong>nach Verfügbarkeit im jeweiligen
                      Jahrgang</strong> — betrachten wir Pkw und Motorräder auf der
                      Hebebühne aus einer anderen Perspektive: Fahrwerk, Lenkung,
                      Bremsen und Antrieb direkt am Fahrzeug.
                    </p>
                  </article>
                </div>

                {/* Was ist alles drin — BE-Besonderheiten */}
                <h2 className="vfr-h2 mt-12 text-[1.6rem]">
                  Das gibt es bei uns zusätzlich.
                </h2>
                <p className="mt-3 text-[var(--vfr-fg-muted)] max-w-[62ch]">
                  Neben dem gesetzlich vorgeschriebenen Pflichtstoff bieten wir
                  zusätzliche Bausteine, die den Unterschied machen. Manche
                  gehören fest zur Ausbildung, manche bieten wir als
                  Zusatz-Events an — je nach Jahrgang und Möglichkeit.
                </p>

                <div className="mt-6 grid gap-4 max-w-[62ch]">
                  {[
                    {
                      t: "Praxistraining Recht",
                      d: "Speziell für Fahrlehrer: Straßenverkehrsrecht nicht nur lesen, sondern am konkreten Fall anwenden.",
                    },
                    {
                      t: "Flipchart-Training",
                      d: "Visualisieren und präsentieren wie ein Profi — fester Bestandteil deiner Ausbildung bei uns.",
                    },
                    {
                      t: "2 Wochen Prüfungsvorbereitung",
                      d: "Intensive Lernphase direkt vor der Fachkundeprüfung — gemeinsam im Team, mit allen offenen Fragen.",
                    },
                    {
                      t: "Fahrsicherheitstraining (nach Möglichkeit)",
                      d: "Wenn es der Jahrgang terminlich erlaubt, machen wir gemeinsam einen Praxistag — Nasshandling, Bremsen, Ausweichen. Kein fester Bestandteil, wird aber regelmäßig angeboten.",
                    },
                    {
                      t: "Kart-Abend (gelegentlich)",
                      d: "Immer wieder laden wir unsere Jahrgänge zum gemeinsamen Kart-Abend in der Halle ein — Zentrifugalkraft und Grenzbereich live spüren. Ab und zu, kein fester Kurs-Bestandteil.",
                    },
                    {
                      t: "Besuch bei TÜV Nord",
                      d: "Gemeinsame Exkursion zur LKW-Prüfstraße. Das Prüfpersonal zeigt dir live, was wie kontrolliert wird — perfekt für den späteren Unterricht.",
                    },
                    {
                      t: "Prüfungsfahrzeuge zum Leihen",
                      d: "Für zusätzliches Eigentraining kannst du unsere Prüfungsfahrzeuge gegen einen kleinen Beitrag ausleihen. Mehr Praxis = mehr Sicherheit.",
                    },
                    {
                      t: "Gemeinsame Veranstaltungen",
                      d: "BBQ, Grillabende, Pizza-Events, Jahrgangstreffen. Lernen funktioniert besser, wenn man das Team kennt.",
                    },
                    {
                      t: "Eis bei Hitze",
                      d: "An heißen Sommertagen gibt's Eis zur Abkühlung — Radio Bonn/Rhein-Sieg war mit dem Eis-Alarm sogar schon bei uns.",
                    },
                    {
                      t: "Kostenloses Dienstags-Repetitorium",
                      d: "90 Minuten extra jeden Dienstag — wiederholen, Fragen klären, gezielt vorbereiten.",
                    },
                  ].map((item) => (
                    <div
                      key={item.t}
                      className="grid grid-cols-[20px_1fr] gap-4 pb-4"
                      style={{
                        borderBottom: "1px solid var(--vfr-rule)",
                      }}
                    >
                      <span
                        className="text-[var(--vfr-accent)]"
                        style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}
                      >
                        +
                      </span>
                      <div>
                        <h3
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "var(--vfr-fg)",
                            marginBottom: 4,
                          }}
                        >
                          {item.t}
                        </h3>
                        <p
                          style={{
                            fontSize: 14,
                            color: "var(--vfr-fg-muted)",
                            margin: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.d}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  id="repetitorium"
                  className="mt-10 bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] p-7"
                >
                  <span className="vfr-eyebrow">Jeden Dienstag · kostenlos</span>
                  <h3 className="font-[family-name:var(--font-serif)] text-[1.5rem] text-[var(--vfr-fg)] mt-3 font-medium">
                    90 Minuten extra — jede Woche.
                  </h3>
                  <p className="mt-3 text-[var(--vfr-fg-muted)]">
                    Bei der VFR endet die Unterstützung nicht mit dem regulären
                    Unterricht. Jeden Dienstag wiederholen wir Ausbildungsinhalte,
                    klären offene Fragen und bereiten gezielt auf die
                    Fachkundeprüfung vor.
                  </p>
                </div>

                {/* Fahrsicherheitstraining — eigener Block mit Fotos */}
                <div className="mt-10">
                  <span className="vfr-eyebrow">Zusatz-Event · nach Möglichkeit</span>
                  <h3
                    className="mt-3"
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--vfr-fg)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Fahrsicherheitstraining auf unserem Übungsplatz.
                  </h3>
                  <p
                    className="mt-3 text-[var(--vfr-fg-muted)]"
                    style={{ maxWidth: "62ch" }}
                  >
                    Als angehender Fahrlehrer unterrichtest du später selbst
                    Fahrphysik und Grenzbereiche. Wenn es der Jahrgang
                    terminlich zulässt, machen wir das Thema greifbar:
                    Nasshandling, Bremsen, Ausweichen — auf dem gesicherten
                    Übungsplatz. Ein Zusatz-Event, kein fester Kurs-Bestandteil.
                  </p>

                  <div
                    className="mt-6 grid gap-2"
                    style={{
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridAutoRows: "140px",
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ gridColumn: "span 2", gridRow: "span 2" }}
                    >
                      <Image
                        src="/impressionen/nasstraining-auto.jpg"
                        alt="Fahrzeug im Nasstraining auf dem Übungsplatz"
                        fill
                        sizes="(min-width: 768px) 400px, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative overflow-hidden">
                      <Image
                        src="/impressionen/nasstraining-detail.jpg"
                        alt="Wasserspray am Verkehrsleitkegel"
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative overflow-hidden">
                      <Image
                        src="/impressionen/sichertraining-gruppe-sommer.jpg"
                        alt="Teilnehmer-Gruppe am Übungsplatz"
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Kartfahren */}
                <div className="mt-10">
                  <span className="vfr-eyebrow">Zusatz-Event · gelegentlich</span>
                  <h3
                    className="mt-3"
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--vfr-fg)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Kart-Abend in der Halle.
                  </h3>
                  <p
                    className="mt-3 text-[var(--vfr-fg-muted)]"
                    style={{ maxWidth: "62ch" }}
                  >
                    Zentrifugalkraft, Grip, Übersteuern — das alles liest sich
                    im Lehrbuch gut. Noch besser versteht man es, wenn man es
                    selbst im Kart erfahren hat. Deshalb laden wir Jahrgänge
                    immer wieder gemeinsam in die Kart-Halle ein. Ein lockeres
                    Zusatz-Event, kein fester Bestandteil des Lehrgangs.
                  </p>

                  <div
                    className="mt-6 grid gap-2 md:grid-cols-3"
                    style={{ gridAutoRows: "180px" }}
                  >
                    {[
                      { src: "/kart/kart-aktion.jpg", alt: "Kart in Kurve" },
                      { src: "/kart/kart-drift.jpg", alt: "Kart im Drift" },
                      { src: "/kart/kart-kurve.jpg", alt: "Kart in enger Kurve" },
                    ].map((k) => (
                      <div key={k.src} className="relative overflow-hidden">
                        <Image
                          src={k.src}
                          alt={k.alt}
                          fill
                          sizes="(min-width: 768px) 250px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prüfungsfahrzeuge ausleihen */}
                <div
                  className="mt-10 p-7 grid lg:grid-cols-[1.4fr_1fr] gap-7 items-center"
                  style={{
                    background: "var(--vfr-bg-alt)",
                    border: "1px solid var(--vfr-rule)",
                  }}
                >
                  <div>
                    <span className="vfr-eyebrow">Extra-Service</span>
                    <h3
                      className="mt-2"
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "var(--vfr-fg)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Prüfungsfahrzeuge zum Leihen.
                    </h3>
                    <p
                      className="mt-3"
                      style={{ color: "var(--vfr-fg-muted)", fontSize: 15 }}
                    >
                      Du willst vor der Prüfung noch zusätzliches Eigentraining?
                      Unsere Prüfungsfahrzeuge kannst du gegen einen kleinen
                      Beitrag ausleihen. Mehr Zeit am Steuer schafft Sicherheit —
                      besonders für die praktische Lehrprobe.
                    </p>
                  </div>
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "16/10" }}
                  >
                    <Image
                      src="/fahrzeuge/pruefung-vw-flotte.jpg"
                      alt="VFR-Prüfungsfahrzeuge VW-Flotte"
                      fill
                      sizes="(min-width: 1024px) 400px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Räume mit Ordnern */}
                <div className="mt-10">
                  <span className="vfr-eyebrow">Unsere Räume</span>
                  <h3
                    className="mt-3"
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--vfr-fg)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    So sieht dein Arbeitsplatz aus.
                  </h3>
                  <p
                    className="mt-3 text-[var(--vfr-fg-muted)]"
                    style={{ maxWidth: "62ch" }}
                  >
                    Moderne Schulungsräume mit Smartboard, Dokumentenkamera und
                    ergonomischen Arbeitsplätzen. Am ersten Kurstag liegen alle
                    Unterlagen bereit — Ordner, Lehrbücher, Trinkflasche,
                    Materialien. Du musst nur noch loslegen.
                  </p>

                  <div
                    className="mt-6 grid gap-2 md:grid-cols-2"
                    style={{ gridAutoRows: "220px" }}
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src="/impressionen/schulungsraum.jpg"
                        alt="Schulungsraum mit VFR-Ordnern auf allen Tischen"
                        fill
                        sizes="(min-width: 768px) 400px, 100vw"
                        className="object-cover"
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
                        Vorbereitet für den Kursstart — Ordner an jedem Platz
                      </div>
                    </div>
                    <div className="relative overflow-hidden">
                      <Image
                        src="/campus/vfr-ordner-detail.jpg"
                        alt="VFR-Fahrlehrerausbildungs-Ordner im Detail"
                        fill
                        sizes="(min-width: 768px) 400px, 100vw"
                        className="object-cover"
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
                        Dein VFR-Ordner mit allen Materialien
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TÜV-Nord-Besuch — bei BE mit Bild, bei CE Text only (Bild folgt) */}
            {(k.cat === "ausbildung-be" || k.cat === "ausbildung-ce") && (
              <div
                className={`mt-10 p-7 grid gap-7 items-center ${
                  k.cat === "ausbildung-be"
                    ? "lg:grid-cols-[1fr_1.1fr]"
                    : "lg:grid-cols-1 max-w-[720px]"
                }`}
                style={{
                  background: "var(--vfr-bg-alt)",
                  border: "1px solid var(--vfr-rule)",
                }}
              >
                <div>
                  <span className="vfr-eyebrow">Exkursion</span>
                  <h3
                    className="mt-2"
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "var(--vfr-fg)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Besuch bei TÜV Nord.
                  </h3>
                  <p
                    className="mt-3"
                    style={{ color: "var(--vfr-fg-muted)", fontSize: 15 }}
                  >
                    Wir fahren mit dir und dem gesamten Jahrgang zur TÜV-Nord
                    {k.cat === "ausbildung-ce" ? " LKW-" : "-"}Prüfstraße. Dort zeigt und erklärt dir das Prüfpersonal
                    live, was wie kontrolliert wird — Bremsen, Beleuchtung,
                    Rahmen, Reifen, Fahrwerk. So verstehst du nicht nur die
                    Theorie, sondern siehst die Praxis mit eigenen Augen.
                  </p>
                </div>
                {k.cat === "ausbildung-be" && (
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/5" }}
                  >
                    <Image
                      src="/fahrzeuge/tuev-nord-besuch.jpg"
                      alt="VFR-Besuch bei TÜV Nord Prüfstraße"
                      fill
                      sizes="(min-width: 1024px) 400px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Für Klasse CE: LKW-Praxis */}
            {k.cat === "ausbildung-ce" && (
              <div className="mt-10">
                <span className="vfr-eyebrow">Praxis am LKW</span>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "var(--vfr-fg)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Direkt am echten Zugfahrzeug.
                </h3>
                <p
                  className="mt-3 text-[var(--vfr-fg-muted)]"
                  style={{ maxWidth: "62ch" }}
                >
                  In Kooperation mit regionalen Speditionen und Nutzfahrzeug-Partnern
                  arbeitest du mit echten LKW, Tankaufliegern und Sattelzügen.
                  Fahrzeugtechnik am Objekt erklären zu können, macht den
                  Unterschied im späteren Unterricht.
                </p>

                <div
                  className="mt-6 grid gap-2 md:grid-cols-2"
                  style={{ gridAutoRows: "280px" }}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src="/fahrzeuge/lkw-bertram.jpg"
                      alt="Moderner Mercedes Actros Sattelzug am VFR-Praxisort"
                      fill
                      sizes="(min-width: 768px) 450px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden">
                    <Image
                      src="/fahrzeuge/lkw-besichtigung.jpg"
                      alt="Teilnehmer besichtigen einen LKW-Auflieger"
                      fill
                      sizes="(min-width: 768px) 450px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Für Klasse A: Motorrad-Praxistraining */}
            {k.cat === "ausbildung-a" && (
              <div className="mt-10">
                <span className="vfr-eyebrow">Motorrad-Praxistraining</span>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "var(--vfr-fg)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Praxis auf dem Übungsplatz und auf der Straße.
                </h3>
                <p
                  className="mt-3 text-[var(--vfr-fg-muted)]"
                  style={{ maxWidth: "62ch" }}
                >
                  Enge Kurven, Slalom, Grundfahraufgaben, Gruppenausfahrten —
                  wir bilden dich praxisnah aus. Du lernst, worauf es bei der
                  Zweirad-Didaktik ankommt und trainierst mit erfahrenen
                  Motorrad-Ausbildern.
                </p>

                <div
                  className="mt-6 grid gap-2"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridAutoRows: "180px",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ gridColumn: "span 2", gridRow: "span 2" }}
                  >
                    <Image
                      src="/motorrad/training-platz.jpg"
                      alt="Motorrad-Praxis auf dem Übungsplatz"
                      fill
                      sizes="(min-width: 768px) 500px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden">
                    <Image
                      src="/motorrad/tankstelle.jpg"
                      alt="Gruppenausfahrt an Tankstelle"
                      fill
                      sizes="(min-width: 768px) 250px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden">
                    <Image
                      src="/motorrad/training-gruppe.jpg"
                      alt="Motorrad-Praxis mit Ausbildern"
                      fill
                      sizes="(min-width: 768px) 250px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            <h2 className="vfr-h2 mt-12 text-[1.6rem]">Förderung</h2>
            <p className="mt-3 text-[var(--vfr-fg-muted)] max-w-[62ch]">
              Für deine Ausbildung können verschiedene Förderwege infrage kommen —
              darunter Bildungsgutschein, Aufstiegs-BAföG, Jobcenter, Berufsförderungsdienst
              der Bundeswehr oder Leistungen der Rentenversicherung. Wir prüfen
              gemeinsam mit dir, was möglich ist. Mehr auf der{" "}
              <Link
                href="/foerderung"
                className="text-[var(--vfr-accent-dark)] underline underline-offset-2"
              >
                Förderseite
              </Link>
              .
            </p>
          </article>

          <aside className="h-fit lg:sticky lg:top-24 bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-6">
            <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold">
              Nächste Termine
            </div>
            <h3 className="font-[family-name:var(--font-serif)] text-[1.3rem] text-[var(--vfr-fg)] mt-2 font-medium">
              {k.short} — jetzt anfragen
            </h3>
            {upcoming.length === 0 ? (
              <p className="mt-4 text-[0.88rem] text-[var(--vfr-fg-muted)]">
                Keine freien Plätze. Ruf uns gerne für die Warteliste an.
              </p>
            ) : (
              <ul className="mt-5 grid gap-3">
                {upcoming.slice(0, 4).map((c) => (
                  <li
                    key={c.id}
                    className="border border-[var(--vfr-rule)] p-4"
                  >
                    <div className="text-[0.95rem] font-semibold text-[var(--vfr-fg)]">
                      Start{" "}
                      {new Date(c.startDate).toLocaleDateString("de-DE")}
                    </div>
                    <div className="text-[0.78rem] text-[var(--vfr-fg-soft)] mt-0.5">
                      {c.location}
                    </div>
                    <Link
                      href={`/buchung/${c.id}`}
                      className="vfr-btn vfr-btn--primary w-full mt-3 !py-2.5 justify-center text-[0.88rem]"
                    >
                      Diesen Termin buchen
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/kontakt"
              className="vfr-btn vfr-btn--ghost w-full mt-4 !py-2.5 justify-center text-[0.88rem]"
            >
              Beratung anfragen
            </Link>
          </aside>
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="vfr-section bg-[var(--vfr-bg-alt)]">
          <div className="vfr-wrap">
            <span className="vfr-eyebrow">Alle Termine {k.short}</span>
            <h2 className="vfr-h2 mt-4">Verfügbare Starttermine</h2>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {k.cat === "ausbildung-be" && <AusbildungAblauf />}

      <FAQ
        entries={faqByTopicStrict(k.cat as FaqTopic, "buchung-zahlung")}
        title={`Fragen zu ${k.short}.`}
      />

      <CTASection />
    </>
  );
}

/** Platzhalter für kommende Fotos — graue Kachel mit Icon + Label */
function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] rounded-sm flex items-center justify-center ${className ?? ""}`}
      aria-label={`Platzhalter für: ${label}`}
    >
      <div className="flex flex-col items-center text-center p-4">
        <svg
          className="h-10 w-10 text-[var(--vfr-fg-soft)]/40 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <div className="text-[0.82rem] font-semibold text-[var(--vfr-fg)]">
          {label}
        </div>
        <div className="text-[0.68rem] text-[var(--vfr-fg-soft)] mt-0.5">
          Foto folgt
        </div>
      </div>
    </div>
  );
}
