import type { CourseCategory } from "@/lib/flario";

/**
 * Virtuelle Oberkategorien für die Kurse-Filterung auf /termine-preise.
 * Jede Oberkategorie bündelt eine oder mehrere echte CourseCategory-Werte.
 */
export const SUPER_CATS = {
  fahrlehrerausbildung: {
    label: "Fahrlehrerausbildung",
    cats: ["ausbildung-be", "ausbildung-a", "ausbildung-ce", "ausbildung-de"] as CourseCategory[],
  },
  fahrlehrerfortbildung: {
    label: "Fahrlehrerfortbildung",
    cats: ["fortbildung"] as CourseCategory[],
  },
  fahrlehrerweiterbildung: {
    label: "Fahrlehrerweiterbildung",
    cats: ["weiterbildung"] as CourseCategory[],
  },
} as const;

export type SuperCatKey = keyof typeof SUPER_CATS;

export type CourseGroup = "fahrlehrer" | "bkf" | "blaulicht";

export const GROUP_CATEGORIES: Record<CourseGroup, CourseCategory[]> = {
  fahrlehrer: [
    "ausbildung-be",
    "ausbildung-a",
    "ausbildung-ce",
    "ausbildung-de",
    "fortbildung",
    "weiterbildung",
    "info-veranstaltung",
  ],
  bkf: ["ladekran", "flurfoerderzeuge"],
  blaulicht: [],
};
