import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CourseCard } from "@/components/CourseCard";
import { CTASection } from "@/components/CTASection";
import { listCourses } from "@/lib/flario";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Info-Veranstaltungen",
  description:
    "Kostenlose Info-Veranstaltungen zum Kennenlernen der VFR — Räume, Team und Ausbildungsinhalte.",
  alternates: { canonical: "/info-veranstaltungen" },
};

export default async function InfoPage() {
  const events = await listCourses({
    category: "info-veranstaltung",
    onlyBookable: true,
  });

  return (
    <>
      <PageHero
        eyebrow="Info-Veranstaltungen"
        image={IMG.info}
        title="Lern uns persönlich kennen."
        lead="Bei unseren kostenlosen Info-Veranstaltungen zeigen wir dir Räume, Fahrzeuge und Team — und beantworten alle Fragen zu Ausbildung, Terminen und Förderung."
      />

      <section className="vfr-section">
        <div className="vfr-wrap">
          {events.length === 0 ? (
            <div className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-10 text-center">
              <p className="text-[var(--vfr-fg-muted)] m-0">
                Aktuell sind keine Info-Veranstaltungen geplant. Wir informieren
                dich gerne per Newsletter oder in einem kurzen Telefonat.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((c) => (
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
