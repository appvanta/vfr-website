import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    nr: "01",
    title: "Klasse BE",
    short: "PKW · Anhänger",
    desc: "Die Grundausbildung — Basis aller weiteren Klassen. Zwölf Monate mit Theorie, Praxis und integrierter Berufsphase.",
    href: "/fahrlehrerausbildung/be",
  },
  {
    nr: "02",
    title: "Klasse A",
    short: "Motorrad",
    desc: "Erweiterung für Motorräder. Eigener Trainingsplatz, abgestufte Maschinen-Klassen, intensive Praxis.",
    href: "/fahrlehrerausbildung/a",
  },
  {
    nr: "03",
    title: "Klasse CE",
    short: "LKW · Sattelzug",
    desc: "Eines der gefragtesten Felder. Modernste Fahrzeuge, Top-Stundensätze, garantierte Übernahme.",
    href: "/fahrlehrerausbildung/ce",
  },
  {
    nr: "04",
    title: "Klasse DE",
    short: "Bus · Linienverkehr",
    desc: "Wachsender Bereich im ÖPNV und Reiseverkehr. Praxis in echten Linien- und Reisebussen.",
    href: "/fahrlehrerausbildung/de",
  },
  {
    nr: "05",
    title: "Fortbildung",
    short: "§53 FahrlG",
    desc: "Pflichtfortbildungen für Ausbildungsfahrlehrer, Seminarleiter ASF und Gefahrgutbeauftragte.",
    href: "/fahrlehrerfortbildung",
  },
  {
    nr: "06",
    title: "Weiterbildung",
    short: "BWL · BKF · Büro",
    desc: "Spezialisierungen für Inhaber:innen und Mitarbeitende. BWL-Lehrgang, BKF-Ausbilder, Bürokraft.",
    href: "/fahrlehrerweiterbildung",
  },
];

export function ServiceGrid() {
  return (
    <section className="section">
      <div className="container-vfr">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-20 md:mb-28">
          <div className="lg:col-span-3">
            <span className="eyebrow">— Programme</span>
          </div>
          <div className="lg:col-span-9">
            <h2 className="display-section max-w-[18ch]">
              Sechs Programme.{" "}
              <span className="italic font-light text-vfr-500">
                Ein Anspruch.
              </span>
            </h2>
            <p className="lead mt-8">
              Von der Erstausbildung bis zur Spezialisierung: Wir bilden in
              jeder Klasse und auf jedem Niveau aus — fundiert, persönlich
              und mit dem Ziel einer langfristigen Karriere.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-16 gap-y-16">
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="editorial-card group block">
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-display italic text-base text-ink-400 font-light">
                  {s.nr}
                </span>
                <span className="eyebrow text-ink-400 [&::before]:hidden">
                  {s.short}
                </span>
              </div>
              <h3 className="display-card">{s.title}</h3>
              <p className="mt-5 text-ink-600 leading-relaxed font-light">
                {s.desc}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase font-medium text-ink-900 group-hover:gap-3 transition-all" style={{ letterSpacing: "0.22em" }}>
                Entdecken
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
