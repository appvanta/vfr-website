import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LegalBody } from "@/components/LegalBody";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  robots: { index: true, follow: false },
};

export default function WiderrufPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Widerrufsbelehrung" />
      <LegalBody>
        <h2>Widerrufsrecht</h2>
        <p>
          Du hast das Recht, binnen <strong>14 Tagen</strong> ohne Angabe von
          Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14
          Tage ab Vertragsschluss.
        </p>
        <p>
          Um dein Widerrufsrecht auszuüben, teile uns per E-Mail, Brief oder
          Telefon deinen Entschluss mit:
        </p>
        <p>
          Verkehrsfachschule Rheinland GmbH<br />
          Karl-Hass-Str. 13, 53859 Niederkassel<br />
          E-Mail: info@vfr-gmbh.de · Telefon: +49 2208 919 626-0
        </p>
        <h2>Folgen des Widerrufs</h2>
        <p>
          Wenn du den Vertrag widerrufst, zahlen wir dir alle erhaltenen Zahlungen
          unverzüglich und spätestens binnen 14 Tagen ab Eingang deiner
          Widerrufsmitteilung zurück.
        </p>
      </LegalBody>
    </>
  );
}
