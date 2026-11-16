import Link from "next/link";
import { ArrowRight, Car, Bike, Truck, Bus } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Angebot = {
  code: string;
  title: string;
  sub: string;
  href: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

const ausbildung: Angebot[] = [
  {
    code: "BE",
    title: "Fahrlehrerausbildung",
    sub: "Grundausbildung PKW · 12 Monate",
    href: "/fahrlehrerausbildung/be",
    Icon: Car,
  },
  {
    code: "A",
    title: "Erweiterung Motorrad",
    sub: "Klassenerweiterung · ca. 4 Wochen",
    href: "/fahrlehrerausbildung/a",
    Icon: Bike,
  },
  {
    code: "CE",
    title: "Erweiterung LKW",
    sub: "Güterkraftverkehr ab 3,5 t",
    href: "/fahrlehrerausbildung/ce",
    Icon: Truck,
  },
  {
    code: "DE",
    title: "Erweiterung Bus",
    sub: "Personenverkehr — ÖPNV und Reise",
    href: "/fahrlehrerausbildung/de",
    Icon: Bus,
  },
];

const fortbildung: Angebot[] = [
  {
    code: "§ 53 (1)",
    title: "Allgemeine Fortbildung",
    sub: "Pflicht alle 4 Jahre · 4 Tage",
    href: "/fahrlehrerfortbildung",
  },
  {
    code: "§ 53 (2)",
    title: "ASF & FES Seminarleitung",
    sub: "Für Seminarleiter:innen",
    href: "/fahrlehrerfortbildung",
  },
  {
    code: "§ 53 (3)",
    title: "Ausbildungsfahrlehrer:in",
    sub: "Begleitung von Anwärter:innen",
    href: "/fahrlehrerfortbildung",
  },
  {
    code: "§ 7",
    title: "BKrFQV-Fortbildung",
    sub: "Berufskraftfahrer-Qualifikation",
    href: "/fahrlehrerfortbildung",
  },
];

export function Quickstart() {
  return (
    <section className="vfr-section" style={{ paddingBlock: "80px" }}>
      <div className="vfr-wrap">
        <div className="text-center mb-14 max-w-[680px] mx-auto">
          <span className="vfr-eyebrow">Unser Angebot</span>
          <h2 className="vfr-h2 mt-2">Alles für den Fahrlehrerberuf.</h2>
          <p
            className="mt-4"
            style={{
              color: "var(--vfr-fg-muted)",
              fontSize: 17,
            }}
          >
            Ausbildung, Pflichtfortbildung und Weiterbildung — unter einem Dach
            in Niederkassel, zwischen Köln und Bonn.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* AUSBILDUNG */}
          <div>
            <div className="flex items-baseline justify-between pb-4 border-b-2 border-[var(--vfr-fg)] mb-2">
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Fahrlehrerausbildung
              </h3>
              <Link
                href="/fahrlehrerausbildung"
                className="text-[13px] font-semibold uppercase tracking-wider text-[var(--vfr-accent)] hover:text-[var(--vfr-accent-dark)]"
              >
                Übersicht →
              </Link>
            </div>
            <ul className="list-none p-0 m-0">
              {ausbildung.map((a) => {
                const Icon = a.Icon;
                return (
                  <li key={a.code}>
                    <Link
                      href={a.href}
                      className="group grid grid-cols-[72px_1fr_auto] gap-4 items-center py-4 border-b border-[var(--vfr-rule)] hover:bg-[var(--vfr-bg-alt)] px-3 -mx-3 transition-colors no-underline"
                    >
                      <span className="flex items-center justify-center gap-2 bg-[var(--vfr-bg-alt)] group-hover:bg-[var(--vfr-accent)]/10 border border-[var(--vfr-rule)] rounded-md py-2 transition-colors">
                        {Icon && (
                          <Icon
                            className="h-5 w-5 text-[var(--vfr-accent)]"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--vfr-accent)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {a.code}
                        </span>
                      </span>
                      <span>
                        <span
                          className="block"
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--vfr-fg)",
                          }}
                        >
                          {a.title}
                        </span>
                        <span
                          className="block mt-0.5"
                          style={{
                            fontSize: 13,
                            color: "var(--vfr-fg-muted)",
                          }}
                        >
                          {a.sub}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-[var(--vfr-fg-soft)] group-hover:text-[var(--vfr-accent)] group-hover:translate-x-0.5 transition" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* FORTBILDUNG */}
          <div>
            <div className="flex items-baseline justify-between pb-4 border-b-2 border-[var(--vfr-fg)] mb-2">
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Fortbildung & Weiterbildung
              </h3>
              <Link
                href="/fahrlehrerfortbildung"
                className="text-[13px] font-semibold uppercase tracking-wider text-[var(--vfr-accent)] hover:text-[var(--vfr-accent-dark)]"
              >
                Übersicht →
              </Link>
            </div>
            <ul className="list-none p-0 m-0">
              {fortbildung.map((f) => (
                <li key={f.code}>
                  <Link
                    href={f.href}
                    className="group grid grid-cols-[60px_1fr_auto] gap-4 items-center py-4 border-b border-[var(--vfr-rule)] hover:bg-[var(--vfr-bg-alt)] px-3 -mx-3 transition-colors no-underline"
                  >
                    <span
                      className="text-center"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--vfr-accent)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {f.code}
                    </span>
                    <span>
                      <span
                        className="block"
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "var(--vfr-fg)",
                        }}
                      >
                        {f.title}
                      </span>
                      <span
                        className="block mt-0.5"
                        style={{
                          fontSize: 13,
                          color: "var(--vfr-fg-muted)",
                        }}
                      >
                        {f.sub}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 text-[var(--vfr-fg-soft)] group-hover:text-[var(--vfr-accent)] group-hover:translate-x-0.5 transition"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Zusatzservices + Beratung */}
        <div
          className="mt-14 pt-10 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--vfr-rule)" }}
        >
          <div className="flex flex-wrap gap-6">
            <Link
              href="/service"
              className="text-[14px] font-medium text-[var(--vfr-fg)] hover:text-[var(--vfr-accent)]"
            >
              Spezialschulungen →
            </Link>
            <Link
              href="/foerderung"
              className="text-[14px] font-medium text-[var(--vfr-fg)] hover:text-[var(--vfr-accent)]"
            >
              Fördermöglichkeiten →
            </Link>
            <Link
              href="/termine-preise"
              className="text-[14px] font-medium text-[var(--vfr-fg)] hover:text-[var(--vfr-accent)]"
            >
              Termine & Preise →
            </Link>
          </div>
          <Link href="/kontakt" className="vfr-btn vfr-btn--primary">
            Beratung vereinbaren
          </Link>
        </div>
      </div>
    </section>
  );
}
