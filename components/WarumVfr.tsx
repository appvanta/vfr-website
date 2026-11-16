import {
  HeartHandshake,
  Target,
  Wrench,
  Smartphone,
  Clock,
  CheckSquare,
  Presentation,
  Building2,
  Coffee,
  Sparkles,
} from "lucide-react";

type Grund = {
  idx: string;
  Icon: typeof HeartHandshake;
  title: string;
  text: string;
};

// Quelle: VFR Masterplan 2027, Abschnitt 13.2 "Warum VFR? – zehn gute Gründe"
// Formulierungen bewusst 1:1 aus dem Masterplan — rechtlich und fachlich bereits freigegeben.
const gruende: Grund[] = [
  {
    idx: "01",
    Icon: HeartHandshake,
    title: "Persönliche Betreuung",
    text: "Unser Büroteam unterstützt bei Anträgen, Förderfragen und organisatorischen Anliegen. Die Entscheidung über Förderungen liegt bei den jeweiligen Stellen.",
  },
  {
    idx: "02",
    Icon: Target,
    title: "Individuelles Praxistraining",
    text: "Auf unserem eigenen Gelände üben Teilnehmer Grundfahraufgaben mit unterschiedlichen Fahrzeugkombinationen und erhalten gezieltes Feedback.",
  },
  {
    idx: "03",
    Icon: Wrench,
    title: "Technik zum Anfassen",
    text: "Originale Bauteile und Funktionsmodelle — darunter Schaltgetriebe mit Allradantrieb, DSG, Automatikgetriebe, Motoren, SCR-Abgasnachbehandlung und Common-Rail-System.",
  },
  {
    idx: "04",
    Icon: Smartphone,
    title: "Digitale Teilnehmer-App",
    text: "Termine, Unterlagen, Streckenaufzeichnung, Fahraufgabenbewertung und Lernfragen an einem Ort.",
  },
  {
    idx: "05",
    Icon: Clock,
    title: "Zusätzliche Lernzeit",
    text: "Jeden Dienstag 90 Minuten kostenloses Repetitorium nach dem regulären Unterricht.",
  },
  {
    idx: "06",
    Icon: CheckSquare,
    title: "Lernstand im Blick",
    text: "Lernzielkontrollen und Prüfungsfragen helfen, Wissensstand und Förderbedarf zu erkennen.",
  },
  {
    idx: "07",
    Icon: Presentation,
    title: "Aktiv unterrichten lernen",
    text: "Flipchart-Training, Präsentationen, gegenseitige Beobachtung und fachliche Beurteilung von Fahraufgaben.",
  },
  {
    idx: "08",
    Icon: Building2,
    title: "Moderne Ausbildungsumgebung",
    text: "Gut ausgestattete Schulungsräume, interaktive Technik und Räume für konzentriertes Lernen.",
  },
  {
    idx: "09",
    Icon: Coffee,
    title: "Gemeinschaft",
    text: "Lounge, Dart, Basketball, Außenflächen, großzügige Küche und gemeinsame Pausen.",
  },
  {
    idx: "10",
    Icon: Sparkles,
    title: "Besondere Lernerlebnisse",
    text: "Fahrsicherheitstrainings, Werkstatttag und weitere Veranstaltungen — soweit im jeweiligen Kurs tatsächlich vorgesehen.",
  },
];

export function WarumVfr() {
  return (
    <section className="vfr-section">
      <div className="vfr-wrap">
        {/* Kopf: Eyebrow + Überschrift + Lead-Paragraph */}
        <div className="max-w-[720px] mb-12">
          <span className="vfr-eyebrow">Warum VFR</span>
          <h2 className="vfr-h2 mt-4">
            Mehr als Fahrlehrerausbildung.
          </h2>
          <p className="text-[var(--vfr-fg-muted)] mt-5 text-[1.05rem] leading-relaxed">
            Persönlich begleitet. Praxisnah ausgebildet. Digital unterstützt. Zehn
            konkrete Gründe, warum Teilnehmer uns weiterempfehlen.
          </p>
        </div>

        {/* 10 Kacheln — 3 Spalten auf Desktop, 2 auf Tablet, 1 auf Mobile */}
        <ul className="list-none p-0 m-0 grid gap-px bg-[var(--vfr-rule)] border border-[var(--vfr-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {gruende.map(({ idx, Icon, title, text }) => (
            <li
              key={idx}
              className="bg-[var(--vfr-card)] p-7 flex flex-col"
              style={{ minHeight: 210 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="shrink-0 flex items-center justify-center rounded-sm"
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--vfr-accent)",
                    color: "#fff",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className="font-[family-name:var(--font-serif)] italic text-[var(--vfr-accent)]"
                  style={{ fontSize: "0.95rem" }}
                >
                  {idx}
                </span>
              </div>
              <h3 className="font-sans text-[1.05rem] font-semibold mb-2 text-[var(--vfr-fg)]">
                {title}
              </h3>
              <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] m-0 leading-relaxed">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
