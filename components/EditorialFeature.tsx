import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Editorial split: large image / description text – wie bei Dahler die "Featured Property".
 */
export function EditorialFeature() {
  return (
    <section className="section">
      <div className="container-vfr">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="img-zoom overflow-hidden bg-ink-100">
              <div className="aspect-[4/5] md:aspect-[4/3] bg-gradient-to-br from-cream-300 via-cream-100 to-ink-200 grain grid place-items-center">
                <span className="font-display italic text-2xl md:text-3xl text-ink-500/50 font-light">
                  [Bild: Theorie-Saal / Praxis-Fahrzeug]
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <span className="eyebrow">— Im Fokus</span>
            <h2 className="mt-6 display-section max-w-[14ch]">
              Eine Schule für{" "}
              <span className="italic font-light text-vfr-500">Menschen</span>,
              die etwas bewegen wollen.
            </h2>
            <p className="mt-8 text-ink-700 font-light leading-relaxed text-lg max-w-[50ch]">
              Bei der Verkehrsfachschule Rheinland verstehen wir Ausbildung als
              Handwerk. Wir bilden in kleinen Gruppen aus, mit Dozent:innen, die
              aus der Praxis kommen — und mit dem klaren Ziel, dass Sie nach
              Ihrem Abschluss souverän und sicher in den Beruf starten.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8">
              {[
                { v: "12", l: "Monate Lehrgang" },
                { v: "16", l: "Plätze pro Kurs" },
                { v: "100%", l: "Förderquote möglich" },
                { v: "Ø 4,9", l: "Bewertungen" },
              ].map((s) => (
                <div key={s.l} className="border-t border-vfr-500 pt-4">
                  <dt className="font-display font-extralight text-4xl text-vfr-500 tabular-nums">{s.v}</dt>
                  <dd className="mt-2 eyebrow text-ink-500 [&::before]:hidden">{s.l}</dd>
                </div>
              ))}
            </dl>

            <Link href="/fahrlehrerausbildung" className="mt-12 inline-flex items-center gap-2 link-line">
              Über die Ausbildung
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
