# TODO — VFR Website

Stand: nach erstem Deploy auf `https://fahrlehrer-portal.de`

Alle offenen Punkte, wer dran ist, und was auf Server/Code gemacht werden muss.
Abgearbeitete Punkte werden hier abgehakt, damit du den Überblick behältst.

---

## 🔥 Priorität 1 — Blockiert echten Betrieb

### 1.1 Stripe Webhook einrichten

**Warum:** Nach einer Online-Zahlung weiß die Website sonst nicht, dass tatsächlich gezahlt wurde → keine Rechnung wird erzeugt.

- [ ] **In Stripe Dashboard** → Developers → Webhooks → **„Add endpoint"**
    - Endpoint-URL: `https://fahrlehrer-portal.de/api/stripe/webhook`
    - Events, die abonniert werden müssen:
        - `checkout.session.completed`
        - `invoice.paid`
        - `payment_intent.succeeded`
        - `payment_intent.payment_failed`
        - `charge.refunded`
- [ ] Nach dem Anlegen zeigt Stripe das **Signing Secret** (beginnt mit `whsec_...`)
- [ ] Auf Server eintragen:
    ```bash
    ssh clutch
    nano /opt/vfr-website/.env.production
    # STRIPE_WEBHOOK_SECRET=whsec_... eintragen
    cd /opt/vfr-website
    docker compose --env-file .env.production restart vfr_app
    ```
- [ ] **Test:** In Stripe Dashboard → Webhooks → Endpoint anklicken → „Send test webhook" → Response sollte `200 OK` sein

### 1.2 Resend für Mails — Domain + Key

**Warum:** Ohne Resend-Key kommen keine Buchungs-Bestätigungs-Mails, keine Rechnungen, keine Rückruf-Benachrichtigungen.

**Blocker:** DNS-Zugriff auf eine Mail-Domain — `vfr-gmbh.de` liegt noch beim alten Anbieter.

**Option A — über `fahrlehrer-portal.de` (sofort möglich):**
- [ ] Konto bei https://resend.com anlegen
- [ ] **Domain hinzufügen:** `fahrlehrer-portal.de` (oder `send.fahrlehrer-portal.de` als Sub-Domain)
- [ ] Resend zeigt 3 DNS-Records (TXT + MX + DKIM), die du bei deinem Domain-Registrar (IONOS) setzt
- [ ] Nach DNS-Propagation in Resend „Verify" klicken
- [ ] **API-Key erstellen**, in `.env.production` eintragen:
    ```
    RESEND_API_KEY=re_...
    MAIL_FROM="VFR Buchung <buchung@fahrlehrer-portal.de>"
    MAIL_REPLY_TO=info@fahrlehrer-portal.de
    ```
- [ ] Container-Restart
- [ ] **Test:** Testbuchung durchspielen → Mail sollte ankommen

**Option B — warten, bis `vfr-gmbh.de` beim neuen Anbieter ist:**
- [ ] Nach DNS-Übernahme Resend-Domain auf `vfr-gmbh.de` einrichten
- [ ] Mail-Adressen bleiben wie in `.env.production.example`: `buchung@vfr-gmbh.de`, `info@vfr-gmbh.de`

### 1.3 Flario-API — Zugang beschaffen

**Warum:** Aktuell Mock-Kurse. Für echte Termine, Buchungen und Interessenten-Verwaltung braucht's die Flario-API.

- [ ] **Mail an Flario-Support** mit folgenden Punkten:
    1. Bitte um API-Zugang für VFR-Website-Integration
    2. Anhang: `docs/flario-api-spec.md` (komplette Schnittstellen-Spec)
    3. Scopes: `courses:read`, `registrations:write`, `registrations:read`, `participants:write`, `appointments:write`, `callbacks:write`
    4. Webhook-Endpoint den Flario anrufen soll: `https://fahrlehrer-portal.de/api/flario/webhook`
- [ ] Flario liefert:
    - `FLARIO_API_BASE` — die Base-URL
    - `FLARIO_API_KEY` — Bearer-Token
    - `FLARIO_TENANT_ID` — VFR-Tenant
    - `FLARIO_WEBHOOK_SECRET` — Secret für Webhook-Verifikation
- [ ] In `.env.production` eintragen, Container-Restart
- [ ] In Flario-Oberfläche: pro Kurs „auf Website freigeben" aktivieren

---

## 📧 Priorität 2 — Code-Umbauten

### 2.1 Newsletter aus Flario-Integration entfernen

**Warum:** Newsletter läuft über externen Anbieter (noch zu klären welcher).

**Code-Änderungen:**
- [ ] [`lib/flario.ts`](../lib/flario.ts) — Zeilen 1066–1130 entfernen (Newsletter-Funktionen `confirmNewsletterSubscriber`, `unsubscribeNewsletter`, `MOCK_NEWSLETTER`, `NewsletterSubscriber`)
- [ ] [`app/newsletter/bestaetigen/[token]/page.tsx`](../app/newsletter/bestaetigen/[token]/page.tsx) — statt `confirmNewsletterSubscriber` direkt den Anbieter aufrufen
- [ ] [`app/newsletter/abmelden/[token]/page.tsx`](../app/newsletter/abmelden/[token]/page.tsx) — dito für `unsubscribeNewsletter`
- [ ] [`app/api/newsletter/subscribe/route.ts`](../app/api/newsletter/subscribe/route.ts) — am Ende Call auf Anbieter-API
- [ ] [`docs/flario-api-spec.md`](flario-api-spec.md) — Newsletter-Kapitel streichen

**Welcher Anbieter?** (bitte entscheiden)
- [ ] CleverReach
- [ ] Mailchimp
- [ ] Brevo
- [ ] rapidmail
- [ ] anderer: _______________

Je nach Wahl brauchen wir:
- API-Key
- Listen-ID
- Evtl. Double-Opt-In-Templates im Anbieter einrichten

### 2.2 Chatbot: Flario-Live-Übernahme-Endpoint

**Warum:** Code ruft aktuell `pollChatSession` + `upsertChatSession` gegen Flario. Wenn Flario kein Live-Chat-Feature hat, muss das raus oder ersetzt werden.

- [ ] Klären mit Flario: Gibt es Live-Chat-Spiegelung?
- [ ] Falls nein: Chat-Sessions in eigener Postgres speichern (die DB läuft bereits) + E-Mail an Büro bei neuer Nachricht

### 2.3 Admin-Bereich absichern

**Warum:** `/admin`-Seite ist aktuell per Basic-Auth gesichert — Passwort muss noch gesetzt werden.

- [ ] In `.env.production` setzen:
    ```
    ADMIN_BASIC_AUTH=ah:<starkes-passwort>
    ```
- [ ] Container-Restart
- [ ] Testen: https://fahrlehrer-portal.de/admin/anmeldungen → Login-Dialog

---

## 🛡️ Priorität 3 — Betrieb & Sicherheit

### 3.1 Tägliches Datenbank-Backup

- [ ] Cronjob auf Server einrichten:
    ```bash
    ssh clutch
    crontab -e
    # Zeile hinzufügen:
    15 3 * * * docker exec vfr_postgres pg_dump -U vfr vfr | gzip > /opt/vfr-website/backup/vfr-$(date +\%Y\%m\%d).sql.gz && find /opt/vfr-website/backup -name 'vfr-*.sql.gz' -mtime +30 -delete
    ```

### 3.2 Rechnungs-Archiv regelmäßig sichern

**Warum:** `/opt/vfr-website/invoices/` enthält alle PDFs — sollte wöchentlich extern gespeichert werden (IONOS Backup, Hetzner Storage Box, externer FTP, etc.).

- [ ] Backup-Ziel wählen
- [ ] Sync-Skript einrichten (rsync oder rclone)

### 3.3 Monitoring / Uptime-Check

**Warum:** Du willst wissen, wenn die Website down geht.

- [ ] Uptime-Robot (https://uptimerobot.com, kostenlos bis 50 Checks) oder Hetzner-Statuscake:
    - URL: `https://fahrlehrer-portal.de/`
    - Interval: 5 Minuten
    - Benachrichtigung: E-Mail an info@vfr-gmbh.de

### 3.4 Logs regelmäßig prüfen

- [ ] Container-Logs: `ssh clutch "cd /opt/vfr-website && docker compose logs --tail=200 vfr_app"`
- [ ] Caddy-Access-Log: `ssh clutch "docker exec clutch_caddy cat /data/vfr-access.log | tail -50"`
- [ ] fail2ban-Status: `ssh clutch "fail2ban-client status sshd"`

---

## 🌐 Priorität 4 — Domain & SEO

### 4.1 `vfr-gmbh.de` nachziehen (wenn Alt-Website abgelöst wird)

- [ ] DNS für `vfr-gmbh.de` auf 217.160.65.88 umstellen (A-Record `@` und `www`)
- [ ] Caddyfile erweitern:
    ```
    fahrlehrer-portal.de, vfr-gmbh.de { ... }
    www.fahrlehrer-portal.de, www.vfr-gmbh.de { redir https://fahrlehrer-portal.de{uri} permanent }
    ```
- [ ] Caddy-Reload: `docker exec clutch_caddy caddy reload --config /etc/caddy/Caddyfile`
- [ ] In `.env.production`: `NEXT_PUBLIC_SITE_URL=https://vfr-gmbh.de` (falls du vfr-gmbh.de als Haupt-Domain willst)

### 4.2 Google Search Console

- [ ] Domain verifizieren (TXT-Record oder HTML-Meta)
- [ ] Sitemap einreichen: `https://fahrlehrer-portal.de/sitemap.xml`
- [ ] Indexing-Status prüfen

### 4.3 Google Business Profile aktualisieren

- [ ] Website-URL auf `https://fahrlehrer-portal.de/` umstellen
- [ ] Nach vfr-gmbh.de-Umzug ggf. nochmal anpassen

### 4.4 Alte Backlinks umleiten

- [ ] Falls `vfr-gmbh.de` noch viele Backlinks hat → nach Domain-Übernahme 301-Redirect auf fahrlehrer-portal.de-Pendant einrichten (im Caddyfile)

---

## 🎨 Priorität 5 — Content & Design

### 5.1 Content-Pflege

- [ ] Impressum endgültig prüfen und freigeben
- [ ] AGB einfügen/aktualisieren
- [ ] Datenschutzerklärung an echte Dienste anpassen (Anthropic, Stripe, Resend, Flario erwähnen)
- [ ] Widerrufsbelehrung prüfen (Pflicht bei Online-Verkauf an Verbraucher)

### 5.2 Fotos & Medien

- [ ] IMG_2239 (Feuerwehr-Foto noch nicht konvertiert) → siehe TODO vom 11.11.
- [ ] Simulator-Foto (Degener 360 simDrive4) aufnehmen und einbauen
- [ ] Motor-Schnittmodell freistellen (per iPhone, Nutzer macht selbst)
- [ ] Mehr Unterrichtsfotos vom Dozenten am Modell für `/erleben`

### 5.3 Team-Seite

- [ ] Fotos vom Büro-Team
- [ ] Namen + Funktionen aktualisieren

---

## 🧪 Priorität 6 — Qualitäts-Tests nach Go-Live

Jeden Flow einmal durchspielen:

- [ ] Startseite lädt → alle Bilder sichtbar
- [ ] `/fahrlehrerausbildung/be` lädt → PDF-Downloads funktionieren (falls vorhanden)
- [ ] `/termine-preise` → Filter funktionieren, Kurs-Details öffnen
- [ ] Buchung durchklicken (mit Test-Daten) → Formular abschicken → Mail landet im Büro
- [ ] Beratungstermin-Anfrage senden → Mail kommt an
- [ ] Rückruf-Formular (Floating-Button „Anrufen → Rückruf") → Mail kommt an
- [ ] Newsletter-Anmeldung → Double-Opt-In-Mail kommt an → Link klickbar
- [ ] Chatbot: 3 verschiedene Fragen stellen → Antworten plausibel
- [ ] Feuerwehr-Seite lädt, alle Bilder da
- [ ] Impressionen-Seite: Masonry-Layout rendert korrekt
- [ ] Mobile-Ansicht (Smartphone): Navigation, Floating-Buttons, Chat-Blase

---

## 🔄 Deploy-Workflow (Referenz)

Code-Änderung → Deploy auf Server:

```bash
cd "/c/Users/ah/Documents/AI/VFR Website"

# Lokal paketieren und hochladen
tar --exclude=node_modules --exclude=.next --exclude=.git --exclude=.env --exclude=.env.local --exclude=.env.production --exclude=invoices -czf /tmp/vfr.tar.gz .
scp /tmp/vfr.tar.gz clutch:/opt/vfr-website/code.tar.gz

# Auf Server
ssh clutch
cd /opt/vfr-website
tar -xzf code.tar.gz && rm code.tar.gz
docker compose --env-file .env.production up -d --build
```

Oder einfacher (sobald Bash-SSH-Problem gelöst ist):
```bash
bash deploy.sh
```

---

## 📞 Bei Problemen

- **Website down?** → `ssh clutch "cd /opt/vfr-website && docker compose logs --tail=100 vfr_app"`
- **Caddy-Fehler?** → `ssh clutch "docker logs clutch_caddy --tail=100"`
- **DB-Problem?** → `ssh clutch "docker exec vfr_postgres psql -U vfr -c '\dt'"`
- **Alles neu starten:** `ssh clutch "cd /opt/vfr-website && docker compose --env-file .env.production restart"`

Details in [`docs/deployment.md`](deployment.md).
