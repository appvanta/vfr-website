# Flario ↔ VFR-Website Schnittstelle

**Zweck:** Technische Spezifikation für die Flario-Programmierer.
Dieses Dokument beschreibt alle Endpoints, Felder und Webhooks, die Flario
bereitstellen muss, damit die VFR-Website:

1. Kurse mit Preisen anzeigen kann (**nur die, die Flario freigegeben hat**)
2. Verbindliche Online-Anmeldungen inkl. Unterschrift annehmen kann
3. Zahlungen (ApplePay / Kreditkarte / Rechnung) annehmen und an Flario melden kann
4. Teilnehmerstatus synchron hält (angemeldet → bestätigt → im Kurs)

---

## 0. Übersicht (High-Level-Workflow)

```
 ┌────────────┐              ┌──────────────┐              ┌────────────┐
 │  Flario    │─ GET courses │   Website    │─ Buchung ──▶ │  Website   │
 │  (Backend) │◀─── (JSON) ──│  (Frontend)  │              │  /buchung  │
 └────────────┘              └──────────────┘              └────────────┘
       ▲                                                          │
       │                                                          ▼
       │                                                   ┌────────────┐
       │                                                   │  Stripe    │
       │                                                   │  (optional)│
       │                                                   └────────────┘
       │                                                          │
       │           POST /registrations                            │
       │◀─────────────────────────────────────────────────────────┘
       │
       │                   Büro bestätigt in Flario-Oberfläche
       │                   ▼
       │           PATCH  /registrations/:id/status = confirmed
       │                   Flario legt TN im Kurs an
       │
       │           (optional) Webhook „registration.updated“
       │────▶ Website → Mail an Kunde „Dein Platz ist bestätigt“
```

**Zwei Haupt-Richtungen:**
- **Website → Flario** = per HTTPS-API (REST, JSON)
- **Flario → Website** = per Webhook (optional, verbessert UX — nicht zwingend)

---

## 1. Authentifizierung

- **Mechanismus:** Bearer-Token im `Authorization`-Header
  - `Authorization: Bearer <FLARIO_API_KEY>`
- **Tenant-Header:** falls Flario multi-mandantenfähig ist:
  - `X-Tenant-Id: <TENANT_ID>` (für VFR: fester Wert)
- **Token-Scopes:** mindestens `courses:read`, `registrations:write`,
  `registrations:read`, `participants:write`
- **Transport:** nur über HTTPS, TLS 1.2+
- **Rate-Limit:** die Website ruft `GET /courses` max. 1× pro 5 Minuten
  ab (ISR-Cache), schreibende Requests nur bei Aktion durch Benutzer

---

## 2. Endpoints — Flario muss bereitstellen

### 2.1 `GET /courses` — Kurse öffentlich auflisten

Gibt **nur die Kurse zurück, die in Flario für die Website freigegeben sind**.
Nicht freigegebene Kurse tauchen auf der Website niemals auf.

**Query-Parameter (optional, Flario-seitig beliebig):**
- `category` — Filter auf Kategorie
- `onlyBookable=true` — nur buchbare Kurse

**Response (200):**
```json
{
  "courses": [
    {
      "id": "flario-course-id-12345",
      "externalRef": "BE-2026-01",
      "category": "ausbildung-be",
      "title": "Fahrlehrerausbildung Klasse BE",
      "subtitle": "12-Monats-Lehrgang",
      "description": "Komplette Ausbildung …",
      "startDate": "2026-04-15",
      "endDate": "2027-04-14",
      "durationDays": 365,
      "location": "Niederkassel",
      "priceCents": 895000,
      "vatExempt": true,
      "seatsTotal": 16,
      "seatsAvailable": 6,
      "bookable": true,
      "publicVisible": true,
      "fundingEligible": true,
      "paymentOptions": ["invoice", "card"],
      "updatedAt": "2026-11-10T09:00:00Z"
    }
  ]
}
```

**Pflichtfelder (fett):**

| Feld | Typ | Beschreibung |
|---|---|---|
| **id** | string | Flario-interne Kurs-ID (stabil) |
| externalRef | string | Lesbare Referenz z.B. „BE-2026-01" |
| **category** | enum | siehe Abschnitt 5 |
| **title** | string | Kurz-Titel |
| subtitle | string | Zusatz |
| description | string | 1–3 Sätze |
| **startDate** | ISO-Date | `YYYY-MM-DD` |
| endDate | ISO-Date | `YYYY-MM-DD` |
| durationDays | int | — |
| **location** | string | Standort |
| **priceCents** | int | Preis in Cent (0 = kostenlos) |
| **vatExempt** | bool | `true` = USt-befreit |
| **seatsTotal** | int | Gesamtplätze |
| **seatsAvailable** | int | freie Plätze |
| **bookable** | bool | darf Website Anmeldungen senden? |
| **publicVisible** | bool | darf Website den Kurs anzeigen? |
| fundingEligible | bool | Bildungsgutschein möglich? |
| paymentOptions | array | `["invoice"]` oder `["invoice","card"]` |
| updatedAt | ISO-DateTime | für Cache-Invalidierung |

> ⚠️ **publicVisible** ist der Schlüssel für euren Wunsch: „nicht alle Kurse
> sollen auf der Website erscheinen". Die Website ruft `GET /courses` ab und
> filtert clientseitig zusätzlich — Flario sollte aber bereits serverseitig
> nur `publicVisible: true` ausliefern, sonst lecken Daten.

---

### 2.2 `GET /courses/:id` — Einzelkurs

Gleicher Response-Body wie oben, aber ein einzelnes `Course`-Objekt (ohne
Hülle). Antwortet mit `404` wenn Kurs nicht existiert oder nicht
`publicVisible`.

---

### 2.3 `POST /registrations` — Neue Anmeldung annehmen

Website sendet nach Online-Formular + Email-Bestätigung (Double-Opt-In).
Eine Anmeldung kann **1-n Teilnehmer** enthalten (Fahrschulen können
mehrere Fahrlehrer gleichzeitig anmelden). Die Rechnungsadresse kann
abweichen (z.B. Fahrschule meldet an, Rechnung an die Firma).

**Request-Body:**
```json
{
  "courseId": "flario-course-id-12345",
  "participants": [
    {
      "salutation": "Herr",
      "firstName": "Max",
      "lastName": "Mustermann",
      "email": "max@example.de",
      "phone": "+49 221 12345678",
      "birthDate": "1995-03-14",
      "street": "Musterstraße 1",
      "zip": "53859",
      "city": "Niederkassel",
      "country": "DE",
      "licenses": [
        { "key": "be", "grantedDate": "2012-05-14" },
        { "key": "a",  "grantedDate": "2015-08-02" }
      ],
      "drivingLicenses": [
        { "key": "c",  "grantedDate": "2010-03-12" },
        { "key": "ce", "grantedDate": "2010-09-01" }
      ],
      "qualifications": [
        { "key": "ausbildungsfahrlehrer", "grantedYear": 2018 },
        { "key": "seminarleiter-asf", "grantedYear": 2020 }
      ]
    }
  ],
  "billing": {
    "company": "Fahrschule Mustermann GmbH",
    "salutation": "Herr",
    "firstName": "Max",
    "lastName": "Mustermann",
    "email": "rechnung@mustermann-fahrschule.de",
    "phone": "+49 221 12345678",
    "street": "Hauptstraße 5",
    "zip": "53859",
    "city": "Niederkassel",
    "country": "DE",
    "vatId": "DE123456789"
  },
  "contract": {
    "version": "2026-v1",
    "acceptedAgb": true,
    "acceptedWiderruf": true,
    "acceptedDatenschutz": true,
    "signature": {
      "format": "image/png;base64",
      "data": "",                    // leer bei Double-Opt-In (Email-Bestätigung)
      "signedAt": "2026-11-10T14:33:12Z",
      "ipAddress": "203.0.113.42",
      "userAgent": "Mozilla/5.0 …"
    }
  },
  "payment": {
    "method": "invoice",              // "card" | "applepay" | "invoice"
    "status": "pending",              // "pending" (Rechnung) | "paid" (Stripe ok)
    "amountCents": 1780000,           // GESAMT (price × Anzahl Teilnehmer)
    "stripePaymentIntentId": null,    // bei Direktzahlung gefüllt
    "invoiceNumber": "VFR-2026-0042"  // von Website generiert
  },
  "source": "website"
}
```

**Fahrlehrerlaubnis-Klassen-Enum (`licenses[].key`):**

| Wert | Bedeutung |
|---|---|
| `be` | Fahrlehrerlaubnis Klasse BE |
| `a`  | Fahrlehrerlaubnis Klasse A |
| `ce` | Fahrlehrerlaubnis Klasse CE |
| `de` | Fahrlehrerlaubnis Klasse DE |

`grantedDate` ist das Erteilungsdatum im Format `YYYY-MM-DD`, optional.

**Fahrerlaubnis-Enum (`drivingLicenses[].key`) — eigener Führerschein:**

| Wert | Bedeutung |
|---|---|
| `c`  | Führerschein Klasse C (LKW > 3,5 t) |
| `ce` | Führerschein Klasse CE (LKW mit Anhänger / Sattelzug) |
| `d`  | Führerschein Klasse D (Bus) |
| `de` | Führerschein Klasse DE (Bus mit Anhänger) |

Unterschied zu `licenses`: `licenses` ist die **Fahrlehrerlaubnis** (Berechtigung zu unterrichten),
`drivingLicenses` ist der **eigene Führerschein** (Berechtigung selber zu fahren).
Für die Fahrlehrerausbildung Klasse CE braucht man den CE-Führerschein als Voraussetzung.

**Zusatzqualifikations-Enum (`qualifications[].key`):**

| Wert | Bedeutung |
|---|---|
| `ausbildungsfahrlehrer` | Ausbildungsfahrlehrer:in |
| `seminarleiter-asf` | Seminarleiter:in ASF |
| `seminarleiter-fes` | Seminarleiter:in FES |
| `bwl` | BWL-Lehrgang Fahrschulinhaber |

`grantedYear` ist das Erteilungsjahr (optional, 4-stellig).

**Validierung Flario-seitig bei Mehrfach-Anmeldung:**
- `seatsAvailable >= participants.length`
- Pro Teilnehmer wird ein eigener TN-Datensatz angelegt
- Bei Bestätigung werden alle gemeinsam auf `confirmed` gesetzt
- Rechnung geht nur an `billing.email`, nicht an die einzelnen Teilnehmer

**Response (201):**
```json
{
  "registrationId": "flario-reg-id-abc123",
  "status": "pending_confirmation",
  "createdAt": "2026-11-10T14:33:15Z"
}
```

**Validierung Flario-seitig:**
- Kurs muss `bookable: true` sein
- `seatsAvailable > 0`
- Doppelanmeldung (gleiche Email + courseId) → `409 Conflict`
- Platz wird **nicht sofort reserviert**, sondern erst bei Status-Wechsel
  auf `confirmed` → andernfalls kann das Büro nachsteuern

---

### 2.4 `PATCH /registrations/:id/status` — Büro bestätigt / lehnt ab

Von Flario-UI aufgerufen (nicht von der Website). Bei Status `confirmed` legt
Flario den Teilnehmer als Kursteilnehmer an (eigene Flario-Logik).

**Request-Body:**
```json
{ "status": "confirmed" }
```
oder
```json
{ "status": "rejected", "reason": "Kurs bereits voll" }
```

**Status-Werte:**
- `pending_confirmation` — Anmeldung eingegangen, Büro muss prüfen
- `confirmed` — Büro bestätigt, TN ist im Kurs, Website schickt Bestätigungsmail
- `rejected` — abgelehnt, Website kann Kunde informieren
- `cancelled` — Kunde storniert (später, über Widerrufsflow)

---

### 2.5 `GET /appointment-slots` — Freie Beratungs-Termine

Für die Website-Terminbuchung (Beratung per Telefon, Video oder Vor-Ort —
nicht Kursbuchungen). Flario soll die freien Zeitfenster aus dem
Mitarbeiter-Kalender liefern.

**Query-Parameter (optional):**
- `kind=phone|video|onsite` — Filter auf Terminart
- `fromDate=YYYY-MM-DD`, `toDate=YYYY-MM-DD`

**Response (200):**
```json
{
  "slots": [
    {
      "start": "2026-11-18T09:00:00+01:00",
      "durationMin": 30,
      "availableFor": ["phone", "video", "onsite"]
    },
    {
      "start": "2026-11-18T09:30:00+01:00",
      "durationMin": 30,
      "availableFor": ["phone", "video"]
    }
  ]
}
```

Die Website zeigt dem Kunden daraus die passenden Slots nach Auswahl der
Beratungsart. Belegte Slots einfach nicht ausliefern.

### 2.6 `POST /appointments` — Beratungstermin anlegen

Die Website sendet nach Kunden-Buchung. Flario soll einen Kalendereintrag
beim entsprechenden Berater anlegen und den Slot für andere blockieren.

**Request-Body:**
```json
{
  "kind": "phone",
  "start": "2026-11-18T09:30:00+01:00",
  "durationMin": 30,
  "contact": {
    "salutation": "Frau",
    "firstName": "Anna",
    "lastName": "Beispiel",
    "email": "anna@example.de",
    "phone": "+49 221 12345678",
    "topic": "Klasse BE – Förderung",
    "message": "Habe Bildungsgutschein"
  },
  "source": "website"
}
```

**Response (201):**
```json
{
  "appointmentId": "flario-app-id-xyz789",
  "status": "booked"
}
```

**Bei Konflikt (Slot gerade von anderen gebucht) → `409 Conflict`:**
```json
{ "error": "slot_taken", "nextAvailable": "2026-11-18T10:00:00+01:00" }
```

**Terminart-Enum (`kind`):**

| Wert | Bedeutung |
|---|---|
| `phone` | Telefon-Beratung — Berater ruft Kunde an |
| `video` | Video-Konferenz — Link kommt per E-Mail |
| `onsite` | Vor-Ort-Termin in Niederkassel |

### 2.7 Live-Chat — vier Endpoints

Die Website betreibt einen KI-Chat (Claude), der Besucher auf Grundlage
der FAQ beantwortet. **Alle Nachrichten (vom Nutzer + Antworten der KI) werden
nach Flario gespiegelt**, damit das Büro mitlesen kann und bei Bedarf
übernehmen kann. Übernimmt ein Mitarbeiter, schaltet sich die KI stumm.

#### `POST /chat-sessions` — Session anlegen / anfrischen

Wird bei jedem ersten Submit aufgerufen. Idempotent — gibt bestehende Session
zurück wenn `sessionId` schon existiert.

```json
{
  "sessionId": "sess_abc123def",
  "context": {
    "page": "/fahrlehrerausbildung/be",
    "userAgent": "Mozilla/5.0 ...",
    "referrer": "https://google.de/..."
  }
}
```

**Response (200):**
```json
{
  "sessionId": "sess_abc123def",
  "startedAt": "2026-11-11T09:12:00Z",
  "lastActivityAt": "2026-11-11T09:12:00Z",
  "humanTakeover": false,
  "messages": []
}
```

#### `POST /chat-sessions/:sessionId/messages` — Nachrichten protokollieren

```json
{
  "messages": [
    { "role": "user", "content": "Was kostet die BE?", "at": "2026-11-11T09:12:05Z" },
    { "role": "assistant", "content": "Ca. 8.950 € …", "at": "2026-11-11T09:12:08Z" }
  ]
}
```

`role` ist `"user"`, `"assistant"` (KI), `"agent"` (Mensch aus Flario) oder
`"system"` (Status-Meldungen).

#### `GET /chat-sessions/:sessionId/poll?since=<ISO>` — Agent-Antworten abrufen

Website pollt alle 5 Sekunden wenn der Chat offen ist.

**Response (200):**
```json
{
  "humanTakeover": true,
  "newMessages": [
    {
      "role": "agent",
      "content": "Hallo, hier ist Andreas vom Büro — ich helfe gerne weiter.",
      "at": "2026-11-11T09:13:22Z",
      "agentName": "Andreas H."
    }
  ]
}
```

#### `GET /chat-sessions` — (Flario-interne Listen-Ansicht)

Für das Flario-UI: Liste aller aktiven/jüngsten Chat-Sessions mit letztem
Status, Nachrichten-Anzahl, letzter Besucher-Frage. So kann der Mitarbeiter
schnell sehen wo er einspringen sollte.

### Was Flario für das Mitlesen bauen muss

- **UI-Liste** aller offenen Chat-Sessions (letzte Aktivität, erste
  Besucher-Frage als Preview, Takeover-Status)
- **Detail-Ansicht** pro Session: Live mitlesen (Nachrichten werden per
  `POST /messages` reingepusht), eigene Antworten schreiben
- Wenn Mitarbeiter eine Nachricht sendet: in Session `humanTakeover = true`
  setzen, Nachricht mit `role: "agent"` speichern — die Website holt sie per
  Polling ab und zeigt sie
- Nach z.B. 30 Minuten Inaktivität: `humanTakeover = false` zurücksetzen,
  damit die KI wieder übernimmt

### 2.8 Newsletter-Endpoints

Die Website betreibt den Newsletter-Opt-in-Flow (Double-Opt-In über Email).
Flario speichert die Abonnenten und kann sie entweder selbst versenden
oder per API-Sync an CleverReach / Mailchimp durchreichen.

#### `POST /newsletter/subscribers` — Bestätigten Abonnenten anlegen

Wird aufgerufen nachdem der User den Bestätigungslink angeklickt hat.

```json
{
  "email": "max@example.de",
  "firstName": "Max",
  "lastName": "Mustermann",
  "source": "/fahrlehrerausbildung/be",
  "confirmedAt": "2026-11-11T10:12:00Z",
  "ipAddress": "203.0.113.42",
  "userAgent": "Mozilla/5.0 ..."
}
```

**Response (201):**
```json
{ "ok": true, "subscriberId": "sub_abc123" }
```

#### `POST /newsletter/subscribers/:email/unsubscribe`

Wird vom Abmelde-Link in der Mail aufgerufen.

**Response (200):** `{ "ok": true }`

#### `GET /newsletter/subscribers` — Listen-Abruf (Flario-intern)

Zum Export nach CleverReach bzw. zur direkten Verwendung in Flario.

### Was Flario mit den Daten tut

**Option A (einfach):** Flario speichert nur, CleverReach bleibt das
Versand-Tool. Flario synchronisiert periodisch an CleverReach per API
(CleverReach hat REST-API für Group-Management).

**Option B (eigenständig):** Flario baut Newsletter-Editor + versendet
per Resend/Mailgun. Siehe eigene Dokumentation.

### 2.9 `GET /registrations` — (optional, interne Admin-View)

Für den „Angemeldet"-Listenbereich der Website (falls das Büro **nicht** direkt
in Flario arbeitet, sondern über die Website-Admin). Kann später kommen.

---

## 3. Webhooks — Flario sendet an Website (optional, aber empfohlen)

**Zielendpoint (die Website stellt bereit):**
`POST https://www.vfr-gmbh.de/api/flario/webhook`

**Auth:** HMAC-Signatur im Header `X-Flario-Signature` über Request-Body,
Secret = `FLARIO_WEBHOOK_SECRET` (per Umweltvariable auf beiden Seiten gleich).

**Events, die Flario senden sollte:**

```json
{
  "event": "registration.confirmed",
  "registrationId": "flario-reg-id-abc123",
  "courseId": "flario-course-id-12345",
  "timestamp": "2026-11-10T15:00:00Z"
}
```

| Event | Website reagiert mit |
|---|---|
| `registration.confirmed` | Bestätigungs-Mail an Kunde senden |
| `registration.rejected` | Absage-Mail an Kunde senden |
| `course.updated` | ISR-Cache invalidieren |
| `course.seats_changed` | ISR-Cache invalidieren |

Ohne Webhooks funktioniert die Website — die Mails müssten dann aus Flario
heraus verschickt werden.

---

## 4. Payment-Flow — Details

Die Zahlungsabwicklung läuft **nicht über Flario**, sondern über Stripe (Website).
Flario bekommt nur das Ergebnis.

```
Kunde klickt „Jetzt zahlen"
   │
   ▼
Website → Stripe Checkout Session (ApplePay, GooglePay, Karte, SEPA)
   │
   ▼
Stripe Webhook „payment_intent.succeeded"
   │
   ▼
Website → POST /registrations an Flario
       mit payment.status = "paid"
       + Rechnungs-PDF per Mail an Kunde
```

Bei **Rechnung-später** entfällt der Stripe-Schritt, die Anmeldung geht direkt
nach Flario mit `payment.status = "pending"`. Büro schickt die Rechnung manuell
raus oder nutzt Flarios Rechnungsmodul.

---

## 5. Kategorie-Enum (von Website verwendet)

| Wert | Bedeutung |
|---|---|
| `ausbildung-be` | Fahrlehrerausbildung Klasse BE |
| `ausbildung-a` | Fahrlehrerausbildung Klasse A (Motorrad) |
| `ausbildung-ce` | Fahrlehrerausbildung Klasse CE (LKW) |
| `ausbildung-de` | Fahrlehrerausbildung Klasse DE (Bus) |
| `fortbildung` | § 53 FahrlG Fortbildungen (Allgemein 1T/3T, ASF, etc.) |
| `weiterbildung` | Seminarleiter, BWL, Ausbilder etc. |
| `ladekran` | Ladekran-Ausbildung (DGUV 309-003) |
| `flurfoerderzeuge` | Flurförderzeuge / Gabelstapler (DGUV 308-001) |
| `info-veranstaltung` | kostenlose Kennenlern-Termine |

Falls Flario andere Kategorien verwendet, bitte Mapping-Tabelle mitliefern.

---

## 6. .env-Variablen auf Website-Seite

```env
# Flario
FLARIO_API_BASE=https://api.flario.de/v1
FLARIO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
FLARIO_TENANT_ID=vfr-niederkassel
FLARIO_WEBHOOK_SECRET=yyyyyyyyyyyyyyyyyyyyyyyy

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email (Resend)
RESEND_API_KEY=re_...
MAIL_FROM="VFR <anmeldung@vfr-gmbh.de>"
MAIL_CC_BUERO=anmeldung@vfr-gmbh.de
```

---

## 7. Test- & Staging-Umgebung

- Flario stellt eine `staging.flario.de` oder `api.flario.de/v1-sandbox` mit
  Testdaten bereit
- Website-Seite liest aus `.env.staging` die Sandbox-URL
- Ein Test-Kurs mit `bookable: true`, `publicVisible: true`, Preis 1 €, muss
  einmal durch den kompletten Flow laufen (Anmeldung + Stripe-Testkarte)

---

## 8. Offene Entscheidungen — **bitte Flario-Team klären**

- [ ] Gibt es `publicVisible` in Flario schon, oder muss das Feld neu angelegt werden?
- [ ] Verwendet Flario SEPA-Lastschrift intern? Falls ja, kann die Website das anbieten?
- [ ] Rechnungserstellung: läuft die über Flario oder über die Website? (Empfehlung: Website generiert Rechnung sofort, Flario bekommt PDF als Download-URL mit)
- [ ] Welches Format haben Flario-Kurs-IDs? (UUID / Integer / String?)
- [ ] Gibt es ein Testsystem?
- [ ] Welche Felder sind in Flario verpflichtend und müssen beim Anmelde-Formular abgefragt werden?

---

## 9. Was die Website-Seite bereits vorbereitet hat

- `lib/flario.ts` — Adapter mit identischer Public-API (aktuell Mock-Daten)
- `app/api/booking/checkout/route.ts` — Stripe-Checkout-Session
- `app/api/stripe/webhook/route.ts` — Stripe-Webhook, der nach Zahlung
  Flario informiert
- `app/api/flario/webhook/route.ts` — **neu, wird gebaut** für eingehende
  Flario-Webhooks
- `app/buchung/[courseId]/page.tsx` — Buchungsformular
- `components/Signature.tsx` — **neu, wird gebaut** für Online-Unterschrift
- `lib/invoice.ts` — PDF-Rechnungsgenerator (existiert)
- `lib/email.ts` + `lib/emailTemplates.ts` — Bestätigungs- und
  Rechnungsmails (existiert)

Sobald Flario die Endpoints bereitstellt, sind auf Website-Seite nur
`.env`-Werte einzutragen und `useMockData()` in `lib/flario.ts` liefert `false`.

---

**Ansprechpartner Website:** Andreas Hollenbach · ah@vfr-gmbh.de
**Dokument-Version:** 2026-11-10
