import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Anmeldeformulare, Lehrpläne, Infoblätter rund um Fahrlehrerausbildung, Förderung und Verträge.",
  alternates: { canonical: "/downloads" },
};

type Doc = { title: string; desc: string; file: string; size?: string };

const docs: { group: string; items: Doc[] }[] = [
  {
    group: "Anmeldung & Bewerbung",
    items: [
      {
        title: "Anmeldeformular Fahrlehrerausbildung",
        desc: "Anmeldung zum nächsten Lehrgang.",
        file: "/downloads/anmeldung-ausbildung.pdf",
        size: "320 KB",
      },
      {
        title: "Anmeldeformular Fortbildung",
        desc: "Pflichtfortbildung nach § 53 FahrlG.",
        file: "/downloads/anmeldung-fortbildung.pdf",
        size: "280 KB",
      },
    ],
  },
  {
    group: "Förderung & Finanzierung",
    items: [
      {
        title: "Infoblatt Bildungsgutschein",
        desc: "Hinweise zur Beantragung und Einlösung.",
        file: "/downloads/bildungsgutschein-info.pdf",
        size: "640 KB",
      },
      {
        title: "Checkliste Förderantrag",
        desc: "Welche Unterlagen gebraucht werden.",
        file: "/downloads/checkliste-foerderung.pdf",
        size: "180 KB",
      },
    ],
  },
  {
    group: "Lehrgangsinhalte",
    items: [
      {
        title: "Lehrgangsübersicht Klasse BE",
        desc: "Detaillierter Lehrplan.",
        file: "/downloads/lehrplan-be.pdf",
        size: "1.2 MB",
      },
      {
        title: "Lehrgangsübersicht Klasse A",
        desc: "Inhalte und Praxistermine.",
        file: "/downloads/lehrplan-a.pdf",
        size: "900 KB",
      },
      {
        title: "Lehrgangsübersicht Klasse CE/DE",
        desc: "LKW und Bus.",
        file: "/downloads/lehrplan-ce-de.pdf",
        size: "1.4 MB",
      },
    ],
  },
  {
    group: "Rechtliches",
    items: [
      {
        title: "AGB der VFR",
        desc: "Allgemeine Geschäftsbedingungen.",
        file: "/downloads/agb.pdf",
        size: "120 KB",
      },
      {
        title: "Widerrufsbelehrung",
        desc: "14-tägiges Widerrufsrecht.",
        file: "/downloads/widerruf.pdf",
        size: "80 KB",
      },
    ],
  },
];

export default function DownloadsPage() {
  return (
    <>
      <PageHero
        eyebrow="Downloads"
        image={IMG.downloads}
        title="Alle Unterlagen auf einen Blick."
        lead="Anmeldungen, Lehrpläne und Infoblätter rund um deine Ausbildung — als PDF zum Mitnehmen."
      />

      <section className="vfr-section">
        <div className="vfr-wrap space-y-12">
          {docs.map((g) => (
            <div key={g.group}>
              <div className="flex items-baseline justify-between border-b border-[var(--vfr-fg)] pb-3 mb-6">
                <h2 className="font-[family-name:var(--font-serif)] text-[1.6rem] text-[var(--vfr-fg)] font-medium">
                  {g.group}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {g.items.map((d) => (
                  <a
                    key={d.title}
                    href={d.file}
                    className="bg-[var(--vfr-card)] border border-[var(--vfr-rule)] p-5 flex items-start gap-4 hover:border-[var(--vfr-accent)] transition no-underline"
                  >
                    <div className="h-11 w-11 flex items-center justify-center bg-[var(--vfr-bg-alt)] text-[var(--vfr-accent)] shrink-0 border border-[var(--vfr-rule)]">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--vfr-fg)] text-[0.95rem]">
                        {d.title}
                      </div>
                      <div className="text-[0.85rem] text-[var(--vfr-fg-muted)] mt-1">
                        {d.desc}
                      </div>
                      {d.size && (
                        <div className="text-[0.72rem] text-[var(--vfr-fg-soft)] mt-2 tracking-wide">
                          PDF · {d.size}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[0.88rem] text-[var(--vfr-fg-soft)]">
            Du findest ein Dokument nicht? Schreib uns an info@vfr-gmbh.de — wir
            schicken es dir gerne zu.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
