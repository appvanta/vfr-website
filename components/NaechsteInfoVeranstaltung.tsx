import Link from "next/link";
import { CalendarCheck, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { listCourses } from "@/lib/flario";
import { formatDate } from "@/lib/utils";

/**
 * Highlight-Card: nächste kostenlose Info-Veranstaltung mit Datum +
 * Vormerken-Möglichkeit. Zieht die Daten aus Flario (Kategorie
 * „info-veranstaltung") und zeigt die frühestkommende buchbare an.
 */
export async function NaechsteInfoVeranstaltung() {
  const infos = await listCourses({
    category: "info-veranstaltung",
    onlyBookable: true,
  });
  const next = infos[0];
  if (!next) return null;

  const dateLabel = formatDate(next.startDate);
  const timeLabel = new Date(next.startDate).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="vfr-section" style={{ paddingBlock: "48px" }}>
      <div className="vfr-wrap">
        <div
          className="relative overflow-hidden rounded-sm p-6 sm:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center"
          style={{
            background:
              "linear-gradient(135deg, var(--vfr-accent) 0%, var(--vfr-accent-dark) 100%)",
            color: "white",
          }}
        >
          {/* dekorativer Kreis rechts oben */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.12em] font-semibold opacity-90 mb-2">
              <CalendarCheck className="h-3.5 w-3.5" />
              Kostenlos & unverbindlich
            </div>
            <h3 className="font-semibold text-[1.4rem] sm:text-[1.6rem] leading-tight m-0">
              Nächste Info-Veranstaltung: {dateLabel}
            </h3>
            <p className="mt-3 text-white/85 text-[0.95rem] leading-relaxed max-w-[52ch] m-0">
              Lern uns, das Team und die Räumlichkeiten kennen. Wir beantworten
              deine Fragen zu Ausbildung, Förderung und Ablauf — in entspannter
              Atmosphäre, bei Kaffee und ohne Verpflichtung.
            </p>

            <div className="mt-5 flex flex-wrap gap-5 text-[0.88rem]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 opacity-80" />
                {timeLabel} Uhr
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 opacity-80" />
                {next.location}
              </span>
            </div>
          </div>

          {/* CTA-Buttons */}
          <div className="relative z-10 flex flex-col gap-3 lg:min-w-[260px]">
            <Link
              href={`/buchung/${next.id}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--vfr-accent)] font-bold px-5 py-3.5 rounded-sm hover:bg-white/95 transition no-underline"
            >
              Platz vormerken
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/info-veranstaltungen"
              className="inline-flex items-center justify-center gap-1 text-white/90 hover:text-white text-[0.88rem] font-medium no-underline underline-offset-2 hover:underline"
            >
              Alle nächsten Termine →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
