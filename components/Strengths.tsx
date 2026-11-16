import Link from "next/link";
import { Quote } from "lucide-react";

const items = [
  {
    title: "Zertifizierter Bildungsträger",
    text: "Die VFR ist ein anerkannter Träger der Arbeitsförderung nach AZAV. Wir akzeptieren Bildungsgutscheine, Bildungsschecks und beraten Sie gerne zu weiteren Finanzierungsmöglichkeiten für Ihre Fahrlehrerausbildung in Köln.",
    img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    span: "small",
  },
  {
    title: "Kooperationen über NRW hinaus",
    text: "Wir pflegen eine intensive Zusammenarbeit mit vielen namhaften Fahrschulen in ganz NRW und den angrenzenden Bundesländern. Dadurch können wir Sie nach erfolgreichem Abschluss bei der Suche nach einer Festanstellung als Fahrlehrer unterstützen.",
    img: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&w=900&q=80",
    span: "large",
  },
  {
    title: "Motiviertes Team & produktive Arbeitsatmosphäre",
    text: "Als Mitglied der Bundesarbeitsgemeinschaft der Fahrlehrerausbildungsstätten (BAGFA) steht die VFR für eine qualifizierte Fahrlehrerausbildung. Unser motiviertes Team setzt sich aus jungen und zugleich erfahrenen Dozenten zusammen.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    span: "small",
  },
  {
    title: "Fahrlehrerfortbildung",
    text: "Fahrlehrer müssen in regelmäßigen Abständen Fortbildungskurse besuchen. Auch hier sind wir Ihr kompetenter Partner und bieten Ihnen eine Reihe interessanter Fortbildungskurse an.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    span: "small",
  },
  {
    title: "Gute Verkehrsanbindung",
    text: "Die VFR hat Ihren Sitz in der Stadt Niederkassel, die ziemlich genau zwischen Köln und Bonn liegt. 70 kostenlose eigene Parkplätze und mehrere 150/300kw Ladesäulen für E-Fahrzeuge in nur 1 Minute Fußweg.",
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    span: "small",
  },
];

export function Strengths() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="innersection text-center mb-14">
        <h3 className="iconbeforecenter h-section">Unsere Stärken im Überblick</h3>
        <p className="bluetextcolor mt-4">Unsere Vorteile</p>
        <p className="mt-6 max-w-3xl mx-auto text-[#5d5d5d] leading-relaxed">
          Seit vielen Jahren zählt die Verkehrsfachschule Rheinland zu den führenden
          Aus- und Weiterbildungsstätten für Fahrlehrer in NRW. Neben der qualifizierten
          Fahrlehrerausbildung profitieren Sie von zahlreichen weiteren Vorteilen.
        </p>
      </div>

      <div className="innersection">
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-flow-dense gap-4 md:gap-5">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`group relative overflow-hidden rounded-sm cursor-pointer ${
                it.span === "large" ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-square"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${it.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a6ba0]/95 via-[#2080c0]/60 to-transparent opacity-90 group-hover:from-[#1a6ba0] group-hover:via-[#2080c0]/90 transition-all" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 text-white">
                <h5 className="font-bold text-base md:text-lg lg:text-xl leading-tight mb-2">{it.title}</h5>
                <p className={`text-sm leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${it.span === "large" ? "line-clamp-6" : "line-clamp-4"}`}>
                  {it.text}
                </p>
              </div>
            </article>
          ))}

          {/* Quote item */}
          <article className="col-span-2 lg:col-span-4 bg-[#f4f4f4] p-8 md:p-10 flex flex-col items-center text-center rounded-sm">
            <Quote className="h-10 w-10 text-[#2080c0] mb-4" strokeWidth={1.5} />
            <p className="text-lg md:text-xl text-[#2b2b2b] max-w-3xl italic leading-relaxed">
              „Jahr für Jahr machen über eine Million Menschen in Deutschland den Führerschein —
              die Nachfrage ist auch im Rhein-Sieg-Kreis ungebrochen hoch."
            </p>
            <div className="mt-5 h-px w-16 bg-[#2080c0]" />
          </article>
        </div>

        <div className="text-center mt-12">
          <Link href="/termine-preise" className="btn-vfr">Termine &amp; Preise</Link>
        </div>
      </div>
    </section>
  );
}
