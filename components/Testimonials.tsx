const reviews = [
  {
    name: "Markus K.",
    role: "Absolvent Klasse BE/A · 2023",
    text: "Hervorragende Ausbildung mit hoher Praxisnähe. Das Team hat mir nicht nur den Unterricht beigebracht, sondern auch gleich den Job bei einer Top-Fahrschule vermittelt.",
  },
  {
    name: "Sandra R.",
    role: "Absolventin Klasse BE · 2024",
    text: "Die Atmosphäre ist familiär, die Dozenten top vorbereitet und die Materialien hochwertig. Die Bildungsgutschein-Abwicklung lief völlig problemlos.",
  },
  {
    name: "Mehmet Ö.",
    role: "Fortbildung · 2024",
    text: "Pflichtfortbildung ohne Pflicht-Langeweile. Klare Inhalte, gute Beispiele aus der Praxis und ich hatte direkt verwertbares Wissen für meinen Unterricht.",
  },
];

export function Testimonials() {
  return (
    <section className="section bg-cream-100 border-y border-ink-100">
      <div className="container-vfr">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-3">
            <span className="eyebrow">— Stimmen</span>
          </div>
          <div className="lg:col-span-9">
            <h2 className="display-section max-w-[20ch]">
              Was unsere Absolvent:innen{" "}
              <span className="italic font-light text-vfr-500">sagen.</span>
            </h2>
            <div className="mt-10 flex items-baseline gap-6">
              <span className="font-display font-extralight text-5xl text-vfr-500 tabular-nums">4,9</span>
              <div>
                <div className="text-sm text-ink-600">von 5,0 Sternen</div>
                <div className="eyebrow mt-1 [&::before]:hidden">200+ Google-Bewertungen</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {reviews.map((r, i) => (
            <figure key={r.name} className="flex flex-col">
              <div className="font-display font-extralight text-6xl text-vfr-500 leading-none mb-6">"</div>
              <blockquote className="font-display italic text-2xl leading-snug text-ink-800 font-light tracking-tight flex-1">
                {r.text}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-ink-200">
                <div className="text-sm font-medium text-ink-900">{r.name}</div>
                <div className="eyebrow mt-1.5 [&::before]:hidden">{r.role}</div>
              </figcaption>
              <div className="mt-4 font-display italic text-xs text-ink-400">№ 0{i + 1}</div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
