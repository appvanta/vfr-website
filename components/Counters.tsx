/**
 * Counter section that overlaps the hero from below (negative top margin)
 * Wie auf vfr-gmbh.de: 269 Ausbildungen / 250 Arbeitsplätze / 100% Zertifiziert
 */
export function Counters() {
  const items = [
    { number: "269", label: "Ausbildungen", strong: "Fahrlehrer:innen" },
    { number: "250", label: "Geschaffene", strong: "Arbeitsplätze" },
    { number: "100", suffix: "%", label: "Zertifizierte", strong: "Einrichtung" },
  ];

  return (
    <div className="relative -mt-16 md:-mt-24 z-10">
      <div className="innersection">
        <div className="gradient-blue rounded-sm shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 text-white">
            {items.map((it) => (
              <div key={it.label} className="flex items-center gap-6 py-8 px-8 md:px-10">
                <div className="flex items-baseline">
                  <span className="text-6xl md:text-7xl font-bold leading-none">{it.number}</span>
                  {it.suffix && <span className="text-3xl md:text-4xl font-bold ml-1">{it.suffix}</span>}
                </div>
                <p className="uppercase-thin text-sm md:text-base text-white/90">
                  {it.label} <strong className="block font-semibold text-white">{it.strong}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
