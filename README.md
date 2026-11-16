# VFR Website – Verkehrsfachschule Rheinland GmbH

Neue Website mit Online-Kursbuchung, Stripe-Zahlung (PayPal + Kreditkarte +
SEPA), automatischer PDF-Rechnung und Flario-Anbindung.

## Tech-Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS mit VFR-Branding (`vfr-*` Farbpalette + Accent-Rot)
- **Daten:** Flario-API (mit Mock-Fallback für lokale Entwicklung)
- **Zahlung:** Stripe Checkout (Karte, PayPal, SEPA, Klarna)
- **E-Mail:** Resend
- **Rechnungen:** `@react-pdf/renderer` + Datei-Archiv unter `./invoices`
- **Formulare:** react-hook-form + zod

## Erste Schritte

```powershell
# 1) Abhängigkeiten installieren
npm install

# 2) Umgebungsvariablen anlegen
copy .env.example .env.local
# Werte in .env.local eintragen (siehe Abschnitt unten)

# 3) Dev-Server starten
npm run dev
# -> http://localhost:3000
```

Ohne `.env.local` läuft die Seite mit Mock-Kursen und ohne Live-Zahlung — ideal
um alle Seiten und das UI zu prüfen.

## Umgebungsvariablen (.env.local)

Siehe `.env.example`. Die wichtigsten Variablen:

| Variable | Zweck |
| --- | --- |
| `FLARIO_API_BASE`, `FLARIO_API_KEY` | Live-Kursdaten aus Flario |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Zahlung |
| `STRIPE_WEBHOOK_SECRET` | Signaturprüfung für Webhooks |
| `RESEND_API_KEY`, `MAIL_FROM` | E-Mail-Versand |
| `INVOICE_*` | Rechnungsnummern-Generator |

## Flario-Anbindung

Datei: `lib/flario.ts`

Solange `FLARIO_API_KEY` nicht gesetzt ist, liefert der Adapter Mock-Kurse.
Sobald die echte API steht, müssen ggf. die Endpoint-Pfade (`/courses`,
`/courses/:id`, `/bookings`) und die Response-Form an die Flario-API-Doku
angepasst werden — beide Stellen sind im Code mit `TODO` markiert.

## Stripe-Webhook lokal testen

```powershell
# Stripe CLI einmalig installieren (https://stripe.com/docs/stripe-cli)
stripe login

# Webhook auf lokalen Server weiterleiten
stripe listen --forward-to localhost:3000/api/stripe/webhook

# WICHTIG: das im Terminal angezeigte "whsec_..." in .env.local als
# STRIPE_WEBHOOK_SECRET eintragen.

# Test-Zahlung auslösen
stripe trigger checkout.session.completed
```

In Produktion: Webhook-Endpoint in Stripe Dashboard anlegen:
- URL: `https://www.vfr-gmbh.de/api/stripe/webhook`
- Events: `checkout.session.completed`

## Rechnungen

- Werden automatisch nach erfolgreicher Zahlung erzeugt
- Als PDF an Kunde per E-Mail (Anhang)
- Werden im Verzeichnis `INVOICE_ARCHIVE_DIR` (default: `./invoices`) archiviert
- Pro Rechnung wird ein `.json`-Sidecar gespeichert für die DATEV-/Buchhaltungs-Übernahme
- Nummern werden über `invoices/.counter.json` fortlaufend gezählt

### Wichtig für Produktion

Der Datei-basierte Counter funktioniert für eine einzelne Server-Instanz.
Für Serverless oder Multi-Instance-Setups bitte auf eine echte DB
(Postgres/SQLite/KV) umstellen — siehe `lib/invoiceNumber.ts`.

## Buchungs-Flow (Übersicht)

```
Termine & Preise → Kurs auswählen → /buchung/[courseId]
   ↓
Formular ausfüllen (Daten + AGB + Datenschutz)
   ↓
POST /api/booking/checkout → Stripe Checkout Session
   ↓
Stripe Hosted Payment Page (PayPal / Karte / SEPA)
   ↓
Erfolg → /buchung/erfolg
   ↓
Stripe Webhook → /api/stripe/webhook
   - Rechnungsnummer ziehen
   - PDF erzeugen
   - PDF an Kunde mailen (mit Bestätigung)
   - PDF + JSON im Archiv ablegen
   - Buchung an Flario senden
```

## Deployment

### Empfehlung: Vercel

```powershell
# einmalig:
npm install -g vercel
vercel login
vercel link

# Variablen setzen
vercel env add FLARIO_API_KEY
vercel env add STRIPE_SECRET_KEY
# usw.

# Deploy
vercel --prod
```

### Alternativen
- **Netlify**, **Render**, **Hetzner** mit Node.js 20+ Container
- Bei Self-Hosting den `./invoices`-Pfad in ein persistentes Volume mappen

## Domain umziehen

Aktuell läuft `www.vfr-gmbh.de` per 301-Redirect auf
`www.verkehrsfachschule-rheinland.de`. Beim Go-Live:

1. DNS für `vfr-gmbh.de` und `www.vfr-gmbh.de` auf neue Host-IP / Vercel zeigen lassen
2. Den 301 entfernen / auf neue Domain umbiegen
3. 301-Redirects von alten Pfaden auf neue ergänzen (`next.config.ts → redirects`)

## SEO

- Metadata pro Seite (Title, Description, Canonical)
- Sitemap unter `/sitemap.xml`, Robots unter `/robots.txt`
- JSON-LD `EducationalOrganization` global, `Course` pro Kurs verfügbar
  (`components/CourseJsonLd.tsx` einbauen wo gewünscht)
- Sprache: `lang="de"`
- Mobile-first, semantisches HTML

## Was noch fehlt (offene Punkte)

- [ ] **Echte Flario-Credentials** → Endpoint-Pfade in `lib/flario.ts` finalisieren
- [ ] **Stripe Live-Keys** → `.env` mit Production-Keys
- [ ] **Resend Domain verifizieren** für `buchung@vfr-gmbh.de`
- [ ] **Echte Team-Fotos und Impressionen-Bilder** einbinden
- [ ] **Texte im Impressum** vervollständigen (HRB, USt-IdNr., Geschäftsführer)
- [ ] **AGB rechtssicher prüfen lassen**
- [ ] **Storno-Logik / Buchungs-Verwaltung** (z.B. nach Bildungsgutschein-Anfrage)
- [ ] **Cookie-Banner** falls Tracking eingebaut wird
- [ ] **Newsletter-Anbindung** (z.B. Brevo / Mailchimp)
- [ ] **Persistent storage** für Rechnungs-Counter und Archiv in Produktion

## Skripte

| Befehl | Beschreibung |
| --- | --- |
| `npm run dev` | Entwicklungs-Server (Port 3000) |
| `npm run build` | Produktions-Build |
| `npm run start` | Build-Output starten |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript ohne Emit |
