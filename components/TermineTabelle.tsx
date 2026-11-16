import Link from "next/link";

const rows = [
  {
    klasse: "BE",
    lehrgang: "Fahrlehrerausbildung",
    start: "13.01.2027",
    dauer: "ca. 12 Monate",
    preis: "auf Anfrage",
  },
  {
    klasse: "BE",
    lehrgang: "Fahrlehrerausbildung",
    start: "14.04.2027",
    dauer: "ca. 12 Monate",
    preis: "auf Anfrage",
  },
  {
    klasse: "A",
    lehrgang: "Erweiterung Motorrad",
    start: "22.02.2027",
    dauer: "ca. 4 Wochen",
    preis: "auf Anfrage",
  },
  {
    klasse: null,
    lehrgang: "Pflichtfortbildung § 53 (1)",
    start: "06.02.2027",
    dauer: "1 Tag",
    preis: "auf Anfrage",
  },
  {
    klasse: null,
    lehrgang: "ASF-Fortbildung § 53 (2)",
    start: "13.03.2027",
    dauer: "2 Tage",
    preis: "auf Anfrage",
  },
];

export function TermineTabelle() {
  return (
    <section className="vfr-section" id="termine">
      <div className="vfr-wrap">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <span className="vfr-eyebrow">Nächste Lehrgänge</span>
            <h2 className="vfr-h2 mt-4">Termine und Verfügbarkeit.</h2>
            <p className="text-[var(--vfr-fg-muted)] max-w-[40ch] mt-2">
              Aktuelle Starts für Ausbildung und Pflichtfortbildungen. Bei allen
              Ausbildungen inklusive Lehrmaterial und Dienstags-Repetitorium.
            </p>
          </div>
          <Link href="/termine-preise" className="vfr-btn vfr-btn--ghost !py-3 !px-5">
            Alle Termine ansehen →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold pb-3 border-b-2 border-[var(--vfr-fg)] pr-4" style={{ width: "40%" }}>
                  Lehrgang
                </th>
                <th className="text-left text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold pb-3 border-b-2 border-[var(--vfr-fg)] pr-4">
                  Start
                </th>
                <th className="text-left text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold pb-3 border-b-2 border-[var(--vfr-fg)] pr-4">
                  Dauer
                </th>
                <th className="text-left text-[0.72rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-soft)] font-semibold pb-3 border-b-2 border-[var(--vfr-fg)] pr-4">
                  Preis
                </th>
                <th className="pb-3 border-b-2 border-[var(--vfr-fg)]" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="py-4 pr-4 border-b border-[var(--vfr-rule)] text-[0.95rem]">
                    {r.klasse && (
                      <span className="inline-block font-[family-name:var(--font-serif)] font-medium bg-[var(--vfr-bg-alt)] px-2.5 py-0.5 rounded-[2px] text-[var(--vfr-accent)] mr-2 tracking-tight">
                        {r.klasse}
                      </span>
                    )}
                    <span className="text-[var(--vfr-fg)]">{r.lehrgang}</span>
                  </td>
                  <td className="py-4 pr-4 border-b border-[var(--vfr-rule)] font-[family-name:var(--font-serif)] font-medium text-[var(--vfr-fg)] text-[1.05rem]">
                    {r.start}
                  </td>
                  <td className="py-4 pr-4 border-b border-[var(--vfr-rule)] text-[var(--vfr-fg-muted)] text-[0.92rem] tabular-nums">
                    {r.dauer}
                  </td>
                  <td className="py-4 pr-4 border-b border-[var(--vfr-rule)] text-[var(--vfr-fg-muted)] text-[0.92rem]">
                    {r.preis}
                  </td>
                  <td className="py-4 border-b border-[var(--vfr-rule)] text-right">
                    <Link href="/termine-preise" className="text-[var(--vfr-accent-dark)] font-semibold text-[0.88rem] hover:text-[var(--vfr-accent)] no-underline">
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[0.82rem] text-[var(--vfr-fg-soft)]">
          Platzhalter-Termine für den Entwurf. In der Live-Version werden Termine
          und Preise aus Flario gepflegt und sind verbindlich.
        </p>
      </div>
    </section>
  );
}
