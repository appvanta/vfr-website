import Link from "next/link";

export function Repetitorium() {
  return (
    <section className="vfr-section bg-[var(--vfr-dark)] text-[var(--vfr-bg)] relative overflow-hidden">
      {/* Weicher Akzent-Glow rechts */}
      <div
        className="absolute top-0 right-0 w-[60%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 50%, rgba(21,119,155,0.22) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="vfr-wrap relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="vfr-eyebrow vfr-eyebrow--gold">Unser Mehrwert</span>
          <h2 className="font-[family-name:var(--font-serif)] text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-[var(--vfr-bg)] font-medium mt-4">
            90 Minuten extra.
            <span className="block font-[family-name:var(--font-serif)] italic font-normal text-[var(--vfr-highlight)]">
              Jede Woche. Kostenlos.
            </span>
          </h2>
          <p className="text-[#cdd6dc] max-w-[42ch] mt-6">
            Bei der VFR endet die Unterstützung nicht mit dem regulären
            Unterricht. Jeden Dienstag bieten wir unseren Teilnehmern im Anschluss
            ein zusätzliches, kostenloses 90-minütiges Repetitorium an.
          </p>
          <p className="text-[#cdd6dc] max-w-[42ch] mt-4">
            Wir wiederholen wichtige Ausbildungsinhalte, klären offene Fragen und
            unterstützen dich gezielt bei der Vorbereitung auf die
            Fachkundeprüfung.
          </p>
          <Link href="/fahrlehrerausbildung#repetitorium" className="vfr-btn vfr-btn--gold mt-8">
            Mehr zum Repetitorium
          </Link>
        </div>

        <div className="bg-[var(--vfr-dark-alt)] border border-[var(--vfr-dark-rule)] p-7 grid gap-1">
          {[
            { k: "Wann", v: "Jeden Dienstag" },
            { k: "Wo", v: "Im Anschluss an den Unterricht" },
            { k: "Dauer", v: "90 Minuten" },
            { k: "Teilnahme", v: "Kostenlos für VFR-Teilnehmer" },
            { k: "Inhalt", v: "Wiederholung · Fragen · Prüfungsvorbereitung" },
          ].map((row, i, arr) => (
            <div
              key={row.k}
              className={`flex justify-between items-baseline gap-4 py-4 ${
                i === arr.length - 1 ? "" : "border-b border-dashed border-[var(--vfr-dark-rule)]"
              }`}
            >
              <span className="text-[var(--vfr-highlight)] text-[0.75rem] uppercase tracking-[0.1em] font-semibold">
                {row.k}
              </span>
              <span className="font-[family-name:var(--font-serif)] text-[1.1rem] text-[var(--vfr-bg)] font-medium tabular-nums text-right">
                {row.v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
