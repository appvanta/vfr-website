import Link from "next/link";
import { Car, Award, BookOpen } from "lucide-react";

const categories = [
  {
    icon: Car,
    title: "Fahrlehrerausbildung",
    text: "Fahrlehrer ist ein spannender und vor allem ein langfristig sicherer Job – Fahrlehrerinnen und Fahrlehrer werden schließlich immer gebraucht.",
    href: "/fahrlehrerausbildung",
  },
  {
    icon: Award,
    title: "Fahrlehrerfortbildung",
    text: "Die stetige Fort- und Weiterbildung ist ein wichtiger Bestandteil des Fahrschullehrerberufs.",
    href: "/fahrlehrerfortbildung",
  },
  {
    icon: BookOpen,
    title: "Fahrlehrerweiterbildung",
    text: "Die Fortbildung hat einen Gesamtumfang von mindestens 24 Unterrichtseinheiten und ist spätestens alle vier Jahre zu absolvieren.",
    href: "/fahrlehrerweiterbildung",
  },
];

export function Categories() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="innersection">
        <div className="text-center mb-14 md:mb-16">
          <h3 className="iconbeforecenter h-section">Kategorien der Fahrlehrerausbildung</h3>
          <p className="bluetextcolor mt-4">Vom Anfänger bis zum Fortgeschrittenen</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className="group text-center flex flex-col items-center fadeInUpShort"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="h-32 w-32 rounded-full bg-[#f4f4f4] grid place-items-center mb-6 group-hover:bg-[#2080c0] transition-colors duration-300">
                <c.icon className="h-14 w-14 text-[#2080c0] group-hover:text-white transition-colors" strokeWidth={1.25} />
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-[#2080c0] transition">{c.title}</h4>
              <p className="text-[#5d5d5d] text-[15px] leading-relaxed mb-6 max-w-[34ch]">{c.text}</p>
              <span className="btn-outline-vfr">Lesen Sie Mehr</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
