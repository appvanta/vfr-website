/**
 * Flario-Adapter
 * --------------------------------------------------------------------------
 * Zentrale Stelle, an der die Kursverwaltungs-Software Flario angesprochen wird.
 *
 * Konfiguration per .env:
 *   FLARIO_API_BASE        z.B. https://api.flario.de/v1
 *   FLARIO_API_KEY         Bearer-Token
 *   FLARIO_TENANT_ID       (optional, Multi-Mandanten)
 *   FLARIO_WEBHOOK_SECRET  HMAC-Secret für eingehende Webhooks
 *
 * Ohne Credentials liefert dieser Adapter Mock-Daten, damit die Website
 * vollständig bedienbar bleibt. Siehe docs/flario-api-spec.md für die
 * komplette Schnittstellenbeschreibung.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CourseCategory =
  | "ausbildung-be"
  | "ausbildung-a"
  | "ausbildung-ce"
  | "ausbildung-de"
  | "fortbildung"
  | "weiterbildung"
  | "ladekran"
  | "flurfoerderzeuge"
  | "info-veranstaltung";

export type PaymentMethod = "card" | "applepay" | "googlepay" | "invoice" | "sepa";

export type Course = {
  id: string;
  externalRef?: string;
  category: CourseCategory;
  title: string;
  subtitle?: string;
  description: string;
  startDate: string;          // ISO yyyy-mm-dd
  endDate: string;
  durationDays?: number;
  location: string;
  priceCents: number;
  vatExempt: boolean;
  seatsTotal: number;
  seatsAvailable: number;
  seatsVisible?: boolean;     // Flario: freie Plätze als Zahl zeigen (sonst nur "Verfügbar")
  bookable: boolean;
  publicVisible: boolean;     // NEU: Flario entscheidet, ob Kurs auf Website erscheint
  fundingEligible: boolean;
  paymentOptions: PaymentMethod[];
  updatedAt?: string;
};

export type QualificationKey =
  | "ausbildungsfahrlehrer"
  | "seminarleiter-asf"
  | "seminarleiter-fes"
  | "bwl";

export type Qualification = {
  key: QualificationKey;
  grantedYear?: number;
};

/** Fahrlehrerlaubnis-Klassen (Berechtigung zu unterrichten) */
export type LicenseClassKey = "be" | "a" | "ce" | "de";

export type LicenseClass = {
  key: LicenseClassKey;
  /** ISO yyyy-mm-dd, Erteilungsdatum der Fahrlehrerlaubnis */
  grantedDate?: string;
};

/** Fahrerlaubnis-Klassen (eigener Führerschein für LKW/Bus) */
export type DrivingLicenseKey = "c" | "ce" | "d" | "de";

export type DrivingLicense = {
  key: DrivingLicenseKey;
  /** ISO yyyy-mm-dd, Erteilungsdatum des Führerscheins */
  grantedDate?: string;
};

export type Participant = {
  salutation: "Herr" | "Frau" | "Divers";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  street: string;
  zip: string;
  city: string;
  country?: string;
  /** Erteilte Fahrlehrerlaubnisklassen (BE, A, CE, DE) mit Erteilungsdatum */
  licenses?: LicenseClass[];
  /** Erteilte Fahrerlaubnisklassen / Führerschein (C, CE, D, DE) */
  drivingLicenses?: DrivingLicense[];
  /** Zusatzqualifikationen (Ausbildungsfahrlehrer, Seminarleiter, BWL) */
  qualifications?: Qualification[];
};

/** Rechnungsadresse — kann abweichen vom/von den Teilnehmer(n) */
export type BillingContact = {
  company?: string;
  salutation?: "Herr" | "Frau" | "Divers";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  street: string;
  zip: string;
  city: string;
  country?: string;
  /** VAT-ID für Firmenrechnung, optional */
  vatId?: string;
};

export type ContractAcceptance = {
  version: string;
  acceptedAgb: boolean;
  acceptedWiderruf: boolean;
  acceptedDatenschutz: boolean;
  signature: {
    format: "image/png;base64";
    data: string;
    signedAt: string;
    ipAddress?: string;
    userAgent?: string;
  };
};

export type PaymentInfo = {
  method: PaymentMethod;
  status: "pending" | "paid" | "failed";
  amountCents: number;
  stripePaymentIntentId?: string | null;
  invoiceNumber: string;
};

export type RegistrationInput = {
  courseId: string;
  /** 1-n Teilnehmer; bei Einzelanmeldung Array mit einem Eintrag */
  participants: Participant[];
  /** Rechnungsadresse; bei Einzelanmeldung aus participants[0] abgeleitet oder abweichend */
  billing: BillingContact;
  contract: ContractAcceptance;
  payment: PaymentInfo;
  source: "website";
};

export type RegistrationStatus =
  | "pending_confirmation"
  | "confirmed"
  | "rejected"
  | "cancelled";

export type Registration = {
  registrationId: string;
  courseId: string;
  status: RegistrationStatus;
  createdAt: string;
  participants: Participant[];
  billing: BillingContact;
  payment: PaymentInfo;
};

// ---------------------------------------------------------------------------
// Config & low-level fetch
// ---------------------------------------------------------------------------

const BASE = process.env.FLARIO_API_BASE;
const KEY = process.env.FLARIO_API_KEY;
const TENANT = process.env.FLARIO_TENANT_ID;

function useMockData() {
  return !BASE || !KEY;
}

async function flarioFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(TENANT ? { "X-Tenant-Id": TENANT } : {}),
      ...(init?.headers ?? {}),
    },
    next: init?.next ?? { revalidate: 300, tags: ["flario"] },
  });
  if (!res.ok) {
    throw new Error(`Flario API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Mock data – wird durch echte Flario-Daten ersetzt, sobald Credentials da sind
// ---------------------------------------------------------------------------

const today = new Date();
const isoIn = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const MOCK_COURSES: Course[] = [
  {
    id: "be-2026-01",
    externalRef: "BE-2026-01",
    category: "ausbildung-be",
    title: "Fahrlehrerausbildung Klasse BE",
    subtitle: "12-Monats-Lehrgang inkl. Praxisphase",
    description:
      "Komplette Ausbildung zum/zur Fahrlehrer:in Klasse BE nach FahrlAusbV. " +
      "12 Monate Vollzeit: 1 Monat Einführung, 7 Monate Theorie, 4 Monate Praxis.",
    startDate: isoIn(30),
    endDate: isoIn(395),
    durationDays: 365,
    location: "Niederkassel",
    priceCents: 895000,
    vatExempt: true,
    seatsTotal: 16,
    seatsAvailable: 6,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card", "applepay"],
  },
  {
    id: "be-2026-04",
    externalRef: "BE-2026-04",
    category: "ausbildung-be",
    title: "Fahrlehrerausbildung Klasse BE",
    subtitle: "Frühjahrsstart",
    description: "Klasse BE – Frühjahrslehrgang in Niederkassel.",
    startDate: isoIn(120),
    endDate: isoIn(485),
    durationDays: 365,
    location: "Niederkassel",
    priceCents: 895000,
    vatExempt: true,
    seatsTotal: 16,
    seatsAvailable: 14,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card", "applepay"],
  },
  {
    id: "a-2026-02",
    externalRef: "A-2026-02",
    category: "ausbildung-a",
    title: "Erweiterung Klasse A",
    subtitle: "Motorrad-Erweiterung",
    description:
      "Erweiterung Klasse A – Motorrad-Fahrlehrerausbildung mit eigenem Trainingsplatz.",
    startDate: isoIn(60),
    endDate: isoIn(140),
    durationDays: 80,
    location: "Niederkassel",
    priceCents: 295000,
    vatExempt: true,
    seatsTotal: 12,
    seatsAvailable: 5,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card", "applepay"],
  },
  {
    id: "ce-2026-03",
    externalRef: "CE-2026-03",
    category: "ausbildung-ce",
    title: "Erweiterung Klasse CE",
    subtitle: "LKW & Sattelzug",
    description:
      "Erweiterung Klasse CE – Fahrlehrer für LKW und Sattelzug.",
    startDate: isoIn(90),
    endDate: isoIn(180),
    durationDays: 90,
    location: "Niederkassel",
    priceCents: 395000,
    vatExempt: true,
    seatsTotal: 10,
    seatsAvailable: 3,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card", "applepay"],
  },
  {
    id: "de-2026-05",
    externalRef: "DE-2026-05",
    category: "ausbildung-de",
    title: "Erweiterung Klasse DE",
    subtitle: "Bus & Bus mit Anhänger",
    description: "Erweiterung Klasse DE – Bus & Bus mit Anhänger.",
    startDate: isoIn(150),
    endDate: isoIn(230),
    durationDays: 80,
    location: "Niederkassel",
    priceCents: 395000,
    vatExempt: true,
    seatsTotal: 10,
    seatsAvailable: 8,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card", "applepay"],
  },
  {
    id: "fort-allgemein-1t-2026-q1",
    externalRef: "FORT-ALLG-1T-2026-Q1",
    category: "fortbildung",
    title: "Allgemeine Fortbildung 1 Tag — Pflicht-Modul",
    subtitle: "§ 53 FahrlG",
    description:
      "Pflicht-Fortbildung nach § 53 FahrlG, 1-Tages-Modul. Eines von 4 Modulen pro 4-Jahres-Zyklus.",
    startDate: isoIn(35),
    endDate: isoIn(35),
    durationDays: 1,
    location: "Niederkassel",
    priceCents: 19500,
    vatExempt: true,
    seatsTotal: 20,
    seatsAvailable: 14,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "fort-allgemein-3t-2026-q2",
    externalRef: "FORT-ALLG-3T-2026-Q2",
    category: "fortbildung",
    title: "Allgemeine Fortbildung 3 Tage — Komplettblock",
    subtitle: "§ 53 FahrlG",
    description:
      "Pflicht-Fortbildung nach § 53 FahrlG als 3-Tages-Komplettblock. Deckt den gesamten 4-Jahres-Zyklus ab.",
    startDate: isoIn(65),
    endDate: isoIn(67),
    durationDays: 3,
    location: "Niederkassel",
    priceCents: 49000,
    vatExempt: true,
    seatsTotal: 20,
    seatsAvailable: 16,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "fort-asf-2026-q1",
    externalRef: "FORT-ASF-2026-Q1",
    category: "fortbildung",
    title: "Fortbildung ASF — Seminarleiter-Pflichtfortbildung",
    subtitle: "§ 2a StVG",
    description:
      "Pflichtfortbildung für Seminarleiter:innen von Aufbauseminaren für Fahranfänger (ASF).",
    startDate: isoIn(45),
    endDate: isoIn(52),
    durationDays: 7,
    location: "Niederkassel",
    priceCents: 89000,
    vatExempt: true,
    seatsTotal: 14,
    seatsAvailable: 9,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "fort-ausbilder-2026-q2",
    externalRef: "FORT-AUSB-2026-Q2",
    category: "fortbildung",
    title: "Fortbildung Ausbildungsfahrlehrer — Pflichtfortbildung",
    subtitle: "§ 53 FahrlG",
    description:
      "Pflichtfortbildung gemäß § 53 FahrlG für Ausbildungsfahrlehrer:innen.",
    startDate: isoIn(75),
    endDate: isoIn(78),
    durationDays: 3,
    location: "Niederkassel",
    priceCents: 49000,
    vatExempt: true,
    seatsTotal: 18,
    seatsAvailable: 12,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "fort-fes-2026-q3",
    externalRef: "FORT-FES-2026-Q3",
    category: "fortbildung",
    title: "Fortbildung FES — Seminarleiter-Pflichtfortbildung",
    subtitle: "§ 4a StVG",
    description:
      "Pflichtfortbildung für Seminarleiter:innen von Fahreignungsseminaren (FES).",
    startDate: isoIn(95),
    endDate: isoIn(96),
    durationDays: 2,
    location: "Niederkassel",
    priceCents: 42000,
    vatExempt: true,
    seatsTotal: 14,
    seatsAvailable: 10,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "fort-bkf-2026-q3",
    externalRef: "FORT-BKF-2026-Q3",
    category: "fortbildung",
    title: "Fortbildung Ausbilder BKF — Qualifikation nach BKrFQG",
    subtitle: "Berufskraftfahrer-Qualifikations-Gesetz",
    description:
      "Pflichtfortbildung für Ausbilder:innen im Bereich Berufskraftfahrer-Qualifikation (BKrFQG). Themenbereiche: Didaktik, Fahrsicherheit, neue Rechtslage.",
    startDate: isoIn(110),
    endDate: isoIn(112),
    durationDays: 3,
    location: "Niederkassel",
    priceCents: 59000,
    vatExempt: true,
    seatsTotal: 15,
    seatsAvailable: 11,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "weiter-ausbfl-2026-q2",
    externalRef: "WEITER-AUSBFL-2026-Q2",
    category: "weiterbildung",
    title: "Ausbildungsfahrlehrer — 5-Tage-Lehrgang",
    subtitle: "Qualifikation nach § 2 Abs. 2 FahrlG",
    description:
      "5-tägiger Lehrgang zur Qualifikation als Ausbildungsfahrlehrer. Voraussetzung, um Fahrlehrer-Anwärter im praktischen Teil auszubilden.",
    startDate: isoIn(85),
    endDate: isoIn(89),
    durationDays: 5,
    location: "Niederkassel",
    priceCents: 125000,
    vatExempt: true,
    seatsTotal: 15,
    seatsAvailable: 9,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "weiter-smlgrund-2026-q3",
    externalRef: "WEITER-SMLGRUND-2026-Q3",
    category: "weiterbildung",
    title: "Seminarleiter Grundlehrgang — Qualifikation",
    subtitle: "nach §§ 45 FahrlG & § 2a StVG",
    description:
      "Grundlehrgang zur Qualifikation als Seminarleiter:in für ASF und FES. Voraussetzung für die anschließenden Modul-Lehrgänge.",
    startDate: isoIn(120),
    endDate: isoIn(124),
    durationDays: 5,
    location: "Niederkassel",
    priceCents: 95000,
    vatExempt: true,
    seatsTotal: 14,
    seatsAvailable: 10,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "weiter-smlasf-2026-q3",
    externalRef: "WEITER-SMLASF-2026-Q3",
    category: "weiterbildung",
    title: "Seminarleiter ASF — Aufbauseminar für Fahranfänger",
    subtitle: "Modul-Qualifikation",
    description:
      "Qualifikationslehrgang zum Leiter von Aufbauseminaren für Fahranfänger (§ 2a StVG). Setzt den Seminarleiter-Grundlehrgang voraus.",
    startDate: isoIn(135),
    endDate: isoIn(136),
    durationDays: 2,
    location: "Niederkassel",
    priceCents: 49000,
    vatExempt: true,
    seatsTotal: 14,
    seatsAvailable: 11,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "weiter-smlfes-2026-q4",
    externalRef: "WEITER-SMLFES-2026-Q4",
    category: "weiterbildung",
    title: "Seminarleiter FES — Fahreignungsseminar",
    subtitle: "Modul-Qualifikation",
    description:
      "Qualifikationslehrgang zum Leiter von Fahreignungsseminaren (§ 4a StVG). Setzt den Seminarleiter-Grundlehrgang voraus.",
    startDate: isoIn(155),
    endDate: isoIn(156),
    durationDays: 2,
    location: "Niederkassel",
    priceCents: 49000,
    vatExempt: true,
    seatsTotal: 14,
    seatsAvailable: 12,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "weiter-bwl-2026",
    externalRef: "WEITER-BWL-2026",
    category: "weiterbildung",
    title: "BWL — Lehrgang für Fahrschulinhaber",
    description:
      "Betriebswirtschaftliche Grundlagen für die selbstständige Tätigkeit als Fahrschulinhaber:in.",
    startDate: isoIn(100),
    endDate: isoIn(115),
    durationDays: 15,
    location: "Niederkassel",
    priceCents: 149000,
    vatExempt: true,
    seatsTotal: 12,
    seatsAvailable: 7,
    bookable: true,
    publicVisible: true,
    fundingEligible: true,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "ladekran-2026-q2",
    externalRef: "LADEKRAN-2026-Q2",
    category: "ladekran",
    title: "Ladekran-Ausbildung",
    subtitle: "Befähigungsschein nach DGUV 309-003",
    description:
      "Theorie und Praxis zum sicheren Führen von Ladekranen. Für Fahrer, Mitarbeiter und Ausbilder.",
    startDate: isoIn(55),
    endDate: isoIn(57),
    durationDays: 3,
    location: "Niederkassel",
    priceCents: 59000,
    vatExempt: false,
    seatsTotal: 10,
    seatsAvailable: 8,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "flurfoerderzeuge-2026-q2",
    externalRef: "GABELSTAPLER-2026-Q2",
    category: "flurfoerderzeuge",
    title: "Flurförderzeuge / Gabelstaplerschein",
    subtitle: "nach DGUV 308-001",
    description:
      "Ausbildung zum Fahrer von Flurförderzeugen inkl. Gabelstapler. Theorie + Praxis + Prüfung.",
    startDate: isoIn(80),
    endDate: isoIn(82),
    durationDays: 3,
    location: "Niederkassel",
    priceCents: 42000,
    vatExempt: false,
    seatsTotal: 12,
    seatsAvailable: 10,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice", "card"],
  },
  {
    id: "info-2026-monthly",
    externalRef: "INFO-2026-MONTHLY",
    category: "info-veranstaltung",
    title: "Kostenlose Info-Veranstaltung",
    description:
      "Lernen Sie uns kennen – kostenlose Informationsveranstaltung zur Fahrlehrerausbildung.",
    startDate: isoIn(14),
    endDate: isoIn(14),
    durationDays: 1,
    location: "Niederkassel",
    priceCents: 0,
    vatExempt: true,
    seatsTotal: 40,
    seatsAvailable: 28,
    bookable: true,
    publicVisible: true,
    fundingEligible: false,
    paymentOptions: ["invoice"],
  },
];

// Einfache In-Memory-Liste für gesendete Anmeldungen (nur im Mock-Modus,
// damit die Admin-Angemeldet-Liste während der Entwicklung etwas anzeigt).
const MOCK_REGISTRATIONS: Registration[] = [];

// ---------------------------------------------------------------------------
// Public API — Kurse
// ---------------------------------------------------------------------------

export async function listCourses(filter?: {
  category?: CourseCategory;
  onlyBookable?: boolean;
  includeHidden?: boolean;
}): Promise<Course[]> {
  let courses: Course[];

  if (useMockData()) {
    courses = MOCK_COURSES;
  } else {
    const data = await flarioFetch<{ courses: Course[] }>("/courses");
    courses = data.courses;
  }

  return courses
    .filter((c) => (filter?.includeHidden ? true : c.publicVisible !== false))
    .filter((c) => (filter?.category ? c.category === filter.category : true))
    .filter((c) => (filter?.onlyBookable ? c.bookable && c.seatsAvailable > 0 : true))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function getCourse(id: string): Promise<Course | null> {
  if (useMockData()) {
    const c = MOCK_COURSES.find((x) => x.id === id);
    return c && c.publicVisible !== false ? c : null;
  }
  try {
    return await flarioFetch<Course>(`/courses/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API — Anmeldungen
// ---------------------------------------------------------------------------

/**
 * Sendet eine komplette Online-Anmeldung an Flario.
 * Wird von /api/registration/submit aufgerufen, nachdem der Kunde den
 * Online-Vertrag unterschrieben hat.
 *
 * Bei Direktzahlung (Stripe) wird diese Funktion vom Stripe-Webhook
 * aufgerufen, nachdem die Zahlung bestätigt ist.
 */
export async function submitRegistration(
  input: RegistrationInput,
): Promise<{ ok: true; registrationId: string; status: RegistrationStatus }> {
  if (useMockData()) {
    const regId = `MOCK-REG-${Date.now()}`;
    MOCK_REGISTRATIONS.push({
      registrationId: regId,
      courseId: input.courseId,
      status: "pending_confirmation",
      createdAt: new Date().toISOString(),
      participants: input.participants,
      billing: input.billing,
      payment: input.payment,
    });
    return { ok: true, registrationId: regId, status: "pending_confirmation" };
  }
  const data = await flarioFetch<{
    registrationId: string;
    status: RegistrationStatus;
  }>(`/registrations`, {
    method: "POST",
    body: JSON.stringify(input),
    next: { revalidate: 0 },
  });
  return { ok: true, registrationId: data.registrationId, status: data.status };
}

/**
 * Setzt den Status einer Anmeldung (vom Büro-Admin aus aufgerufen).
 * In der Regel wird Flario das direkt im eigenen UI erlauben — diese Funktion
 * ist nur für die Website-eigene Admin-Angemeldet-Liste gedacht.
 */
export async function setRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus,
  reason?: string,
): Promise<{ ok: true }> {
  if (useMockData()) {
    const r = MOCK_REGISTRATIONS.find((x) => x.registrationId === registrationId);
    if (r) r.status = status;
    return { ok: true };
  }
  await flarioFetch<unknown>(
    `/registrations/${encodeURIComponent(registrationId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
      next: { revalidate: 0 },
    },
  );
  return { ok: true };
}

/**
 * Liste der Anmeldungen (für Website-interne Admin-Ansicht).
 * Flario selbst sollte diese Liste in seinem eigenen UI anzeigen —
 * diese Funktion ist Backup, falls das Büro über die Website arbeitet.
 */
export async function listRegistrations(filter?: {
  status?: RegistrationStatus;
  courseId?: string;
}): Promise<Registration[]> {
  if (useMockData()) {
    return MOCK_REGISTRATIONS.filter((r) =>
      filter?.status ? r.status === filter.status : true,
    ).filter((r) => (filter?.courseId ? r.courseId === filter.courseId : true));
  }
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  if (filter?.courseId) params.set("courseId", filter.courseId);
  const data = await flarioFetch<{ registrations: Registration[] }>(
    `/registrations?${params.toString()}`,
    { next: { revalidate: 0 } },
  );
  return data.registrations;
}

// ---------------------------------------------------------------------------
// Rückwärts-Kompat: alter Name wird noch von Stripe-Webhook verwendet
// ---------------------------------------------------------------------------

export async function bookCourseInFlario(input: {
  courseId: string;
  participant: Participant;
  paymentReference: string;
  invoiceNumber: string;
  amountCents: number;
  contract?: ContractAcceptance;
  billing?: BillingContact;
}): Promise<{ ok: true; bookingId: string }> {
  const p = input.participant;
  const billing: BillingContact = input.billing ?? {
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone,
    street: p.street,
    zip: p.zip,
    city: p.city,
    country: p.country,
  };
  const result = await submitRegistration({
    courseId: input.courseId,
    participants: [p],
    billing,
    contract: input.contract ?? {
      version: "legacy",
      acceptedAgb: true,
      acceptedWiderruf: true,
      acceptedDatenschutz: true,
      signature: {
        format: "image/png;base64",
        data: "",
        signedAt: new Date().toISOString(),
      },
    },
    payment: {
      method: "card",
      status: "paid",
      amountCents: input.amountCents,
      stripePaymentIntentId: input.paymentReference,
      invoiceNumber: input.invoiceNumber,
    },
    source: "website",
  });
  return { ok: true, bookingId: result.registrationId };
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export const CATEGORY_LABEL: Record<CourseCategory, string> = {
  "ausbildung-be": "Klasse BE",
  "ausbildung-a":  "Klasse A",
  "ausbildung-ce": "Klasse CE",
  "ausbildung-de": "Klasse DE",
  "fortbildung":   "Fortbildung",
  "weiterbildung": "Weiterbildung",
  "ladekran":      "Ladekran",
  "flurfoerderzeuge": "Flurförderzeuge",
  "info-veranstaltung": "Info-Veranstaltung",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  card: "Kreditkarte",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  invoice: "Rechnung",
  sepa: "SEPA-Lastschrift",
};

export const QUALIFICATION_LABEL: Record<QualificationKey, string> = {
  "ausbildungsfahrlehrer": "Ausbildungsfahrlehrer:in",
  "seminarleiter-asf": "Seminarleiter:in ASF",
  "seminarleiter-fes": "Seminarleiter:in FES",
  "bwl": "BWL-Lehrgang Fahrschulinhaber",
};

export const LICENSE_CLASS_LABEL: Record<LicenseClassKey, string> = {
  "be": "Klasse BE",
  "a":  "Klasse A",
  "ce": "Klasse CE",
  "de": "Klasse DE",
};

export const DRIVING_LICENSE_LABEL: Record<DrivingLicenseKey, string> = {
  "c":  "Klasse C",
  "ce": "Klasse CE",
  "d":  "Klasse D",
  "de": "Klasse DE",
};

// ---------------------------------------------------------------------------
// Beratungs-Termine (Online / Telefon / Vor-Ort)
// ---------------------------------------------------------------------------

export type AppointmentKind = "phone" | "video" | "onsite";

export const APPOINTMENT_KIND_LABEL: Record<AppointmentKind, string> = {
  phone: "Telefon-Beratung",
  video: "Video-Konferenz",
  onsite: "Vor-Ort-Termin in Niederkassel",
};

export type AppointmentSlot = {
  /** ISO datetime, Beginn des Slots */
  start: string;
  /** Dauer in Minuten */
  durationMin: number;
  /** verfügbar für welche Beratungs-Arten */
  availableFor: AppointmentKind[];
};

export type AppointmentInput = {
  kind: AppointmentKind;
  start: string;
  durationMin: number;
  contact: {
    salutation?: "Herr" | "Frau" | "Divers";
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message?: string;
    topic?: string;
  };
  source: "website";
};

export type Appointment = {
  appointmentId: string;
  kind: AppointmentKind;
  start: string;
  durationMin: number;
  status: "booked" | "cancelled" | "done";
  createdAt: string;
};

const MOCK_APPOINTMENTS: Appointment[] = [];

/** Gibt verfügbare Zeitfenster zurück — Mo–Fr 9–16 Uhr in 30-min Slots für die nächsten 14 Werktage */
function generateMockSlots(): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let d = 1; d <= 21; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const dow = day.getDay(); // 0 So, 6 Sa
    if (dow === 0 || dow === 6) continue;
    for (const hour of [9, 10, 11, 13, 14, 15]) {
      for (const min of [0, 30]) {
        const slot = new Date(day);
        slot.setHours(hour, min, 0, 0);
        // Pseudo-Verfügbarkeit: deterministisch ca. 30% belegt
        const seed = (d * 7 + hour * 3 + min / 30) % 10;
        if (seed < 3) continue;
        slots.push({
          start: slot.toISOString(),
          durationMin: 30,
          availableFor: ["phone", "video", "onsite"],
        });
      }
    }
  }
  return slots;
}

export async function listAppointmentSlots(filter?: {
  kind?: AppointmentKind;
  fromDate?: string;
  toDate?: string;
}): Promise<AppointmentSlot[]> {
  let slots: AppointmentSlot[];
  if (useMockData()) {
    slots = generateMockSlots();
  } else {
    const data = await flarioFetch<{ slots: AppointmentSlot[] }>(
      "/appointment-slots",
    );
    slots = data.slots;
  }
  return slots
    .filter((s) =>
      filter?.kind ? s.availableFor.includes(filter.kind) : true,
    )
    .filter((s) => (filter?.fromDate ? s.start >= filter.fromDate : true))
    .filter((s) => (filter?.toDate ? s.start <= filter.toDate : true));
}

// ---------------------------------------------------------------------------
// Chat-Sessions — damit Flario Live mitlesen und übernehmen kann
// ---------------------------------------------------------------------------

export type ChatRole = "user" | "assistant" | "agent" | "system";

export type ChatMessage = {
  id?: string;
  role: ChatRole;
  content: string;
  at: string; // ISO-Timestamp
  /** Name des Flario-Mitarbeiters, wenn role === "agent" */
  agentName?: string;
};

export type ChatSession = {
  sessionId: string;
  startedAt: string;
  lastActivityAt: string;
  /** Wenn ein Mitarbeiter in Flario den Chat übernommen hat, ist die KI stumm */
  humanTakeover: boolean;
  messages: ChatMessage[];
  /** Meta: Seite auf der der Chat gestartet wurde, User-Agent etc. */
  context?: {
    page?: string;
    userAgent?: string;
    referrer?: string;
  };
};

// In-Memory-Store für Mock-Modus (geht beim Server-Restart verloren,
// in Produktion übernimmt Flario die Persistenz).
const MOCK_CHAT_SESSIONS = new Map<string, ChatSession>();

/** Legt eine neue Chat-Session an bzw. bringt vorhandene zurück */
export async function upsertChatSession(input: {
  sessionId: string;
  context?: ChatSession["context"];
}): Promise<ChatSession> {
  if (useMockData()) {
    const existing = MOCK_CHAT_SESSIONS.get(input.sessionId);
    if (existing) {
      existing.lastActivityAt = new Date().toISOString();
      return existing;
    }
    const session: ChatSession = {
      sessionId: input.sessionId,
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      humanTakeover: false,
      messages: [],
      context: input.context,
    };
    MOCK_CHAT_SESSIONS.set(input.sessionId, session);
    return session;
  }
  return flarioFetch<ChatSession>(`/chat-sessions`, {
    method: "POST",
    body: JSON.stringify(input),
    next: { revalidate: 0 },
  });
}

/** Protokolliert Nachrichten (user, assistant) nach Flario */
export async function appendChatMessages(
  sessionId: string,
  messages: ChatMessage[],
): Promise<void> {
  if (useMockData()) {
    const s = MOCK_CHAT_SESSIONS.get(sessionId);
    if (s) {
      s.messages.push(...messages);
      s.lastActivityAt = new Date().toISOString();
    }
    return;
  }
  await flarioFetch<unknown>(
    `/chat-sessions/${encodeURIComponent(sessionId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ messages }),
      next: { revalidate: 0 },
    },
  );
}

/** Pollt Flario: gibt es neue Agent-Nachrichten / Takeover-Status? */
export async function pollChatSession(
  sessionId: string,
  sinceIso?: string,
): Promise<{
  humanTakeover: boolean;
  newMessages: ChatMessage[];
}> {
  if (useMockData()) {
    const s = MOCK_CHAT_SESSIONS.get(sessionId);
    if (!s) return { humanTakeover: false, newMessages: [] };
    const newMessages = sinceIso
      ? s.messages.filter((m) => m.role === "agent" && m.at > sinceIso)
      : s.messages.filter((m) => m.role === "agent");
    return { humanTakeover: s.humanTakeover, newMessages };
  }
  const params = new URLSearchParams();
  if (sinceIso) params.set("since", sinceIso);
  return flarioFetch<{ humanTakeover: boolean; newMessages: ChatMessage[] }>(
    `/chat-sessions/${encodeURIComponent(sessionId)}/poll?${params.toString()}`,
    { next: { revalidate: 0 } },
  );
}

/** DEV-Helper: Agent-Nachricht simulieren (nur Mock-Modus) */
export function _mockAgentReply(
  sessionId: string,
  content: string,
  agentName = "Büro VFR",
) {
  if (!useMockData()) return;
  const s = MOCK_CHAT_SESSIONS.get(sessionId);
  if (!s) return;
  s.humanTakeover = true;
  s.messages.push({
    role: "agent",
    content,
    at: new Date().toISOString(),
    agentName,
  });
  s.lastActivityAt = new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Newsletter — Opt-in, Opt-out, Sync nach CleverReach (via Flario)
// ---------------------------------------------------------------------------

export type NewsletterSubscriber = {
  email: string;
  firstName?: string;
  lastName?: string;
  topics?: string[];
  source?: string; // z.B. "footer-form", "info-veranstaltung"
  confirmedAt?: string;
  unsubscribedAt?: string;
  ipAddress?: string;
  userAgent?: string;
};

const MOCK_NEWSLETTER: Map<string, NewsletterSubscriber> = new Map();

/** Trage einen Abonnenten ein (Status: bestätigt, nach Double-Opt-In) */
export async function confirmNewsletterSubscriber(
  sub: NewsletterSubscriber,
): Promise<{ ok: true }> {
  if (useMockData()) {
    MOCK_NEWSLETTER.set(sub.email.toLowerCase(), {
      ...sub,
      confirmedAt: new Date().toISOString(),
    });
    return { ok: true };
  }
  await flarioFetch<unknown>(`/newsletter/subscribers`, {
    method: "POST",
    body: JSON.stringify({ ...sub, confirmedAt: new Date().toISOString() }),
    next: { revalidate: 0 },
  });
  return { ok: true };
}

/** Abmelden */
export async function unsubscribeNewsletter(email: string): Promise<{ ok: true }> {
  if (useMockData()) {
    const existing = MOCK_NEWSLETTER.get(email.toLowerCase());
    if (existing) {
      existing.unsubscribedAt = new Date().toISOString();
    }
    return { ok: true };
  }
  await flarioFetch<unknown>(
    `/newsletter/subscribers/${encodeURIComponent(email)}/unsubscribe`,
    { method: "POST", next: { revalidate: 0 } },
  );
  return { ok: true };
}

export async function submitAppointment(
  input: AppointmentInput,
): Promise<{ ok: true; appointmentId: string }> {
  if (useMockData()) {
    const id = `MOCK-APP-${Date.now()}`;
    MOCK_APPOINTMENTS.push({
      appointmentId: id,
      kind: input.kind,
      start: input.start,
      durationMin: input.durationMin,
      status: "booked",
      createdAt: new Date().toISOString(),
    });
    return { ok: true, appointmentId: id };
  }
  const data = await flarioFetch<{ appointmentId: string }>(`/appointments`, {
    method: "POST",
    body: JSON.stringify(input),
    next: { revalidate: 0 },
  });
  return { ok: true, appointmentId: data.appointmentId };
}
