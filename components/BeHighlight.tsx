import Link from "next/link";
import {
  Car,
  Clock,
  Euro,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { listCourses } from "@/lib/flario";
import { formatEUR } from "@/lib/utils";

const features = [
  "AZAV-zertifiziert · Bildungsgutschein akzeptiert",
  "Persönliche Betreuung — von der Beratung bis zur Erteilung der Fahrlehrerlaubnis",
  "Über 15 Jahre Erfahrung — wir bereiten dich bestens auf Beruf und Prüfungen vor",
  "Kostenloses Dienstags-Repetitorium — 90 Minuten extra",
  "2 Wochen intensive Prüfungsvorbereitung vor der Fachkunde",
];

export async function BeHighlight() {
  // Preis dynamisch aus Flario: nächster buchbarer BE-Kurs.
  const beCourses = await listCourses({
    category: "ausbildung-be",
    onlyBookable: true,
  });
  const bePrice = beCourses[0]?.priceCents;
  const priceLabel = bePrice ? formatEUR(bePrice) : "auf Anfrage";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--vfr-bg) 0%, var(--vfr-bg-alt) 100%)",
        paddingBlock: "80px",
        borderBottom: "1px solid var(--vfr-rule)",
      }}
    >
      <div className="vfr-wrap">
        {/* Header */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--vfr-accent)]/10 text-[var(--vfr-accent)] text-[0.75rem] font-bold uppercase tracking-wider mb-5">
              <Car className="h-3.5 w-3.5" />
              Unser Hauptangebot · Klasse BE
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4.2vw, 48px)",
                fontWeight: 300,
                fontFamily: "var(--font-serif), Georgia, serif",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--vfr-fg)",
                margin: 0,
              }}
            >
              Du willst Fahrlehrer:in werden?
            </h2>
            <p
              className="mt-5"
              style={{
                fontSize: 18,
                color: "var(--vfr-fg-muted)",
                lineHeight: 1.6,
                maxWidth: "58ch",
              }}
            >
              Die <strong>Fahrlehrerausbildung Klasse BE</strong> ist die
              Grundausbildung für den Beruf — und bei uns in Niederkassel in
              rund <strong>12 Monaten</strong> erreichbar. Vollzeit, praxisnah,
              mit Bildungsgutschein förderfähig.
            </p>

            {/* Features */}
            <ul className="list-none p-0 m-0 mt-6 space-y-2.5">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[0.95rem] text-[var(--vfr-fg)]"
                >
                  <CheckCircle2 className="h-4 w-4 text-[var(--vfr-accent)] shrink-0 mt-1" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/fahrlehrerausbildung/be"
                className="inline-flex items-center gap-2 bg-[var(--vfr-accent)] text-white font-bold px-6 py-3.5 rounded-sm hover:bg-[var(--vfr-accent-dark)] transition no-underline"
              >
                Zur BE-Ausbildung
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/beratung"
                className="inline-flex items-center gap-2 bg-white text-[var(--vfr-fg)] border-2 border-[var(--vfr-fg)] font-semibold px-6 py-3 rounded-sm hover:bg-[var(--vfr-fg)] hover:text-white transition no-underline"
              >
                Kostenlose Beratung
              </Link>
            </div>
          </div>

          {/* Eck-Zahlen rechts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[var(--vfr-rule)] p-5 rounded-sm">
              <Clock className="h-5 w-5 text-[var(--vfr-accent)] mb-2" />
              <div className="text-[0.72rem] uppercase tracking-wider text-[var(--vfr-fg-muted)] font-semibold">
                Dauer
              </div>
              <div className="text-[1.5rem] font-bold text-[var(--vfr-fg)] leading-tight">
                12 Monate
              </div>
              <div className="text-[0.82rem] text-[var(--vfr-fg-muted)] mt-1">
                Vollzeit
              </div>
            </div>
            <div className="bg-white border border-[var(--vfr-rule)] p-5 rounded-sm">
              <Euro className="h-5 w-5 text-[var(--vfr-accent)] mb-2" />
              <div className="text-[0.72rem] uppercase tracking-wider text-[var(--vfr-fg-muted)] font-semibold">
                Kosten
              </div>
              <div className="text-[1.5rem] font-bold text-[var(--vfr-fg)] leading-tight tabular-nums">
                {priceLabel}
              </div>
              <div className="text-[0.82rem] text-[var(--vfr-fg-muted)] mt-1">
                förderfähig
              </div>
            </div>
            <div className="col-span-2 bg-[var(--vfr-accent)] text-white p-5 rounded-sm">
              <GraduationCap className="h-5 w-5 mb-2 opacity-90" />
              <div className="text-[0.72rem] uppercase tracking-wider opacity-85 font-semibold">
                Kennenlernen
              </div>
              <div className="text-[1.3rem] font-bold leading-tight">
                Kostenlose Info-Veranstaltungen nach Termin
              </div>
              <Link
                href="/info-veranstaltungen"
                className="inline-flex items-center gap-1 mt-2 text-white text-[0.88rem] font-semibold no-underline underline-offset-4 hover:underline"
              >
                Nächsten Termin ansehen →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
