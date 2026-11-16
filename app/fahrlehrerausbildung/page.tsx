import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Truck,
  Bus,
  MessageCircle,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { PageHero } from "@/components/PageHero";
import { CourseCard } from "@/components/CourseCard";
import { CTASection } from "@/components/CTASection";
import { listCourses } from "@/lib/flario";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Fahrlehrerausbildung — Klassen BE, A, CE, DE",
  description:
    "Fahrlehrerausbildung in Niederkassel: Klasse BE als Grundausbildung für Quereinsteiger, plus Erweiterungen A, CE und DE für bereits aktive Fahrlehrer.",
  alternates: { canonical: "/fahrlehrerausbildung" },
};

type Erweiterung = {
  code: string;
  title: string;
  text: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const erweiterungen: Erweiterung[] = [
  {
    code: "A",
    title: "Motorrad",
    text: "Erweiterung für Zweiräder. Eigener Übungsplatz und moderne Maschinen.",
    href: "/fahrlehrerausbildung/a",
    Icon: Bike,
  },
  {
    code: "CE",
    title: "LKW & Sattelzug",
    text: "Güterkraftverkehr unterrichten. Fahrzeuge ab 3,5 t, stark nachgefragt.",
    href: "/fahrlehrerausbildung/ce",
    Icon: Truck,
  },
  {
    code: "DE",
    title: "Bus",
    text: "Personenverkehr. Praxis mit echten Linien- und Reisebussen.",
    href: "/fahrlehrerausbildung/de",
    Icon: Bus,
  },
];

type AblaufSchritt = {
  n: string;
  t: string;
  d: string;
  dauer: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const ablauf: AblaufSchritt[] = [
  {
    n: "01",
    t: "Beratung & Anmeldung",
    d: "Wir klären mit dir Voraussetzungen, Fördermöglichkeiten und den passenden Starttermin.",
    dauer: "1–2 Wochen",
    Icon: MessageCircle,
  },
  {
    n: "02",
    t: "Theorie- und Praxisphase",
    d: "Fachkundige Ausbildung in Didaktik, Verkehrsrecht, Pädagogik, Fahrzeugtechnik — von Anfang an praxisnah.",
    dauer: "8 Monate",
    Icon: BookOpen,
  },
  {
    n: "03",
    t: "Lehrpraktikum",
    d: "Du lernst in einer Partnerfahrschule, wie Unterricht in der echten Welt funktioniert.",
    dauer: "mind. 4 Monate",
    Icon: Users,
  },
  {
    n: "04",
    t: "Prüfung & Fahrlehrerschein",
    d: "Intensive Prüfungsvorbereitung mit Lehrproben. Danach hältst du deine Fahrlehrerlaubnis in der Hand.",
    dauer: "1–2 Wochen",
    Icon: GraduationCap,
  },
];

export default async function AusbildungPage() {
  const upcoming = await listCourses({ onlyBookable: true });
  const ausbildungen = upcoming
    .filter((c) => c.category.startsWith("ausbildung"))
    .slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="Fahrlehrerausbildung"
        image="/hero/startseite-flotte.jpg"
        title="Werde Fahrlehrer:in."
        lead="Unsere Fahrlehrerausbildung verbindet fachliche Grundlagen mit praktischen Übungen, modernen Unterrichtsmethoden und persönlicher Begleitung."
      />

      {/* BE — der Hauptpfad für Quereinsteiger */}
      <section className="vfr-section" style={{ paddingBlock: "80px" }}>
        <div className="vfr-wrap">
          <div
            className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center p-8 lg:p-12"
            style={{
              background: "var(--vfr-bg-alt)",
              border: "1px solid var(--vfr-rule)",
            }}
          >
            <div>
              <span className="vfr-eyebrow">Für Quereinsteiger</span>
              <div
                className="mt-3"
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  color: "var(--vfr-accent)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                BE
              </div>
              <h2
                className="vfr-h2 mt-4"
                style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
              >
                Fahrlehrer werden.
              </h2>
              <p
                className="mt-4"
                style={{
                  color: "var(--vfr-fg-muted)",
                  fontSize: 18,
                  maxWidth: 520,
                }}
              >
                Die Grundausbildung Klasse BE ist der Weg in den Fahrlehrerberuf —
                12 Monate Theorie, Praxis und Lehrpraktikum. Danach stehen dir alle
                weiteren Klassen offen. Mit Bildungsgutschein förderbar.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/fahrlehrerausbildung/be"
                  className="vfr-btn vfr-btn--primary"
                >
                  Zur Klasse BE
                </Link>
                <Link href="/kontakt" className="vfr-btn vfr-btn--ghost">
                  Beratung vereinbaren
                </Link>
              </div>
            </div>

            <div>
              <div
                className="pb-3 mb-3 flex items-baseline justify-between"
                style={{ borderBottom: "1px solid var(--vfr-rule)" }}
              >
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "var(--vfr-fg-soft)",
                  }}
                >
                  Eckdaten
                </span>
              </div>
              {[
                { k: "Dauer", v: "ca. 12 Monate" },
                { k: "Umfang", v: "Theorie · Praxis · Lehrpraktikum" },
                { k: "Nächster Start", v: "13.01.2027" },
                { k: "Förderung", v: "Bildungsgutschein möglich" },
                { k: "Extra", v: "Kostenloses Dienstags-Repetitorium" },
              ].map((r, i, arr) => (
                <div
                  key={r.k}
                  className="grid grid-cols-[110px_1fr] gap-3 py-2.5"
                  style={{
                    borderBottom:
                      i === arr.length - 1
                        ? "none"
                        : "1px solid var(--vfr-rule)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--vfr-fg-soft)",
                      fontWeight: 600,
                      paddingTop: 2,
                    }}
                  >
                    {r.k}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      color: "var(--vfr-fg)",
                      fontWeight: 500,
                    }}
                  >
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Erweiterungen A / CE / DE — für bereits aktive Fahrlehrer */}
      <section className="vfr-section" style={{ paddingBlock: "60px 90px" }}>
        <div className="vfr-wrap">
          <div className="max-w-[640px] mb-10">
            <span className="vfr-eyebrow">Für aktive Fahrlehrer:innen</span>
            <h2 className="vfr-h2 mt-2">Klassenerweiterungen.</h2>
            <p
              className="mt-3"
              style={{ color: "var(--vfr-fg-muted)", fontSize: 17 }}
            >
              Du hast bereits die Fahrlehrerlaubnis Klasse BE? Erweitere dein
              Angebot um Motorrad, LKW oder Bus — jede Klasse einzeln buchbar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {erweiterungen.map((e) => {
              const Icon = e.Icon;
              return (
                <Link
                  key={e.code}
                  href={e.href}
                  className="group block p-7 no-underline transition-colors hover:border-[var(--vfr-accent)]"
                  style={{
                    background: "var(--vfr-card)",
                    border: "1px solid var(--vfr-rule)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center bg-[var(--vfr-bg-alt)] group-hover:bg-[var(--vfr-accent)]/10 border border-[var(--vfr-rule)] rounded-md w-14 h-14 shrink-0 transition-colors"
                      aria-hidden="true"
                    >
                      <Icon className="h-7 w-7 text-[var(--vfr-accent)]" />
                    </div>
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 700,
                        color: "var(--vfr-accent)",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {e.code}
                    </div>
                  </div>
                  <div
                    className="mt-4"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--vfr-fg-soft)",
                      fontWeight: 600,
                    }}
                  >
                    Erweiterung {e.title}
                  </div>
                  <p
                    className="mt-3"
                    style={{
                      fontSize: 14,
                      color: "var(--vfr-fg-muted)",
                      lineHeight: 1.6,
                      margin: "12px 0 0",
                    }}
                  >
                    {e.text}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 mt-5 group-hover:gap-2.5 transition-all"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--vfr-accent)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Zur Klasse {e.code}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section
        className="vfr-section"
        style={{ background: "var(--vfr-bg-alt)" }}
      >
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">So läuft es ab</span>
          <h2 className="vfr-h2 mt-2">Mit uns an deiner Seite — in vier Stationen.</h2>
          <p
            className="mb-14"
            style={{ color: "var(--vfr-fg-muted)", maxWidth: "55ch", fontSize: 17 }}
          >
            Vom ersten Beratungsgespräch bis zur Fahrlehrerlaubnis — rund 12
            Monate, in denen du nie allein läufst. Wir kennen jede Hürde und
            räumen sie mit dir zusammen aus dem Weg.
          </p>

          {/* Timeline — horizontal auf Desktop, vertikal auf Mobile */}
          <div className="relative">
            {/* Verbindungslinie Desktop (horizontal) */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, var(--vfr-accent) 0%, var(--vfr-accent) 100%)",
                opacity: 0.25,
              }}
            />
            {/* Verbindungslinie Mobile (vertikal) */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute top-16 bottom-16 left-8 w-0.5"
              style={{ background: "var(--vfr-accent)", opacity: 0.25 }}
            />

            <ol className="relative grid lg:grid-cols-4 gap-6 lg:gap-4 list-none p-0 m-0">
              {ablauf.map((s) => {
                const Icon = s.Icon;
                return (
                  <li
                    key={s.n}
                    className="relative grid grid-cols-[64px_1fr] lg:grid-cols-1 gap-4 lg:gap-0"
                  >
                    {/* Nummernkreis mit Icon */}
                    <div className="relative lg:flex lg:justify-center">
                      <div
                        className="w-16 h-16 rounded-full bg-[var(--vfr-accent)] text-white flex items-center justify-center shadow-md relative z-10 ring-4 ring-[var(--vfr-bg-alt)]"
                        aria-hidden="true"
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      {/* Nummer-Badge rechts oben am Kreis */}
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 -right-1 lg:right-auto lg:left-[calc(50%+12px)] bg-white border-2 border-[var(--vfr-accent)] text-[var(--vfr-accent)] text-[0.68rem] font-bold rounded-full w-6 h-6 flex items-center justify-center z-20"
                      >
                        {s.n}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="lg:mt-6 lg:text-center lg:px-2">
                      <div
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[var(--vfr-rule)] text-[0.7rem] font-semibold text-[var(--vfr-accent)] uppercase tracking-wider mb-2"
                      >
                        {s.dauer}
                      </div>
                      <h3
                        className="text-[var(--vfr-fg)]"
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          margin: "4px 0 10px",
                        }}
                      >
                        {s.t}
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--vfr-fg-muted)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {s.d}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Highlight-Footer mit Gesamt-Info */}
          <div
            className="mt-14 p-6 rounded-sm flex flex-wrap items-center justify-between gap-5 border"
            style={{
              background: "var(--vfr-card)",
              borderColor: "var(--vfr-rule)",
            }}
          >
            <div>
              <div className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--vfr-accent)] font-semibold mb-1">
                Gesamtdauer
              </div>
              <div className="text-[1.3rem] font-semibold text-[var(--vfr-fg)]">
                ca. 12 Monate bis zum Fahrlehrerschein
              </div>
              <p className="text-[0.9rem] text-[var(--vfr-fg-muted)] mt-1 m-0">
                Kostenloses Repetitorium jeden Dienstag inklusive · Bildungsgutschein akzeptiert
              </p>
            </div>
            <Link
              href="/beratung"
              className="vfr-btn vfr-btn--primary"
            >
              Beratung starten
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Termine */}
      <section className="vfr-section" id="termine">
        <div className="vfr-wrap">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div>
              <span className="vfr-eyebrow">Nächste Starttermine</span>
              <h2 className="vfr-h2 mt-2">Platz sichern.</h2>
            </div>
            <Link
              href="/termine-preise"
              className="vfr-btn vfr-btn--ghost"
              style={{ paddingBlock: 12, paddingInline: 20 }}
            >
              Alle Termine ansehen →
            </Link>
          </div>

          {ausbildungen.length === 0 ? (
            <p style={{ color: "var(--vfr-fg-muted)" }}>
              Aktuell keine Ausbildungstermine verfügbar. Ruf uns gerne an —
              wir informieren dich, sobald neue Termine stehen.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ausbildungen.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
