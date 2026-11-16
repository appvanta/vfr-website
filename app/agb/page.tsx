import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LegalBody } from "@/components/LegalBody";

export const metadata: Metadata = {
  title: "AGB — Allgemeine Geschäftsbedingungen",
  robots: { index: true, follow: false },
};

export default function AgbPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Allgemeine Geschäftsbedingungen" />
      <LegalBody>
        <p className="text-[0.85rem] text-[var(--vfr-fg-soft)]">
          Stand: {new Date().toLocaleDateString("de-DE")}
        </p>
        <p>
          Diese AGB regeln das Vertragsverhältnis zwischen der Verkehrsfachschule
          Rheinland GmbH (im Folgenden „VFR") und den Teilnehmerinnen und
          Teilnehmern unserer Aus-, Fort- und Weiterbildungsmaßnahmen.
        </p>
        <p className="italic text-[var(--vfr-fg-soft)]">
          Hinweis: Dieser Text ist eine Arbeitsvorlage. Vor Veröffentlichung
          durch eine Fachanwältin oder einen Fachanwalt prüfen lassen, insbesondere
          zu Storno-Konditionen, Bildungsgutschein-Abwicklung und
          Prüfungswiederholung.
        </p>
        <ol>
          <li><strong>Geltungsbereich</strong> — AGB gelten für alle Buchungen über vfr-gmbh.de.</li>
          <li><strong>Vertragsschluss</strong> — Vertrag kommt mit Zahlungseingang und Buchungsbestätigung zustande.</li>
          <li><strong>Leistungen</strong> — Lehrgang gemäß Lehrplan, Lehrmittel, Prüfungsanmeldung.</li>
          <li><strong>Preise</strong> — Gemäß Kursdetails; USt-frei nach § 4 Nr. 21 UStG.</li>
          <li><strong>Zahlungsbedingungen</strong> — Vollständige Zahlung vor Kursbeginn, sofern nicht anders vereinbart.</li>
          <li><strong>Storno</strong> — Bis 30 Tage vor Beginn 50 €, danach gestaffelte Stornogebühren.</li>
          <li><strong>Widerruf</strong> — Für Verbraucher 14-tägiges Widerrufsrecht (siehe Widerrufsbelehrung).</li>
          <li><strong>Datenschutz</strong> — Verarbeitung gemäß Datenschutzerklärung.</li>
          <li><strong>Gerichtsstand</strong> — Sitz der VFR, soweit gesetzlich zulässig.</li>
        </ol>
      </LegalBody>
    </>
  );
}
