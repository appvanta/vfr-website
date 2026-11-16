import Image from "next/image";
import { Calendar } from "lucide-react";

type Step = {
  nr: string;
  title: string;
  duration: string;
  text: string;
  imageSrc?: string;
  imageAlt?: string;
};

const defaultSteps: Step[] = [
  {
    nr: "01",
    title: "Beratung & Anmeldung",
    duration: "1–2 Wochen",
    text: "Kostenloses Beratungsgespräch (Telefon, Video oder vor Ort), Klärung von Förderung und Bildungsgutschein, verbindliche Anmeldung.",
    imageAlt: "Beratungsgespräch mit Teilnehmer",
  },
  {
    nr: "02",
    title: "Theorie & Praxis",
    duration: "8 Monate",
    text: "Intensive Ausbildung in Verkehrsrecht, Fahrzeugtechnik, Pädagogik und Fahrpraxis. Täglich Unterricht in modernen Räumen, kostenloses Dienstags-Repetitorium inklusive.",
    imageAlt: "Theorie-Unterricht im Schulungsraum",
  },
  {
    nr: "03",
    title: "Prüfungsvorbereitung",
    duration: "2 Wochen",
    text: "Intensiv-Vorbereitung auf die Fachkunde-, Pädagogik- und Praxis-Prüfung. Probeprüfungen, Lehrproben-Training, letzte offene Fragen klären.",
    imageAlt: "Intensive Prüfungsvorbereitung",
  },
  {
    nr: "04",
    title: "Lehrpraktikum",
    duration: "mindestens 4 Monate",
    text: "Praktische Phase in einer anerkannten Ausbildungsfahrschule. Du begleitest echte Fahrschüler im Theorie- und Fahrunterricht unter Anleitung eines Ausbildungsfahrlehrers.",
    imageAlt: "Lehrpraktikum in Partner-Fahrschule",
  },
  {
    nr: "05",
    title: "Lehrproben & Fahrlehrerschein",
    duration: "1–2 Wochen",
    text: "Abschließende Lehrproben vor der Prüfungskommission. Nach Bestehen erhältst du deine Fahrlehrerlaubnis Klasse BE — und darfst sofort unterrichten.",
    imageAlt: "Übergabe Fahrlehrerschein",
  },
];

export function AusbildungAblauf({ steps = defaultSteps }: { steps?: Step[] }) {
  return (
    <section className="vfr-section bg-[var(--vfr-bg-alt)]">
      <div className="vfr-wrap">
        <div className="max-w-[680px] mb-12">
          <span className="vfr-eyebrow">In 5 Etappen zur Lehrberechtigung</span>
          <h2 className="vfr-h2 mt-3">So läuft die Ausbildung ab.</h2>
          <p className="text-[var(--vfr-fg-muted)] mt-4 text-[1.05rem]">
            Von der ersten Beratung bis zum eigenen Fahrlehrerschein — fünf
            klare Etappen, die wir gemeinsam mit dir gehen.
          </p>
        </div>

        {/* Vertikale Timeline auf allen Breiten — mit Zeitstrahl-Linie links */}
        <div className="relative max-w-[860px]">
          {/* Verbindungslinie */}
          <div
            aria-hidden="true"
            className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-[var(--vfr-rule)]"
          />

          <ol className="space-y-10 list-none p-0 m-0">
            {steps.map((s, i) => (
              <li key={s.nr} className="relative grid grid-cols-[48px_1fr] sm:grid-cols-[56px_1fr] gap-5">
                {/* Nummer-Kreis */}
                <div className="relative">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--vfr-accent)] text-white flex items-center justify-center font-bold text-[0.95rem] shadow-md relative z-10"
                    aria-hidden="true"
                  >
                    {s.nr}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white border border-[var(--vfr-rule)] rounded-sm overflow-hidden">
                  <div className="grid sm:grid-cols-[1fr_200px] gap-0">
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {s.duration}
                      </div>
                      <h3
                        className="text-[var(--vfr-fg)]"
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          margin: "0 0 8px",
                        }}
                      >
                        {s.title}
                      </h3>
                      <p className="m-0 text-[0.92rem] leading-relaxed text-[var(--vfr-fg-muted)]">
                        {s.text}
                      </p>
                    </div>

                    {/* Bild-Platzhalter rechts (oder unten auf Mobile) */}
                    <div
                      className="relative bg-[var(--vfr-bg-alt)] border-t sm:border-t-0 sm:border-l border-[var(--vfr-rule)] min-h-[140px] sm:min-h-0 flex items-center justify-center overflow-hidden"
                      aria-label={s.imageAlt ?? "Bild folgt"}
                    >
                      {s.imageSrc ? (
                        <Image
                          src={s.imageSrc}
                          alt={s.imageAlt ?? ""}
                          fill
                          sizes="(min-width: 640px) 200px, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-center p-4">
                          <svg
                            className="h-10 w-10 text-[var(--vfr-fg-soft)]/40 mb-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="text-[0.7rem] text-[var(--vfr-fg-soft)]">
                            Foto folgt
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Abschluss-Hinweis */}
        <div className="mt-12 max-w-[680px]">
          <p className="text-[0.95rem] text-[var(--vfr-fg)] leading-relaxed">
            <strong>Gesamt ca. 12 Monate</strong> von der Anmeldung bis zum
            Fahrlehrerschein. Wir begleiten dich bei jedem Schritt — auch bei
            der Suche nach der passenden Ausbildungsfahrschule für dein
            Lehrpraktikum.
          </p>
        </div>
      </div>
    </section>
  );
}
