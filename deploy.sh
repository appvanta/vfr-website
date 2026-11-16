#!/usr/bin/env bash
#
# VFR Website — Deploy nach clutch-Server
#
# Workflow:
#   1. Lokal: Quellcode paketieren (ohne node_modules / .next / .env*)
#   2. Upload per scp nach /opt/vfr-website/ auf 217.160.65.88
#   3. Entpacken, docker compose build, docker compose up -d
#
# Voraussetzungen:
#   - SSH-Host "clutch" im ~/.ssh/config (ist schon konfiguriert)
#   - /opt/vfr-website/.env.production auf Server existiert und ist gefüllt
#   - Caddyfile-Snippet in /opt/clutch-it/Caddyfile eingetragen
#
# Benutzung:
#   bash deploy.sh                  # normaler Deploy
#   bash deploy.sh --no-build       # nur uploaden, nicht neu bauen
#   bash deploy.sh --logs           # Live-Logs nach dem Deploy

set -euo pipefail

SERVER_HOST="clutch"
SERVER_DIR="/opt/vfr-website"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"
TS="$(date +%Y%m%d-%H%M%S)"
ARCHIVE="vfr-website-${TS}.tar.gz"

NO_BUILD=0
SHOW_LOGS=0
for arg in "$@"; do
  case "$arg" in
    --no-build) NO_BUILD=1 ;;
    --logs)     SHOW_LOGS=1 ;;
    *)          echo "Unbekannte Option: $arg" >&2; exit 1 ;;
  esac
done

echo "==> VFR-Deploy nach $SERVER_HOST:$SERVER_DIR ($TS)"

# --- 1. Lokal paketieren --------------------------------------------------
echo "==> Paketiere Quellcode …"
cd "$LOCAL_DIR"
tar -czf "/tmp/${ARCHIVE}" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude=".git" \
  --exclude="invoices" \
  --exclude=".env" \
  --exclude=".env.local" \
  --exclude=".env.production" \
  --exclude="*.log" \
  --exclude=".vscode" \
  --exclude=".idea" \
  --exclude="vfr-website-*.tar.gz" \
  .
echo "    Paket: /tmp/${ARCHIVE} ($(du -h /tmp/${ARCHIVE} | cut -f1))"

# --- 2. Server vorbereiten ------------------------------------------------
echo "==> Prüfe Server-Verzeichnis …"
ssh "$SERVER_HOST" "mkdir -p ${SERVER_DIR} ${SERVER_DIR}/invoices ${SERVER_DIR}/backup && ls ${SERVER_DIR}/.env.production > /dev/null 2>&1 || echo '  WARNUNG: .env.production fehlt noch auf dem Server!'"

# --- 3. Upload ------------------------------------------------------------
echo "==> Lade Paket hoch …"
scp "/tmp/${ARCHIVE}" "${SERVER_HOST}:${SERVER_DIR}/${ARCHIVE}"
rm "/tmp/${ARCHIVE}"

# --- 4. Entpacken + Bauen + Starten --------------------------------------
echo "==> Entpacke + baue + starte auf Server …"
BUILD_CMD="up -d --build"
if [ "$NO_BUILD" -eq 1 ]; then
  BUILD_CMD="up -d"
fi

ssh "$SERVER_HOST" "bash -s" <<EOF
set -euo pipefail
cd ${SERVER_DIR}

# Entpacken (überschreibt alles außer invoices/, backup/, .env.production)
tar -xzf ${ARCHIVE}
rm ${ARCHIVE}

# Alte Archive wegräumen (die letzten 5 behalten)
ls -t vfr-website-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm -f || true

echo "==> docker compose ${BUILD_CMD}"
docker compose ${BUILD_CMD}

echo "==> Status:"
docker compose ps
EOF

# --- 5. Caddy neu laden, falls Vhost schon drin ---------------------------
echo "==> Caddy-Reload (falls fahrlehrer-portal.de schon im Caddyfile steht) …"
ssh "$SERVER_HOST" "grep -q 'fahrlehrer-portal.de' /opt/clutch-it/Caddyfile && docker exec clutch_caddy caddy reload --config /etc/caddy/Caddyfile && echo '    Caddy neu geladen.' || echo '    (fahrlehrer-portal.de noch nicht im Caddyfile — siehe deploy/Caddyfile.vfr-snippet)'"

echo
echo "==> Deploy fertig."

if [ "$SHOW_LOGS" -eq 1 ]; then
  echo "==> Live-Logs (Strg-C zum Beenden):"
  ssh "$SERVER_HOST" "cd ${SERVER_DIR} && docker compose logs -f --tail=100"
fi
