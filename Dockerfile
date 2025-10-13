# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# -----------------------------------------------------
# 1. Dependencies
# -----------------------------------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --no-frozen-lockfile

# -----------------------------------------------------
# 2. Builder
# -----------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# -----------------------------------------------------
# 3. Runner
# -----------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache python3 make g++
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
