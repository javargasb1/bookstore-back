# ====== Etapa: Builder ======
FROM node:20-alpine AS builder
WORKDIR /app

# Copia manifest(s) e instala dependencias aprovechando caché
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm i; fi

# Copia el resto del código
COPY . .

# Variables de entorno para el build
# (docker-compose pasa el valor por build args)
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_TELEMETRY_DISABLED=1

# Compila Next en modo standalone (requiere output:'standalone' en next.config.ts)
RUN npm run build

# ====== Etapa: Runner (mínimo) ======
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Puerto del servidor de Next
EXPOSE 3000

# Copia artefactos standalone generados por el build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Arranca el servidor (server.js es generado por Next en modo standalone)
CMD ["node", "server.js"]
