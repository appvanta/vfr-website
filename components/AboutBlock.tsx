import Link from "next/link";

export function AboutBlock() {
  return (
    <section className="py-20 md:py-24 bg-white border-t border-gray-100">
      <div className="innersection">
        <div className="max-w-5xl mx-auto">
          <h3 className="iconbefore h-section mb-8">
            <span>Fahrlehrerausbildung in Köln: Die VFR Verkehrsfachschule Rheinland GmbH ist Ihre kompetente Aus- und Weiterbildungsstätte für Fahrlehrer in NRW</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-[#2b2b2b] leading-relaxed">
            <p>
              Sie möchten <strong>Fahrlehrer werden</strong>? Die Verkehrsfachschule
              Rheinland (VFR) in Niederkassel bei Köln ist Ihre erste Adresse für eine
              fundierte, AZAV-zertifizierte Ausbildung. Bei uns absolvieren Sie die
              komplette Fahrlehrerausbildung der Klassen <strong>BE, A, CE und DE</strong>{" "}
              — von der Grundausbildung bis zur Spezialisierung auf Bus oder LKW.
            </p>
            <p>
              Unsere langjährige Erfahrung und das Netzwerk an Partner-Fahrschulen in
              NRW und darüber hinaus geben Ihnen die Sicherheit, nach erfolgreicher
              Prüfung sofort in den Beruf einsteigen zu können — mit{" "}
              <strong>Jobgarantie</strong> und attraktiven Konditionen.
            </p>
            <p>
              Die <strong>Fahrlehrerausbildung Kosten</strong> sind durch
              Bildungsgutschein, Bildungsscheck oder Berufsförderungsdienst der
              Bundeswehr in der Regel zu 100 % förderfähig. Wir beraten Sie kostenlos
              zu allen Förder-Möglichkeiten und unterstützen Sie bei der Antragstellung
              bei Agentur für Arbeit und Jobcenter.
            </p>
            <p>
              Profitieren Sie von modernen Schulungsräumen, einer eigenen Fahrzeugflotte
              und einem motivierten Team, das Sie Schritt für Schritt zum Berufsabschluss
              führt. <strong>70 kostenlose Parkplätze</strong> und E-Ladesäulen direkt
              vor der Tür machen den Schulbesuch besonders bequem.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/fahrlehrerausbildung" className="btn-vfr">Zur Ausbildung</Link>
            <Link href="/foerderung" className="btn-outline-vfr">Förderung & Bildungsgutschein</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
