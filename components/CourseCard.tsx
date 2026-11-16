import Link from "next/link";
import Image from "next/image";
import { type Course, type CourseCategory, CATEGORY_LABEL } from "@/lib/flario";
import { formatDate, formatEUR } from "@/lib/utils";

// Gesetzlich vorgeschriebene Praxis-UE je Ausbildungsklasse — im Preis enthalten.
const PRAXIS_UE: Partial<Record<CourseCategory, number>> = {
  "ausbildung-be": 30,
  "ausbildung-a": 18,
  "ausbildung-ce": 22,
  "ausbildung-de": 22,
};

const CATEGORY_IMAGE: Record<string, string> = {
  "ausbildung-be": "/be/be-fahrsicherheit.jpg",
  "ausbildung-a": "/a/a-motorrad-uebungsplatz.jpg",
  "ausbildung-ce": "/ce/ce-lkw-flotte.jpg",
  "ausbildung-de": "/de/de-praxis.jpg",
  fortbildung: "/be/be-theorie.jpg",
  weiterbildung: "/be/be-theorie.jpg",
  "info-veranstaltung": "/hero/hero-vfr-flaggen.jpg",
};

export function CourseCard({ course }: { course: Course }) {
  const soldOut = course.seatsAvailable <= 0;
  const image = CATEGORY_IMAGE[course.category] ?? CATEGORY_IMAGE["ausbildung-be"];

  return (
    <Link
      href={soldOut ? "/kontakt#rueckruf" : `/buchung/${course.id}`}
      className="group block transition hover:-translate-y-1 no-underline"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
        />
        <div
          className="absolute inset-0 transition"
          style={{ background: "rgba(0,0,0,0)" }}
        />
        {course.fundingEligible && (
          <span
            className="absolute top-4 left-4 bg-[var(--vfr-accent)] text-white px-3.5 py-1.5 z-10"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Förderbar
          </span>
        )}
      </div>

      <div className="pt-6 px-1">
        <div
          className="text-[var(--vfr-accent)]"
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {CATEGORY_LABEL[course.category]}
        </div>
        <h3
          className="mt-2.5"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: 26,
            fontWeight: 400,
            lineHeight: 1.2,
            color: "var(--vfr-fg)",
            margin: "10px 0 14px",
          }}
        >
          {course.title}
        </h3>
        <div className="text-[14px] text-[var(--vfr-fg-muted)] font-light mb-4">
          <span>{formatDate(course.startDate)}</span>
          <span className="mx-2">·</span>
          <span>{course.location}</span>
          {soldOut && (
            <>
              <span className="mx-2">·</span>
              <span className="text-[#b84b2a] font-semibold">Ausgebucht</span>
            </>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--vfr-fg)",
          }}
        >
          {course.priceCents === 0 ? "Preis auf Anfrage" : formatEUR(course.priceCents)}
        </div>
        {PRAXIS_UE[course.category] !== undefined && (
          <div
            className="mt-1 text-[0.8rem] text-[var(--vfr-fg-muted)]"
            style={{ letterSpacing: "0.01em" }}
          >
            inkl. <strong className="text-[var(--vfr-fg)]">{PRAXIS_UE[course.category]} UE</strong>{" "}
            Praxis — keine Zusatzkosten
          </div>
        )}
      </div>
    </Link>
  );
}
