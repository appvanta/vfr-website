import { ImageIcon, Users } from "lucide-react";

// Text-Grundlage: VFR Masterplan 2027, Abschnitt 13.6 "Büroteam und Förderung"
// Caveats (keine Förderzusage, Entscheidung durch Kostenträger) sind bewusst mit drin.

const foerderstellen = [
  "Agentur für Arbeit",
  "Jobcenter",
  "Deutsche Rentenversicherung",
  "Berufsförderungsdienst der Bundeswehr",
  "BAföG-Förderstellen (sofern einschlägig)",
];

export function PersoenlicheBetreuung() {
  return (
    <section
      className="vfr-section"
      style={{ background: "var(--vfr-bg-alt)" }}
    >
      <div className="vfr-wrap grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        {/* Text links */}
        <div>
          <span className="vfr-eyebrow">Unser Büroteam</span>
          <h2 className="vfr-h2 mt-4">
            Wir kümmern uns — persönlich und unkompliziert.
          </h2>
          <p className="mt-5 text-[1rem] text-[var(--vfr-fg-muted)] leading-relaxed max-w-[55ch]">
            Unser Büroteam unterstützt bei Fragen zu Anträgen, möglichen
            Förderwegen und organisatorischen Abläufen. Wir helfen beim
            Zusammenstellen von Unterlagen und bei der Klärung offener Fragen —
            von der ersten Anfrage bis zur Erteilung der Fahrlehrerlaubnis.
          </p>

          <div className="mt-7">
            <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-3">
              Wir sind Kontakt zu
            </div>
            <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
              {foerderstellen.map((s) => (
                <li
                  key={s}
                  className="text-[0.85rem] text-[var(--vfr-fg)] px-3 py-1.5 bg-white border border-[var(--vfr-rule)] rounded-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-[0.82rem] text-[var(--vfr-fg-muted)] max-w-[55ch] italic">
            Eine Förderzusage können wir nicht versprechen — die Entscheidung
            liegt bei den jeweiligen Stellen. Wir prüfen gemeinsam mit dir, was
            in Frage kommt.
          </p>
        </div>

        {/* Bürokräfte-Foto-Platzhalter rechts */}
        <div
          className="relative aspect-[4/3] bg-white border border-[var(--vfr-rule)] flex items-center justify-center overflow-hidden"
          style={{ minHeight: 280 }}
        >
          <div className="flex flex-col items-center gap-3 text-[var(--vfr-fg-muted)]">
            <Users className="h-10 w-10 opacity-40" />
            <div
              className="text-[0.72rem] uppercase tracking-[0.12em] font-semibold"
              style={{ letterSpacing: "0.1em" }}
            >
              Foto folgt
            </div>
            <div className="text-[0.85rem] text-center px-6">
              Unser Büroteam —<br />
              <ImageIcon
                className="inline h-3.5 w-3.5 opacity-50 mr-1"
                aria-hidden
              />
              Foto wird ergänzt
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
