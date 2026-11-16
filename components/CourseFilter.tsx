"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, type CourseCategory } from "@/lib/flario";
import { SUPER_CATS, type CourseGroup as Group } from "@/lib/course-groups";
import { X, GraduationCap, Truck, Siren } from "lucide-react";

/** Für Fahrlehrerausbildung: Klassen-Themen aus der Kategorie ableiten */
const AUSBILDUNG_KLASSEN: { key: string; cat: CourseCategory }[] = [
  { key: "BE", cat: "ausbildung-be" },
  { key: "A", cat: "ausbildung-a" },
  { key: "CE", cat: "ausbildung-ce" },
  { key: "DE", cat: "ausbildung-de" },
];

type Props = {
  /** Für die Fahrlehrer-Gruppe entweder SuperCatKey oder "info-veranstaltung"; für BKF eine echte CourseCategory. */
  activeCatKey?: string;
  activeGroup?: Group;
  years: number[];
  topics: string[];
  activeYear?: string;
  activeHalf?: string;
  activeTopic?: string;
  countsByGroup: Record<Group, number>;
};

const GROUP_META: Record<
  Group,
  { label: string; sub: string; icon: typeof GraduationCap }
> = {
  fahrlehrer: {
    label: "Fahrlehrer",
    sub: "Ausbildung · Fortbildung · Info",
    icon: GraduationCap,
  },
  bkf: {
    label: "Berufskraftfahrer",
    sub: "Ladekran · Flurförderzeuge",
    icon: Truck,
  },
  blaulicht: {
    label: "Blaulicht",
    sub: "Feuerwehr · Einsatzfahrten",
    icon: Siren,
  },
};

const HALF_FILTERS = [
  { value: "", label: "Ganzes Jahr" },
  { value: "h1", label: "Jan – Jun" },
  { value: "h2", label: "Jul – Dez" },
];

export function CourseFilter({
  activeCatKey,
  activeGroup,
  years,
  topics,
  activeYear,
  activeHalf,
  activeTopic,
  countsByGroup,
}: Props) {
  const params = useSearchParams();

  const hrefWith = (updates: Record<string, string | null>): string => {
    const next = new URLSearchParams(params?.toString() ?? "");
    for (const [key, value] of Object.entries(updates)) {
      if (!value) next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    return `/termine-preise${qs ? `?${qs}` : ""}`;
  };

  const hasAny = !!(
    activeCatKey ||
    activeGroup ||
    activeYear ||
    activeHalf ||
    activeTopic
  );

  // Welche Chips die Kurs-Zeile zeigt
  const catChips: { key: string; label: string }[] = (() => {
    if (activeGroup === "fahrlehrer" || !activeGroup) {
      return [
        { key: "fahrlehrerausbildung", label: SUPER_CATS.fahrlehrerausbildung.label },
        { key: "fahrlehrerfortbildung", label: SUPER_CATS.fahrlehrerfortbildung.label },
        { key: "fahrlehrerweiterbildung", label: SUPER_CATS.fahrlehrerweiterbildung.label },
        { key: "info-veranstaltung", label: "Info-Veranstaltung" },
        ...(!activeGroup
          ? [
              { key: "ladekran", label: CATEGORY_LABEL.ladekran },
              { key: "flurfoerderzeuge", label: CATEGORY_LABEL.flurfoerderzeuge },
            ]
          : []),
      ];
    }
    if (activeGroup === "bkf") {
      return [
        { key: "ladekran", label: CATEGORY_LABEL.ladekran },
        { key: "flurfoerderzeuge", label: CATEGORY_LABEL.flurfoerderzeuge },
      ];
    }
    return [];
  })();

  // Themen-Zeile: bei Fahrlehrerausbildung → Klassen BE/A/CE/DE; sonst extrahierte Topics
  const topicChips: { value: string; label: string }[] = (() => {
    if (activeCatKey === "fahrlehrerausbildung") {
      return AUSBILDUNG_KLASSEN.map((k) => ({ value: k.key, label: k.key }));
    }
    if (
      activeCatKey === "fahrlehrerfortbildung" ||
      activeCatKey === "fahrlehrerweiterbildung"
    ) {
      return topics.map((t) => ({ value: t, label: t }));
    }
    return [];
  })();

  return (
    <div className="space-y-6">
      {/* Zielgruppen-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(GROUP_META) as Group[]).map((g) => {
          const meta = GROUP_META[g];
          const Icon = meta.icon;
          const isActive = activeGroup === g;
          const count = countsByGroup[g];
          const href = hrefWith({
            gruppe: isActive ? null : g,
            cat: null,
            topic: null,
          });
          return (
            <Link
              key={g}
              href={href}
              scroll={false}
              className={cn(
                "group relative no-underline rounded-xl p-5 transition-colors flex flex-col justify-between min-h-[120px]",
                isActive
                  ? "bg-[var(--vfr-accent)] text-white"
                  : "bg-[var(--vfr-card)] border border-[var(--vfr-rule)] text-[var(--vfr-fg)] hover:border-[var(--vfr-accent)]",
              )}
            >
              <Icon
                className="h-7 w-7"
                style={{
                  color: isActive ? "#fff" : "var(--vfr-fg-muted)",
                  opacity: isActive ? 0.95 : 1,
                }}
              />
              <div className="mt-3">
                <div
                  className="font-[family-name:var(--font-serif)]"
                  style={{ fontSize: 20, lineHeight: 1.2 }}
                >
                  {meta.label}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontSize: 12,
                    color: isActive ? "rgba(255,255,255,0.85)" : "var(--vfr-fg-muted)",
                  }}
                >
                  {meta.sub}
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontSize: 11,
                    color: isActive ? "rgba(255,255,255,0.7)" : "var(--vfr-fg-soft)",
                  }}
                >
                  {count > 0
                    ? `${count} ${count === 1 ? "Kurs" : "Kurse"}`
                    : g === "blaulicht"
                      ? "siehe Feuerwehr-Seite"
                      : "0 Kurse"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Blaulicht-Gruppe gewählt → Hinweis */}
      {activeGroup === "blaulicht" && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--vfr-bg-alt)",
            border: "1px solid var(--vfr-rule)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 17,
              color: "var(--vfr-fg)",
              marginBottom: 4,
            }}
          >
            Feuerwehr-Lehrgänge laufen separat.
          </div>
          <p
            className="m-0"
            style={{ fontSize: 14, color: "var(--vfr-fg-muted)" }}
          >
            Fahrerlaubnis C/CE für Feuerwehren, Einweisungen am Einsatzfahrzeug
            und Geländetraining findest du auf der{" "}
            <Link
              href="/feuerwehr"
              className="underline"
              style={{ color: "var(--vfr-accent-dark)" }}
            >
              Feuerwehr-Seite
            </Link>
            .
          </p>
        </div>
      )}

      {/* Zeile 2: Jahr + Zeitraum */}
      {activeGroup !== "blaulicht" && (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={hrefWith({ year: null })}
            scroll={false}
            className={chipSmall(!activeYear)}
          >
            Alle Jahre
          </Link>
          {years.map((y) => (
            <Link
              key={y}
              href={hrefWith({ year: String(y) })}
              scroll={false}
              className={chipSmall(activeYear === String(y))}
            >
              {y}
            </Link>
          ))}
          <span
            aria-hidden="true"
            style={{
              width: 1,
              height: 20,
              background: "var(--vfr-rule)",
              margin: "0 6px",
            }}
          />
          {HALF_FILTERS.map((h) => (
            <Link
              key={h.value || "all"}
              href={hrefWith({ half: h.value || null })}
              scroll={false}
              className={chipSmall((activeHalf ?? "") === h.value)}
            >
              {h.label}
            </Link>
          ))}
        </div>
      )}

      {/* Zeile 3: Kurs-Oberkategorien */}
      {activeGroup !== "blaulicht" && catChips.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={hrefWith({ cat: null, topic: null })}
            scroll={false}
            className={chipSmall(!activeCatKey)}
          >
            Alle Kurse
          </Link>
          {catChips.map((c) => (
            <Link
              key={c.key}
              href={hrefWith({ cat: c.key, topic: null })}
              scroll={false}
              className={chipSmall(activeCatKey === c.key)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}

      {/* Zeile 4: Themen innerhalb Oberkategorie */}
      {topicChips.length > 0 && activeGroup !== "blaulicht" && (
        <div className="flex flex-wrap gap-2 items-center">
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--vfr-fg-muted)",
              marginRight: 4,
            }}
          >
            {activeCatKey === "fahrlehrerausbildung" ? "Klasse" : "Thema"}
          </span>
          <Link
            href={hrefWith({ topic: null })}
            scroll={false}
            className={chipSmall(!activeTopic)}
          >
            Alle
          </Link>
          {topicChips.map((t) => (
            <Link
              key={t.value}
              href={hrefWith({ topic: t.value })}
              scroll={false}
              className={chipSmall(activeTopic === t.value)}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}

      {hasAny && (
        <div>
          <Link
            href="/termine-preise"
            scroll={false}
            className="inline-flex items-center gap-1.5 text-[0.85rem] text-[var(--vfr-accent-dark)] hover:underline no-underline"
          >
            <X className="h-3.5 w-3.5" />
            Filter zurücksetzen
          </Link>
        </div>
      )}
    </div>
  );
}

function chipSmall(isActive: boolean) {
  return cn(
    "inline-flex items-center px-3 py-1.5 text-[0.8rem] font-medium no-underline rounded-md border transition",
    isActive
      ? "bg-[var(--vfr-accent)] text-white border-[var(--vfr-accent)]"
      : "bg-[var(--vfr-card)] text-[var(--vfr-fg)] border-[var(--vfr-rule)] hover:border-[var(--vfr-accent)]",
  );
}
