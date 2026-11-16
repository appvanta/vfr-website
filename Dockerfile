# VFR Website — Produktions-Build
# Multi-stage für schlankes Image (~150 MB statt ~1 GB)

# ========== Stage 1: Dependencies ==========
FROM node:20-alpine AS deps
WORKDIR /app

# libc-compat für einige npm packages (next-swc etc.)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps

# ========== Stage 2: Build ==========
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Verhindert Telemetrie-Pings
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ========== Stage 3: Runtime ==========
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Nicht als root laufen
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone-Output: eigener minimaler Server inkl. aller Dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ordner für Rechnungs-PDFs (wird per Volume gemountet)
RUN mkdir -p /app/invoices && chown -R nextjs:nodejs /app/invoices

USER nextjs

EXPOSE 3000

# Healthcheck für Docker/Caddy
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --spider --quiet http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
