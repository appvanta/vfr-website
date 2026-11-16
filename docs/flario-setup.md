# Flario-Verbindung einrichten

So wird aus den Mock-Daten eine echte Flario-Anbindung — in 5 Schritten.

---

## Schritt 1 — Flario-Spec an Flario geben

Datei: [`docs/flario-api-spec.md`](./flario-api-spec.md)

Das ist das Dokument, das die Flario-Programmierer brauchen. Es beschreibt
exakt welche Endpoints und Felder sie bauen müssen. Am Ende stehen die
offenen Fragen, die Flario klären muss.

---

## Schritt 2 — Credentials bei Flario anfordern

Du brauchst von Flario:

- **API-Base-URL** (z.B. `https://api.flario.de/v1`)
- **API-Key** (Bearer-Token)
- **Tenant-ID** (falls Multi-Mandant)
- **Webhook-Secret** (einigt euch auf eine lange zufällige Zeichenkette)

---

## Schritt 3 — Environment-Variablen setzen

Datei `.env.local` (lokal für Entwicklung) bzw. in Vercel/Hosting
(für Produktion):

```env
# ── Flario ─────────────────────────────────────────────
FLARIO_API_BASE=https://api.flario.de/v1
FLARIO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
FLARIO_TENANT_ID=vfr-niederkassel
FLARIO_WEBHOOK_SECRET=lange-zufaellige-zeichenkette-hier

# ── Email-Bestätigungs-Token (Double-Opt-In) ──────────
# Fällt zurück auf FLARIO_WEBHOOK_SECRET, wenn nicht gesetzt
REGISTRATION_TOKEN_SECRET=andere-zufaellige-zeichenkette

# ── Stripe (Zahlung) ───────────────────────────────────
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# ── E-Mail (Resend) ────────────────────────────────────
RESEND_API_KEY=re_xxx
MAIL_FROM=VFR <anmeldung@vfr-gmbh.de>
MAIL_REPLY_TO=info@vfr-gmbh.de
MAIL_CC_BUERO=anmeldung@vfr-gmbh.de

# ── Basis-URL der Website (für Bestätigungslinks in Mails) ─
NEXT_PUBLIC_SITE_URL=https://www.vfr-gmbh.de

# ── KI-Chat (Anthropic Claude) ─────────────────────────
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_CHAT_MODEL=claude-haiku-5-5

# ── Admin-Zugang Website ───────────────────────────────
ADMIN_BASIC_AUTH=admin:einSichereresPasswort
```

### KI-Chat aktivieren

Der Chat ist bereits in die Website integriert (unten links) und nutzt
Claude Haiku von Anthropic. Ohne `ANTHROPIC_API_KEY` zeigt er dem User
eine freundliche Fallback-Nachricht ("Bitte Kontaktformular nutzen").

**Setup:**
1. Account auf [console.anthropic.com](https://console.anthropic.com) erstellen
2. API-Key erzeugen → in `.env.local` bzw. Vercel-Variables eintragen
3. Erwartete Kosten bei Haiku: ~2–8 ¢ pro Chat-Session (~500 Tokens)

**Guardrails im System-Prompt** (siehe `app/api/chat/route.ts`):
- Keine Rechtsberatung, nur allgemeine Infos
- Nur aus hinterlegtem FAQ-Material antworten
- Bei Unsicherheit auf Beratungstermin verweisen

**Weitere Fragen pflegen:** Datei `lib/faq.ts` — neue Einträge werden
automatisch im FAQ-Accordion UND im Chat-Wissen aktiv.

Sobald `FLARIO_API_BASE` und `FLARIO_API_KEY` gesetzt sind, schaltet die
Website automatisch von Mock- auf Echt-Daten um.

---

## Schritt 4 — Webhooks einrichten

### Flario → Website

In Flario-Admin einen Webhook-Receiver eintragen:

- **URL:** `https://www.vfr-gmbh.de/api/flario/webhook`
- **Events:**
  - `registration.confirmed`
  - `registration.rejected`
  - `course.updated`
  - `course.seats_changed`
- **Secret:** gleicher Wert wie `FLARIO_WEBHOOK_SECRET`
- **Signatur-Header:** `X-Flario-Signature` (HMAC-SHA256, hex)

### Stripe → Website (bereits konfiguriert)

- **URL:** `https://www.vfr-gmbh.de/api/stripe/webhook`
- **Events:** `checkout.session.completed`, `payment_intent.succeeded`

---

## Schritt 5 — Test-Durchlauf

1. In Flario-Testsystem einen Kurs anlegen mit:
   - `publicVisible: true`
   - `bookable: true`
   - `priceCents: 100` (1 €)
2. Website `/termine-preise` öffnen → Kurs muss erscheinen
3. Buchungs-Flow durchspielen:
   - Formular ausfüllen, Vertrag lesen, Checkboxen setzen
   - **Weg A (Stripe):** Testkarte `4242 4242 4242 4242` nutzen
     → Nach Bezahlung muss Anmeldung in Flario auftauchen mit
     Status `pending_confirmation` und `payment.status = "paid"`
   - **Weg B (Rechnung, Double-Opt-In):** absenden
     → Bestätigungs-Email landet im Postfach
     → Klick auf den Bestätigungslink
     → Erst dann wird Anmeldung an Flario gesendet mit
     Status `pending_confirmation`, `payment.status = "pending"`
4. In Flario-Admin Status auf `confirmed` setzen
5. Website bekommt Webhook, schickt Bestätigungsmail
6. Teilnehmer ist im Kurs angelegt

---

## Was die Website bereits kann (auch ohne Flario-Anbindung)

Alle folgenden Dateien funktionieren schon mit Mock-Daten — so kannst du
den Flow jetzt schon klicken:

| Datei | Funktion |
|---|---|
| `lib/flario.ts` | API-Adapter inkl. `publicVisible`-Filter |
| `components/BookingForm.tsx` | Formular mit Vertrag + Unterschrift + 2 Zahlungswegen |
| `lib/confirmToken.ts` | HMAC-signierte Bestätigungs-Tokens |
| `app/api/registration/submit/route.ts` | Rechnung-später + Email-Versand |
| `app/buchung/check-email/page.tsx` | Zwischenseite „Prüfe dein Postfach" |
| `app/buchung/bestaetigen/[token]/page.tsx` | Confirm-Link → Flario-Submit |
| `app/api/booking/checkout/route.ts` | Stripe-Checkout (existiert) |
| `app/api/stripe/webhook/route.ts` | Zahlungsbestätigung (existiert) |
| `app/api/flario/webhook/route.ts` | Flario-Webhook-Empfänger (HMAC-geprüft) |
| `app/admin/anmeldungen/page.tsx` | Interne Übersicht aller Anmeldungen |

---

## Admin-Oberfläche aufrufen

- **URL:** `https://www.vfr-gmbh.de/admin/anmeldungen`
- **Login:** Browser-Basic-Auth, Zugangsdaten aus `ADMIN_BASIC_AUTH`

Für die Produktion empfohlen: statt Basic-Auth ein richtiges Login
(z.B. NextAuth mit Email-Magic-Link), sobald mehr als 1–2 Personen das
nutzen. Vorerst reicht Basic-Auth.

---

## Offene Punkte vor Live-Start

- [ ] Flario liefert Endpoints gemäß `flario-api-spec.md`
- [ ] Stripe Live-Keys (aktuell nur Test-Keys)
- [ ] Rechtstexte final (Impressum, AGB, Datenschutz, Widerruf)
- [ ] Mail-Templates testen (Resend Live-Domain)
- [ ] DSGVO-Check: Unterschrift-Daten (IP, UA) werden an Flario übertragen
- [ ] Preis-Freigabe: welche Kurse `publicVisible: true` sein sollen

---

## Fehlersuche

**Buchung geht nicht durch:** Server-Logs prüfen
(`npm run dev` oder Vercel-Logs).

**Flario-Webhook kommt nicht an:** `FLARIO_WEBHOOK_SECRET` muss auf
beiden Seiten identisch sein. Signatur im Header `X-Flario-Signature`
ist HMAC-SHA256 über den Raw-Body, hexadezimal.

**Kurs taucht nicht auf:** `publicVisible` prüfen — der Default-Filter in
`listCourses()` blendet alles mit `publicVisible: false` aus.

**Stripe-Webhook ohne Flario-Weiterleitung:** `app/api/stripe/webhook/route.ts`
ruft am Ende `submitRegistration()` auf. Wenn `FLARIO_API_KEY` fehlt,
schreibt er nur in die Mock-Liste. Das Verhalten ist by design.
