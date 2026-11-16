/**
 * FAQ-Datenbank — strukturierte Fragen & Antworten pro Angebot.
 *
 * Diese Daten fließen in zwei Stellen ein:
 * 1. Die FAQ-Komponente (Accordion) auf jeder Angebots-Seite
 * 2. Den KI-Chat als Teil des Wissens-Kontexts (System-Prompt)
 *
 * Neue Fragen hier hinzufügen — werden automatisch auf der Seite UND im Chat
 * verfügbar.
 */

export type FaqTopic =
  | "allgemein"
  | "ausbildung-be"
  | "ausbildung-a"
  | "ausbildung-ce"
  | "ausbildung-de"
  | "fortbildung"
  | "weiterbildung"
  | "feuerwehr"
  | "foerderung"
  | "ladekran"
  | "flurfoerderzeuge"
  | "buchung-zahlung";

export type FaqEntry = {
  topics: FaqTopic[];
  q: string;
  a: string;
  /** Optionale Quelle, die im Chat angezeigt wird */
  source?: string;
};

export const FAQ: FaqEntry[] = [
  // ── Allgemein ────────────────────────────────────────
  {
    topics: ["allgemein"],
    q: "Wo findet die Ausbildung statt?",
    a: "Bei uns in Niederkassel, Karl-Hass-Str. 13 — direkt zwischen Köln und Bonn, mit eigenem Übungsgelände und moderner Fahrzeug-Flotte.",
    source: "VFR-Standort",
  },
  {
    topics: ["allgemein"],
    q: "Gibt es ein kostenloses Probe-Angebot?",
    a: "Ja, jeden Dienstag findet unser 90-minütiges Repetitorium kostenlos statt. Zusätzlich veranstalten wir regelmäßig kostenlose Info-Veranstaltungen zum Kennenlernen — die nächsten Termine findest du unter /info-veranstaltungen.",
  },
  {
    topics: ["allgemein"],
    q: "Wie kann ich einen Beratungstermin vereinbaren?",
    a: "Am schnellsten über die Seite /beratung — dort kannst du zwischen Telefon, Video-Konferenz oder einem Vor-Ort-Termin wählen und direkt ein Zeitfenster buchen. Alternativ per WhatsApp, E-Mail oder Telefon.",
  },

  // ── Fahrlehrerausbildung BE ─────────────────────────
  {
    topics: ["ausbildung-be"],
    q: "Wie lange dauert die Fahrlehrerausbildung Klasse BE?",
    a: "12 Monate Vollzeit: 1 Monat Einführung, 7 Monate Theorie, 4 Monate Praxisphase (Lehrpraktikum in einer Partner-Fahrschule).",
    source: "FahrlAusbV",
  },
  {
    topics: ["ausbildung-be"],
    q: "Welche Voraussetzungen muss ich erfüllen?",
    a: "Mindestalter 21 Jahre, Hauptschulabschluss plus Berufsausbildung (oder mittlere Reife), Führerschein Klasse BE seit mindestens 3 Jahren, geistige und körperliche Eignung sowie persönliche Zuverlässigkeit (Führungszeugnis).",
    source: "§ 2 FahrlG",
  },
  {
    topics: ["ausbildung-be"],
    q: "Was kostet die Fahrlehrerausbildung BE?",
    a: "Die Gesamtkosten liegen bei etwa 8.950 €. In der Regel übernimmt die Agentur für Arbeit oder das Jobcenter die Kosten vollständig per Bildungsgutschein, da wir AZAV-zertifiziert sind.",
  },
  {
    topics: ["ausbildung-be", "ausbildung-ce"],
    q: "Was bedeutet der Besuch bei TÜV Nord?",
    a: "Wir fahren mit dem gesamten Jahrgang zur TÜV-Nord-Prüfstraße. Dort zeigt und erklärt das Prüfpersonal live, was wie kontrolliert wird — Bremsen, Beleuchtung, Rahmen, Reifen, Fahrwerk. So verstehst du nicht nur die Theorie, sondern siehst die Praxis mit eigenen Augen.",
  },

  // ── Klasse A (Motorrad) ─────────────────────────────
  {
    topics: ["ausbildung-a"],
    q: "Kann ich Klasse A als Erweiterung machen?",
    a: "Ja, nach der Grundausbildung BE kannst du die Klasse A als Erweiterung erwerben. Dauer: ca. 3 Monate, Preis ca. 2.950 €. Unser Trainingsplatz für Motorrad-Praxis ist auf dem Gelände.",
  },
  {
    topics: ["ausbildung-a"],
    q: "Welche Voraussetzungen brauche ich für Klasse A?",
    a: "Du brauchst die Fahrlehrerlaubnis Klasse BE sowie einen eigenen Motorrad-Führerschein Klasse A (unbeschränkt). Zusätzlich natürlich Fahrpraxis mit dem Motorrad.",
    source: "§ 2 FahrlG",
  },
  {
    topics: ["ausbildung-a"],
    q: "Welche Maschinen stellt ihr für die Praxis?",
    a: "Wir haben einen eigenen Übungsplatz und moderne Schulungsmotorräder vor Ort. Für Fahrstunden auf der Straße nutzen wir ebenfalls aktuelle A-Maschinen aus unserem Fuhrpark.",
  },
  {
    topics: ["ausbildung-a"],
    q: "Kann ich Klasse A auch ohne BE direkt machen?",
    a: "Nein. Die Fahrlehrerlaubnis Klasse A setzt immer eine vorherige Grundausbildung in Klasse BE voraus — so steht es im FahrlG.",
    source: "§ 2 FahrlG",
  },

  // ── Klasse CE (LKW) ─────────────────────────────────
  {
    topics: ["ausbildung-ce"],
    q: "Brauche ich für die CE-Fahrlehrerausbildung den CE-Führerschein?",
    a: "Ja. Für die Fahrlehrerlaubnis Klasse CE ist der eigene Führerschein Klasse CE Voraussetzung. Den kannst du bei Bedarf bei uns erwerben — siehe unser Blaulicht-/Berufskraftfahrer-Angebot.",
    source: "§ 2 FahrlG",
  },
  {
    topics: ["ausbildung-ce"],
    q: "Wie lange dauert die CE-Erweiterung?",
    a: "Rund 3 Monate. Praxis mit echten LKW und Sattelzügen in Kooperation mit regionalen Spediteuren, inkl. Besuch bei TÜV Nord an der LKW-Prüfstraße.",
  },
  {
    topics: ["ausbildung-ce"],
    q: "Was kostet die Fahrlehrerausbildung CE?",
    a: "Die Gesamtkosten liegen bei etwa 3.950 €. Förderung über Bildungsgutschein oder BFD der Bundeswehr ist möglich — wir prüfen das gemeinsam mit dir.",
  },
  {
    topics: ["ausbildung-ce"],
    q: "Mit welchen Fahrzeugen fahre ich in der Praxis?",
    a: "Echte LKW, Sattelzüge und Tankauflieger aus unserem Partner-Netzwerk — keine Simulation. So lernst du Fahrzeugtechnik direkt am Objekt, was im späteren Unterricht den Unterschied macht.",
  },
  {
    topics: ["ausbildung-ce"],
    q: "Gibt es nach CE gute Jobchancen?",
    a: "Ja — Fahrlehrer für LKW sind stark nachgefragt, besonders im Zusammenhang mit der BKrFQV-Weiterbildungspflicht. Wir vermitteln auch Kontakte in die Branche.",
  },

  // ── Klasse DE (Bus) ─────────────────────────────────
  {
    topics: ["ausbildung-de"],
    q: "Was ist in der Klasse DE enthalten?",
    a: "Erweiterung Klasse DE — Bus & Bus mit Anhänger. Dauer ca. 3 Monate, Preis ca. 3.950 €. Praxiseinsatz mit echtem Bus in Kooperation mit regionalen Busunternehmen.",
  },
  {
    topics: ["ausbildung-de"],
    q: "Brauche ich den D-Führerschein für die DE-Fahrlehrerausbildung?",
    a: "Ja, ein gültiger eigener Führerschein Klasse D ist Voraussetzung. Die Erweiterung auf DE erfolgt im Rahmen der Ausbildung.",
    source: "§ 2 FahrlG",
  },
  {
    topics: ["ausbildung-de"],
    q: "Welche Busse werden im Unterricht eingesetzt?",
    a: "Echte Linien- und Reisebusse aus unserem Partner-Netzwerk mit regionalen Busunternehmen (ÖPNV und Reiseverkehr).",
  },
  {
    topics: ["ausbildung-de"],
    q: "Sind nach DE-Abschluss auch ADR oder Spezialseminare möglich?",
    a: "Ja — nach der DE-Erweiterung bauen viele unserer Absolventen weitere Qualifikationen wie ADR, Fahrsicherheitstrainings oder BKrFQV-Seminare auf. Wir beraten dich zu den passenden nächsten Schritten.",
  },

  // ── Fortbildung ──────────────────────────────────────
  {
    topics: ["fortbildung"],
    q: "Wie oft muss ich als Fahrlehrer zur Fortbildung?",
    a: "Alle 4 Jahre insgesamt 3 Tage Pflichtfortbildung nach § 53 FahrlG. Du kannst sie als 3-Tages-Block oder einzeln in 1-Tages-Modulen besuchen.",
    source: "§ 53 FahrlG",
  },
  {
    topics: ["fortbildung"],
    q: "Was ist ASF?",
    a: "Aufbauseminar für Fahranfänger nach FeV. Die Qualifikation Seminarleiter ASF berechtigt Fahrlehrer zur Leitung dieser Seminare.",
  },
  {
    topics: ["fortbildung"],
    q: "Was ist FES?",
    a: "Fahreignungsseminar nach FeV. Die Qualifikation Seminarleiter FES berechtigt Fahrlehrer zur Leitung dieser Seminare.",
  },

  // ── Weiterbildung ───────────────────────────────────
  {
    topics: ["weiterbildung"],
    q: "Muss ich BWL machen, um eine eigene Fahrschule zu eröffnen?",
    a: "Ja, der BWL-Lehrgang nach § 2 FahrlG ist Voraussetzung, wenn du eine eigene Fahrschule gründen oder übernehmen möchtest. Dauer bei uns ca. 2–3 Wochen, Preis ca. 1.490 €.",
    source: "§ 2 FahrlG",
  },
  {
    topics: ["weiterbildung"],
    q: "Was ist ein Ausbildungsfahrlehrer?",
    a: "Ein Ausbildungsfahrlehrer darf angehende Fahrlehrer während ihrer Praxisphase (Lehrpraktikum) in der eigenen Fahrschule betreuen. Die Qualifikation setzt eine mehrtägige Weiterbildung voraus.",
  },

  // ── Feuerwehr / Blaulicht ───────────────────────────
  {
    topics: ["feuerwehr"],
    q: "Welche Schulungen gibt es für Feuerwehren?",
    a: "Fünf Module: Fahrerlaubnis Klasse C & CE, Einweisungsfahrten auf Einsatzfahrzeuge, Einsatzfahrten nach § 35/§ 38 StVO, Ladungssicherung und Geländetraining.",
  },
  {
    topics: ["feuerwehr"],
    q: "Kann die Kommune den Führerschein für Feuerwehr-Angehörige bezahlen?",
    a: "Ja, viele Kommunen übernehmen die Führerschein-Kosten für ehrenamtliche Feuerwehr-Angehörige — frag am besten bei deiner Gemeinde nach. Wir stellen gerne Angebote für die Verwaltung aus.",
  },
  {
    topics: ["feuerwehr"],
    q: "Was ist eine Einweisungsfahrt?",
    a: "Individuelle Einweisung neuer Maschinisten auf das konkrete Einsatzfahrzeug — direkt an eurem Standort oder bei uns. Fahrzeugspezifika, Maße, Lastverhalten, Besonderheiten im Alarmfall.",
  },

  // ── Förderung ────────────────────────────────────────
  {
    topics: ["foerderung"],
    q: "Welche Fördermöglichkeiten gibt es?",
    a: "Agentur für Arbeit (Bildungsgutschein nach § 81 SGB III), Jobcenter (SGB II), Aufstiegs-BAföG, Berufsförderungsdienst der Bundeswehr, Deutsche Rentenversicherung (LTA), DGUV (Berufsgenossenschaften) und regionale Programme wie Bildungsscheck.",
  },
  {
    topics: ["foerderung", "ausbildung-be"],
    q: "Was ist ein Bildungsgutschein?",
    a: "Der Bildungsgutschein nach § 81 SGB III ist eine Förderung der Agentur für Arbeit. Als AZAV-zertifizierte Einrichtung können wir eingelöste Bildungsgutscheine annehmen. Die Bewilligung erfolgt individuell durch die Arbeitsagentur.",
    source: "§ 81 SGB III",
  },

  // ── Ladekran / Flurförderzeuge ──────────────────────
  {
    topics: ["ladekran"],
    q: "Was ist die Ladekran-Ausbildung?",
    a: "Theorie und Praxis zum sicheren Führen von Ladekranen (Befähigungsschein nach DGUV 309-003). 3 Tage, ca. 590 €. Für Fahrer, Mitarbeiter und Ausbilder.",
  },
  {
    topics: ["flurfoerderzeuge"],
    q: "Was ist der Gabelstaplerschein?",
    a: "Ausbildung zum Fahrer von Flurförderzeugen nach DGUV 308-001. 3 Tage inkl. Theorie, Praxis und Prüfung. Ca. 420 €.",
  },

  // ── Buchung & Zahlung ───────────────────────────────
  {
    topics: ["buchung-zahlung"],
    q: "Wie kann ich online buchen?",
    a: "Alle Kurse kannst du unter /termine-preise ansehen und direkt buchen. Du kannst sofort per Apple Pay, Google Pay, Kreditkarte oder SEPA zahlen oder dich verbindlich anmelden und per Rechnung zahlen.",
  },
  {
    topics: ["buchung-zahlung"],
    q: "Kann ich mehrere Teilnehmer gleichzeitig anmelden?",
    a: "Ja, im Buchungs-Formular kannst du beliebig viele Teilnehmer hinzufügen (z.B. als Fahrschule für deine Fahrlehrer). Die Rechnungsadresse kann separat angegeben werden.",
  },
  {
    topics: ["buchung-zahlung"],
    q: "Wann ist meine Anmeldung verbindlich?",
    a: "Nach Klick auf den Bestätigungslink in der Email, die wir nach Anmeldung verschicken. Dein Platz ist dann für dich reserviert — die finale Zusage kommt innerhalb 1–3 Werktagen durch unser Büro.",
  },
  {
    topics: ["buchung-zahlung"],
    q: "Kann ich stornieren?",
    a: "Ja, du hast ein 14-tägiges Widerrufsrecht gemäß Verbraucherwiderrufsrecht. Details in unserer Widerrufsbelehrung unter /widerruf.",
  },
];

/** Liefert alle FAQs zu einem oder mehreren Themen (inkl. „allgemein") */
export function faqByTopic(...topics: FaqTopic[]): FaqEntry[] {
  return FAQ.filter((e) =>
    topics.some((t) => e.topics.includes(t)) || e.topics.includes("allgemein"),
  );
}

/** Nur die thema-spezifischen (ohne allgemeine) */
export function faqByTopicStrict(...topics: FaqTopic[]): FaqEntry[] {
  return FAQ.filter((e) => topics.some((t) => e.topics.includes(t)));
}
