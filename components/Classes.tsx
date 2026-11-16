import Link from "next/link";
import { ArrowRight } from "lucide-react";

const classes = [
  {
    title: "Fahrlehrerlaubnis BE",
    text: "Die Grundausbildung – PKW und PKW mit Anhänger. Voraussetzung für alle weiteren Klassen.",
    href: "/fahrlehrerausbildung/be",
  },
  {
    title: "Fahrlehrerlaubnis A",
    text: "Motorrad-Erweiterung mit eigenem Trainingsplatz und moderner Maschinen-Flotte.",
    href: "/fahrlehrerausbildung/a",
  },
  {
    title: "Fahrlehrerlaubnis CE",
    text: "LKW und Sattelzug – einer der gefragtesten Bereiche mit Top-Verdienstmöglichkeiten.",
    href: "/fahrlehrerausbildung/ce",
  },
  {
    title: "Fahrlehrerlaubnis DE",
    text: "Bus und Bus mit Anhänger – wachsender Bereich im ÖPNV und Reiseverkehr.",
    href: "/fahrlehrerausbildung/de",
  },
];

export function Classes() {
  return (
    <section className="py-20 md:py-24 bg-[#f4f4f4]">
      <div className="innersection">
        <div className="text-center mb-12">
          <h3 className="iconbeforecenter h-section">Klassen der Fahrlehrerausbildung</h3>
          <p className="bluetextcolor mt-4">BE · A · CE · DE</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group bg-white p-6 lg:p-8 rounded-sm shadow-sm hover:shadow-xl transition-shadow border-t-4 border-[#2080c0]"
            >
              <h4 className="text-xl font-bold mb-3 group-hover:text-[#2080c0] transition">{c.title}</h4>
              <p className="text-[#5d5d5d] text-[14.5px] leading-relaxed mb-5">{c.text}</p>
              <span className="inline-flex items-center gap-1.5 text-[#2080c0] font-semibold text-sm uppercase tracking-wider group-hover:gap-2.5 transition-all">
                Mehr erfahren <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
