import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CourseList } from "@/components/CourseList";
import { CourseFilter } from "@/components/CourseFilter";
import { CTASection } from "@/components/CTASection";
import { listCourses, type CourseCategory, type Course } from "@/lib/flario";
import {
  SUPER_CATS,
  GROUP_CATEGORIES,
  type SuperCatKey,
  type CourseGroup,
} from "@/lib/course-groups";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Termine & Preise",
  description:
    "Aktuelle Termine und Preise für Ausbildung, Fortbildung und Weiterbildung bei VFR. Direkt aus unserem Kursverwaltungssystem.",
  alternates: { canonical: "/termine-preise" },
};

type Group = CourseGroup;

type SearchParams = Promise<{
  gruppe?: string;
  cat?: string;
  year?: string;
  half?: string;
  topic?: string;
}>;

/** Extrahiert das Thema aus dem Titel — nimmt den Anteil vor dem ersten „—" (em-dash) */
function extractTopic(course: Course): string {
  const dashIdx = course.title.indexOf("—");
  if (dashIdx > 0) return course.title.slice(0, dashIdx).trim();
  return course.title.trim();
}

/** Expandiert einen Oberkategorie-Key zu echten CourseCategory-Werten. */
function expandCat(catKey: string): CourseCategory[] | null {
  if (catKey in SUPER_CATS) {
    return [...SUPER_CATS[catKey as SuperCatKey].cats];
  }
  // Direkte CourseCategory (z.B. "info-veranstaltung", "ladekran", "flurfoerderzeuge")
  const direct = catKey as CourseCategory;
  if (
    [
      "ausbildung-be",
      "ausbildung-a",
      "ausbildung-ce",
      "ausbildung-de",
      "fortbildung",
      "weiterbildung",
      "ladekran",
      "flurfoerderzeuge",
      "info-veranstaltung",
    ].includes(direct)
  ) {
    return [direct];
  }
  return null;
}

/** Welche Gruppe gehört zu einem Katagorie-Key (implizit)? */
function catKeyToGroup(catKey: string): Group | undefined {
  if (
    catKey === "fahrlehrerausbildung" ||
    catKey === "fahrlehrerfortbildung" ||
    catKey === "fahrlehrerweiterbildung" ||
    catKey === "info-veranstaltung"
  ) {
    return "fahrlehrer";
  }
  if (catKey === "ladekran" || catKey === "flurfoerderzeuge") return "bkf";
  return undefined;
}

export default async function TerminePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { gruppe, cat, year, half, topic } = await searchParams;
  const group = (gruppe as Group | undefined) ?? undefined;
  const catKey = cat ?? undefined;

  const allCourses = await listCourses({ onlyBookable: false });

  // Kursanzahl je Zielgruppe für die Landing-Cards
  const countsByGroup: Record<Group, number> = {
    fahrlehrer: allCourses.filter((c) =>
      GROUP_CATEGORIES.fahrlehrer.includes(c.category),
    ).length,
    bkf: allCourses.filter((c) => GROUP_CATEGORIES.bkf.includes(c.category))
      .length,
    blaulicht: 0,
  };

  // 1) Gruppenfilter
  let scoped = allCourses;
  if (group && group !== "blaulicht") {
    scoped = scoped.filter((c) =>
      GROUP_CATEGORIES[group].includes(c.category),
    );
  }
  if (group === "blaulicht") {
    scoped = [];
  }

  // 2) Oberkategorie-Filter
  if (catKey) {
    const expanded = expandCat(catKey);
    if (expanded) {
      scoped = scoped.filter((c) => expanded.includes(c.category));
    }
  }

  // Dynamische Topic-Liste für die Themen-Zeile (nur relevant bei Fort-/Weiterbildung)
  const topics = Array.from(new Set(scoped.map(extractTopic))).sort();

  // Dynamische Jahr-Liste
  const years = Array.from(
    new Set(scoped.map((c) => new Date(c.startDate).getFullYear())),
  ).sort();

  // 3) Topic / Klassen-Filter
  const scopedWithTopic = scoped.filter((c) => {
    if (!topic) return true;
    if (catKey === "fahrlehrerausbildung") {
      // topic ist "BE", "A", "CE", "DE" → match auf category
      const cat = `ausbildung-${topic.toLowerCase()}` as CourseCategory;
      return c.category === cat;
    }
    return extractTopic(c) === topic;
  });

  // 4) Jahr / Halbjahr
  const filtered = scopedWithTopic.filter((c) => {
    const d = new Date(c.startDate);
    if (year && String(d.getFullYear()) !== year) return false;
    if (half === "h1" && d.getMonth() >= 6) return false;
    if (half === "h2" && d.getMonth() < 6) return false;
    return true;
  });

  // Wenn cat gewählt, Gruppe implizit setzen
  const effectiveGroup: Group | undefined =
    group ?? (catKey ? catKeyToGroup(catKey) : undefined);

  return (
    <>
      <PageHero
        eyebrow="Termine & Preise"
        image={IMG.termine}
        slides={[
          { src: "/hero/hero-termine-flotte.jpg", alt: "VFR-Fahrzeugflotte mit SU-VR-Kennzeichen vor der Schule" },
          { src: "/hero/hero-termine-fahnen.jpg", alt: "VFR-Beachflags vor dem Fuhrpark" },
          { src: IMG.termine, alt: "Jahreskalender mit markierten Kursterminen" },
        ]}
        title="Alle Kurse, transparent."
        lead="Termine und Verfügbarkeiten kommen direkt aus unserem Kursverwaltungssystem. Wähle deinen Kurs, buche sicher online und erhalte die Rechnung automatisch per Mail."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          <CourseFilter
            activeCatKey={catKey}
            activeGroup={effectiveGroup}
            years={years}
            topics={topics}
            activeYear={year}
            activeHalf={half}
            activeTopic={topic}
            countsByGroup={countsByGroup}
          />

          {effectiveGroup !== "blaulicht" && (
            <div className="mt-6 text-[0.88rem] text-[var(--vfr-fg-muted)]">
              {filtered.length === 0
                ? "Keine Kurse für diese Auswahl."
                : `${filtered.length} ${filtered.length === 1 ? "Kurs" : "Kurse"} gefunden.`}
            </div>
          )}

          {effectiveGroup === "blaulicht" ? null : filtered.length === 0 ? (
            <div className="mt-6 bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-12 text-center">
              <p className="text-[var(--vfr-fg-muted)] m-0">
                Für die gewählten Filter sind aktuell keine Kurse verfügbar.
                Setze die Filter zurück oder trage dich in den Newsletter ein —
                neue Termine kündigen wir regelmäßig an.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <CourseList courses={filtered} />
            </div>
          )}
        </div>
      </section>

      <section className="vfr-section bg-[var(--vfr-bg-alt)]">
        <div className="vfr-wrap grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <span className="vfr-eyebrow">Zahlung & Rechnung</span>
            <h2 className="vfr-h2 mt-4">Buchen, zahlen, Rechnung erhalten.</h2>
            <p className="text-[var(--vfr-fg-muted)] mt-3">
              Buche sicher per <strong>PayPal</strong>,{" "}
              <strong>Kreditkarte</strong> oder{" "}
              <strong>SEPA-Lastschrift</strong>. Die Zahlung läuft über unseren
              PCI-DSS-zertifizierten Partner Stripe — deine Daten bleiben sicher.
              Direkt nach Zahlungseingang erhältst du automatisch deine Rechnung
              per E-Mail.
            </p>
          </div>
          <div>
            <span className="vfr-eyebrow">Bildungsgutschein</span>
            <h2 className="vfr-h2 mt-4">Du hast einen Gutschein?</h2>
            <p className="text-[var(--vfr-fg-muted)] mt-3">
              Buche wie gewohnt und schick uns den Bildungsgutschein zu — wir
              übernehmen die Abrechnung mit der zuständigen Stelle für dich.
              Alternativ kannst du auch vor der Buchung mit uns sprechen.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
