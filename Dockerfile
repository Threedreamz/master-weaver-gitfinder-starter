# gitfinder-hub — Next.js standalone
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
COPY apps/gitfinder-hub/package.json apps/gitfinder-hub/
COPY packages/config/package.json packages/config/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --no-frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DOCKER_BUILD=true
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @mw/gitfinder-config build 2>/dev/null || true
RUN pnpm --filter @mw/gitfinder-shared build 2>/dev/null || true
RUN pnpm --filter gitfinder-hub build

# Ensure dirs exist for COPY in runner stage
RUN mkdir -p apps/gitfinder-hub/public apps/gitfinder-hub/.next/static

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/gitfinder-hub/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/gitfinder-hub/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/gitfinder-hub/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 4630
ENV PORT=4630
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
