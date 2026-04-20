# ─── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 외부에서 전달받을 빌드 타임 환경 변수 선언 및 환경 변수 등록
ARG NEXT_PUBLIC_API_URL
ARG BASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BASE_URL=$BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser  --system --uid 1001 nextjs

# standalone output 활용
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public         ./public

USER nextjs

EXPOSE 5000
ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
