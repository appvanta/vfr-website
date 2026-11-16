import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LegalBody } from "@/components/LegalBody";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Angaben der Verkehrsfachschule Rheinland GmbH.",
  robots: { index: true, follow: false },
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Impressum" />
      <LegalBody>
        <h2>Anbieter</h2>
        <p>
          {site.name}<br />
          {site.address.street}<br />
          {site.address.zip} {site.address.city}<br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={`tel:${site.phoneClean}`}>{site.phone}</a><br />
          E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        <h2>Vertretungsberechtigt</h2>
        <p>Geschäftsführer: Andreas Hombach</p>

        <h2>Registereintrag</h2>
        <p>
          Eingetragen im Handelsregister<br />
          Registergericht: <em>[Amtsgericht eintragen]</em><br />
          Registernummer: <em>HRB [Nummer]</em>
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>USt-IdNr. gem. § 27a UStG: <em>[DE-XXXXXXXXX]</em></p>

        <h2>Aufsichtsbehörde</h2>
        <p>Bezirksregierung Köln, Abteilung Verkehr</p>

        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
            ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Inhaltlich verantwortlich gem. § 18 Abs. 2 MStV</h2>
        <p><em>[Name, Anschrift]</em></p>
      </LegalBody>
    </>
  );
}
