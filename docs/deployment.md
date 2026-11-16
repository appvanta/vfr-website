# Deployment — VFR Website

Die Website läuft als Docker-Container auf dem clutch-Server (IONOS-VPS, 217.160.65.88) **parallel** zu Clutch-IT. Eigene Container, eigene Datenbank, eigener Caddy-Vhost — bei Problemen in 30 Min woanders deploybar.

**Domain (Start):** fahrlehrer-portal.de
**Domain (später):** vfr-gmbh.de — wenn die alte Homepage dort abgelöst wird.

---

## 1. Einmal-Setup (nur beim ersten Deploy)

### 1.1 DNS vorbereiten

Beim Domain-Registrar (IONOS) für **fahrlehrer-portal.de**:

| Typ | Name | Wert |
|---|---|---|
| A | @ | 217.160.65.88 |
| A | www | 217.160.65.88 |
| AAAA | @ | *(IPv6 des Servers, optional)* |

TTL auf 300 s während Setup, danach auf 3600 s hochdrehen.

**Prüfen:** `nslookup fahrlehrer-portal.de 8.8.8.8` → sollte 217.160.65.88 zurückgeben, bevor der nächste Schritt gemacht wird. Sonst holt Caddy kein Let's-Encrypt-Zertifikat.

### 1.2 Server-Verzeichnis anlegen

```bash
ssh clutch
mkdir -p /opt/vfr-website/invoices /opt/vfr-website/backup
```

### 1.3 `.env.production` auf dem Server anlegen

Lokal `.env.production.example` kopieren, Werte eintragen, dann hochladen:

```bash
scp .env.production clutch:/opt/vfr-website/.env.production
ssh clutch "chmod 600 /opt/vfr-website/.env.production"
```

**Pflicht-Variablen bevor der erste Deploy startet:**

- `POSTGRES_PASSWORD` — frei wählbares starkes Passwort (min. 24 Zeichen). **Einmal setzen, danach nicht mehr ändern**, sonst muss die DB neu aufgesetzt werden.
- `REGISTRATION_TOKEN_SECRET` — zufällige 32+ Zeichen für signierte Tokens (`openssl rand -hex 32`)

**Pflicht-Variablen für vollen Funktionsumfang:**

- `ANTHROPIC_API_KEY` — sonst läuft der Chatbot nur mit Fallback-Antwort
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — sonst kein Checkout möglich
- `RESEND_API_KEY` — sonst keine Buchungs-Mails
- `FLARIO_API_BASE` + `FLARIO_API_KEY` — sonst keine echten Termine (läuft im Mock-Modus)

### 1.4 Caddyfile ergänzen

Den Inhalt von [`deploy/Caddyfile.vfr-snippet`](../deploy/Caddyfile.vfr-snippet) an die bestehende `/opt/clutch-it/Caddyfile` auf dem Server anhängen:

```bash
ssh clutch
cat >> /opt/clutch-it/Caddyfile <<'EOF'
# ... Inhalt von deploy/Caddyfile.vfr-snippet ...
EOF
```

Noch **nicht** neu laden — Caddy würde versuchen, sofort ein Zertifikat zu holen und das schlägt fehl, solange der VFR-Container noch nicht läuft. Caddy-Reload erfolgt nach dem ersten erfolgreichen Deploy.

### 1.5 Ersten Deploy ausführen

Lokal:

```bash
bash deploy.sh
```

Das Skript:
1. Paketiert den Quellcode (ohne `node_modules`, `.env`, `.git`)
2. Lädt per scp hoch nach `/opt/vfr-website/`
3. Baut das Docker-Image auf dem Server (ca. 3–5 Min beim ersten Mal)
4. Startet `vfr_app` und `vfr_postgres`
5. Lädt Caddy neu (holt Let's-Encrypt-Zertifikat)

Erfolg prüfen:

```bash
ssh clutch "docker ps | grep vfr"
curl -I https://fahrlehrer-portal.de/
```

---

## 2. Normaler Deploy (nach Code-Änderungen)

```bash
bash deploy.sh                 # baut neu, Downtime ~5 Sekunden
bash deploy.sh --no-build      # nur Code-Upload, kein Rebuild (nur bei statischen Änderungen)
bash deploy.sh --logs          # zeigt Live-Logs nach dem Deploy
```

---

## 3. Betrieb

### Logs

```bash
ssh clutch "cd /opt/vfr-website && docker compose logs -f --tail=200 vfr_app"
ssh clutch "cd /opt/vfr-website && docker compose logs -f vfr_postgres"
```

### Status / Restart / Stop

```bash
ssh clutch "cd /opt/vfr-website && docker compose ps"
ssh clutch "cd /opt/vfr-website && docker compose restart vfr_app"
ssh clutch "cd /opt/vfr-website && docker compose down"
```

### Datenbank-Backup

```bash
ssh clutch "docker exec vfr_postgres pg_dump -U vfr vfr | gzip > /opt/vfr-website/backup/vfr-\$(date +%Y%m%d-%H%M).sql.gz"
```

Empfehlung: Cronjob auf dem Server für tägliches Backup — siehe Kapitel 5.

### Rechnungs-PDFs

Liegen persistent unter `/opt/vfr-website/invoices/` auf dem Server. Werden bei jedem Deploy **nicht** überschrieben.

---

## 4. vfr-gmbh.de später nachziehen

Sobald die alte Homepage auf vfr-gmbh.de abgeschaltet werden kann:

1. DNS für `vfr-gmbh.de` auf `217.160.65.88` umstellen (A-Record `@` und `www`)
2. Den Caddyfile-Block in `/opt/clutch-it/Caddyfile` erweitern:
   ```
   fahrlehrer-portal.de, vfr-gmbh.de {
       ...
   }
   www.fahrlehrer-portal.de, www.vfr-gmbh.de {
       redir https://fahrlehrer-portal.de{uri} permanent
   }
   ```
3. Caddy neu laden:
   ```bash
   ssh clutch "docker exec clutch_caddy caddy reload --config /etc/caddy/Caddyfile"
   ```

Alternativ beide Domains als separate Blöcke führen, falls unterschiedliches Verhalten gewünscht ist.

---

## 5. Backups (empfohlen)

Cronjob auf dem Server, täglich 03:15 Uhr:

```bash
ssh clutch "crontab -e"
```

Zeile hinzufügen:

```cron
15 3 * * * docker exec vfr_postgres pg_dump -U vfr vfr | gzip > /opt/vfr-website/backup/vfr-$(date +\%Y\%m\%d).sql.gz && find /opt/vfr-website/backup -name 'vfr-*.sql.gz' -mtime +30 -delete
```

(Hält 30 Tage Backups.)

Zusätzlich die `invoices/` und `.env.production` extern sichern (z. B. Hetzner Storage Box, IONOS-Backup).

---

## 6. Umzug auf eigenen Server (falls Clutch mal getrennt werden soll)

1. Auf neuem Server: Docker + Caddy installieren
2. `/opt/vfr-website/` komplett rsync-en:
   ```bash
   rsync -avz clutch:/opt/vfr-website/ new-server:/opt/vfr-website/
   ```
3. DB-Dump + Restore:
   ```bash
   ssh clutch "docker exec vfr_postgres pg_dump -U vfr vfr | gzip" | ssh new-server "gunzip | docker exec -i vfr_postgres psql -U vfr vfr"
   ```
4. `docker compose up -d` auf dem neuen Server
5. DNS umstellen

Dauer realistisch: 30–60 Min.

---

## 7. Troubleshooting

### Website kommt nach Deploy nicht hoch

```bash
ssh clutch "cd /opt/vfr-website && docker compose logs --tail=100 vfr_app"
```

Häufigste Ursachen:
- `.env.production` fehlt oder Pflicht-Variable nicht gesetzt → Logs sagen welche
- Postgres noch nicht ready → Container restartet sich selbst, 20–30 Sek. warten
- Build-Fehler → lokal `npm run build` testen

### Caddy liefert "no such host" oder 502

- DNS noch nicht propagiert → `nslookup fahrlehrer-portal.de 8.8.8.8` prüfen
- VFR-Container läuft nicht → `docker ps` auf Server prüfen
- Netzwerk fehlt → `docker network ls | grep clutch-it_clutch_net`

### Let's-Encrypt klappt nicht

```bash
ssh clutch "docker logs clutch_caddy --tail=100 | grep -i 'error\|fahrlehrer'"
```

Meistens: A-Record zeigt noch nicht auf 217.160.65.88, oder Port 80/443 blockiert. Caddy versucht alle 60 Sek erneut.

---

## 8. Dateien-Übersicht

| Datei | Zweck |
|---|---|
| `Dockerfile` | Multi-stage Build für Next.js standalone |
| `.dockerignore` | Was nicht ins Image soll |
| `docker-compose.yml` | Container-Stack (App + Postgres) |
| `.env.production.example` | Template für Produktions-ENV |
| `deploy.sh` | Lokal → Server Deploy-Skript |
| `deploy/Caddyfile.vfr-snippet` | Vhost für Caddy auf dem Server |
| `docs/deployment.md` | Dieses Dokument |
