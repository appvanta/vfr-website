import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Team & Dozenten",
  description:
    "Das Team der VFR Verkehrsfachschule Rheinland. Gegründet 2010, inhabergeführt von Andreas Hombach. Erfahrene Dozentinnen, Praxistrainer und Verwaltungsteam in Niederkassel.",
  alternates: { canonical: "/team" },
};

const roles = [
  { img: IMG.portraitWoman, name: "Pädagogische Leitung", role: "Didaktik & Curriculum" },
  { img: IMG.portraitMan2, name: "Dozent:in Recht", role: "Verkehrs- und Fahrlehrerrecht" },
  { img: IMG.portraitWoman2, name: "Dozent:in Pädagogik", role: "Lehr- und Lernmethodik" },
  { img: IMG.portraitMan, name: "Praxistrainer:in BE", role: "PKW & Anhänger" },
  { img: IMG.portraitMan2, name: "Praxistrainer:in CE", role: "LKW & Sattelzug" },
  { img: IMG.portraitWoman, name: "Praxistrainer:in A", role: "Motorrad" },
  { img: IMG.portraitWoman2, name: "Verwaltung & Beratung", role: "Bildungsgutschein & Förderung" },
];

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Über uns · Team"
        image={IMG.team}
        title="Die Menschen hinter der VFR."
        lead="Seit 2010 bilden wir Fahrlehrerinnen und Fahrlehrer in Niederkassel aus — inhabergeführt und mit einem Team, das zupackt statt verwaltet."
        breadcrumbs={[{ label: "Über uns", href: "/team" }]}
      />

      {/* Geschäftsführer — Andreas Hombach */}
      <section className="vfr-section">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Inhaber & Geschäftsführer</span>
          <h2 className="vfr-h2 mt-3">Andreas Hombach.</h2>

          <div className="mt-10 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start">
            {/* Portrait-Platzhalter */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--vfr-bg-alt)] border border-[var(--vfr-rule)] rounded-sm max-w-[380px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <svg
                  className="h-20 w-20 text-[var(--vfr-fg-soft)]/40 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div className="text-[0.82rem] text-[var(--vfr-fg-soft)]">
                  Foto folgt
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-5 text-[1.02rem] text-[var(--vfr-fg)] leading-relaxed">
                <p className="m-0">
                  Die <strong>VFR Verkehrsfachschule Rheinland GmbH</strong>{" "}
                  wurde <strong>2010 gegründet</strong> — mitten im Rheinland
                  zwischen Köln und Bonn, zunächst mit Fahrlehrer- und{" "}
                  <strong>Berufskraftfahrer-Ausbildung</strong>. Heute liegt
                  unser klarer Fokus darauf, Menschen auf dem Weg zum
                  Fahrlehrerberuf zu begleiten.
                </p>
                <p className="m-0">
                  <strong>Andreas Hombach</strong> übernahm noch im Gründungsjahr
                  die Geschäftsführung und führt die VFR seit <strong>2010</strong>.
                  Seit <strong>2017</strong> ist er zudem{" "}
                  <strong>alleiniger Gesellschafter (100&nbsp;%)</strong> —
                  inhabergeführt und unabhängig. Kurze Entscheidungswege,
                  persönlicher Kontakt zu jedem Teilnehmer und Blick auf das,
                  was Fahrlehrer wirklich brauchen — das sind seine Prinzipien.
                </p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="bg-[var(--vfr-bg-alt)] p-5 border border-[var(--vfr-rule)] rounded-sm">
                  <div className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-muted)] font-semibold">
                    Seit 2010
                  </div>
                  <div className="mt-1 text-[1.05rem] font-semibold text-[var(--vfr-fg)]">
                    Geschäftsführer
                  </div>
                  <div className="text-[0.85rem] text-[var(--vfr-fg-muted)] mt-1">
                    über 15 Jahre
                  </div>
                </div>
                <div className="bg-[var(--vfr-bg-alt)] p-5 border border-[var(--vfr-rule)] rounded-sm">
                  <div className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--vfr-fg-muted)] font-semibold">
                    Seit 2017
                  </div>
                  <div className="mt-1 text-[1.05rem] font-semibold text-[var(--vfr-fg)]">
                    Alleiniger Gesellschafter
                  </div>
                  <div className="text-[0.85rem] text-[var(--vfr-fg-muted)] mt-1">
                    100 % der Anteile
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/beratung"
                  className="bg-[var(--vfr-accent)] text-white px-5 py-2.5 rounded-[2px] font-semibold text-[0.9rem] hover:bg-[var(--vfr-accent-dark)] transition no-underline"
                >
                  Beratungstermin mit mir
                </a>
                <a
                  href="mailto:ah@vfr-gmbh.de"
                  className="border border-[var(--vfr-rule)] text-[var(--vfr-fg)] px-5 py-2.5 rounded-[2px] font-semibold text-[0.9rem] hover:border-[var(--vfr-accent)] hover:text-[var(--vfr-accent)] transition no-underline"
                >
                  Direkt per Mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weiteres Team */}
      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap">
          <span className="vfr-eyebrow">Unser Team</span>
          <h2 className="vfr-h2 mt-3">Dozierende, Trainer, Verwaltung.</h2>
          <p className="text-[var(--vfr-fg-muted)] mt-3 max-w-[60ch]">
            Hinter der Ausbildung steht ein eingespieltes Team aus
            Juristinnen, Pädagogen, Praxistrainern für PKW, LKW und Motorrad
            sowie der Verwaltung, die sich um Förderanträge und
            Bildungsgutscheine kümmert.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {roles.map((p, i) => (
              <article key={p.name + i} className="group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-5">
                  <div
                    className="text-[var(--vfr-accent)]"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {p.role}
                  </div>
                  <h3
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 22,
                      fontWeight: 400,
                      color: "var(--vfr-fg)",
                      lineHeight: 1.2,
                      margin: "8px 0 0",
                    }}
                  >
                    {p.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-[0.9rem] text-[var(--vfr-fg-soft)] text-center max-w-[55ch] mx-auto">
            Wir stellen hier bald unsere konkreten Personen mit Foto und
            Biografie vor. Lern das Team persönlich auf einer{" "}
            <a
              href="/info-veranstaltungen"
              className="text-[var(--vfr-accent-dark)] underline underline-offset-2"
            >
              Info-Veranstaltung
            </a>{" "}
            kennen.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
