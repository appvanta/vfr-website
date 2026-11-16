import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listCourses } from "@/lib/flario";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/fahrlehrerausbildung`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/fahrlehrerausbildung/be`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/fahrlehrerausbildung/a`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/fahrlehrerausbildung/ce`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/fahrlehrerausbildung/de`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/fahrlehrerfortbildung`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/fahrlehrerweiterbildung`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/feuerwehr`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/termine-preise`, lastModified: now, priority: 0.9, changeFrequency: "daily" },
    { url: `${base}/foerderung`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/beratung`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/team`, lastModified: now, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/kontakt`, lastModified: now, priority: 0.6, changeFrequency: "yearly" },
    { url: `${base}/impressionen`, lastModified: now, priority: 0.4, changeFrequency: "monthly" },
    { url: `${base}/info-veranstaltungen`, lastModified: now, priority: 0.6, changeFrequency: "weekly" },
    { url: `${base}/stellenboerse`, lastModified: now, priority: 0.5, changeFrequency: "weekly" },
    { url: `${base}/downloads`, lastModified: now, priority: 0.4, changeFrequency: "yearly" },
    { url: `${base}/gerichtsurteile`, lastModified: now, priority: 0.3, changeFrequency: "monthly" },
    { url: `${base}/service`, lastModified: now, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/impressum`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/datenschutz`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/agb`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/widerruf`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
  ];

  // Dynamische Kurs-Buchungsseiten
  try {
    const courses = await listCourses({ onlyBookable: true });
    const courseEntries = courses.map((c) => ({
      url: `${base}/buchung/${c.id}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    }));
    return [...staticPaths, ...courseEntries];
  } catch {
    return staticPaths;
  }
}
