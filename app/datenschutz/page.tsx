import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LegalBody } from "@/components/LegalBody";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung gemäß DSGVO der Verkehrsfachschule Rheinland GmbH.",
  robots: { index: true, follow: false },
};

export default function DatenschutzPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Datenschutzerklärung" />
      <LegalBody>
        <p>
          Wir nehmen den Schutz deiner persönlichen Daten sehr ernst und behandeln
          personenbezogene Daten vertraulich und gemäß den gesetzlichen
          Datenschutzvorschriften (DSGVO, BDSG, TTDSG).
        </p>

        <h2>Verantwortlicher</h2>
        <p>
          {site.name}<br />
          {site.address.street}, {site.address.zip} {site.address.city}<br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        <h2>Erhebung und Verarbeitung</h2>
        <p>
          Wir verarbeiten personenbezogene Daten, wenn du unsere Website nutzt,
          ein Formular ausfüllst (Rückruf, Buchung) oder mit uns Kontakt
          aufnimmst. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a (Einwilligung),
          lit. b (Vertragsanbahnung/-erfüllung) und lit. f (berechtigtes Interesse)
          DSGVO.
        </p>

        <h2>Buchung & Bezahlung</h2>
        <p>
          Für die Online-Buchung nutzen wir Stripe Payments Europe Ltd. (Irland).
          Bei einer Bezahlung werden deine Zahlungsdaten direkt an Stripe
          übermittelt; wir selbst speichern keine Kreditkartendaten.
          Datenschutzhinweise von Stripe:{" "}
          <a href="https://stripe.com/de/privacy" target="_blank" rel="noreferrer">
            stripe.com/de/privacy
          </a>.
        </p>

        <h2>E-Mail-Versand</h2>
        <p>
          Transaktionale E-Mails (Buchungsbestätigung, Rückruf) versenden wir
          über Resend Inc., USA, mit EU-konformer Datenverarbeitung. Eine
          Auftragsverarbeitungsvereinbarung (AVV) liegt vor.
        </p>

        <h2>Deine Rechte</h2>
        <p>
          Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
          (Art. 15–21 DSGVO). Beschwerden richtest du an die zuständige
          Aufsichtsbehörde (Landesbeauftragte für Datenschutz und
          Informationsfreiheit NRW).
        </p>

        <h2>Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies. Tracking
          findet nicht ohne deine Einwilligung statt.
        </p>
      </LegalBody>
    </>
  );
}
