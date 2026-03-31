FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune gitfinder-hub --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --no-frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
ENV DOCKER_BUILD=true
ENV NODE_ENV=production
RUN pnpm build --filter=gitfinder-hub

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/gitfinder-hub/.next/standalone ./
COPY --from=builder /app/apps/gitfinder-hub/.next/static ./apps/gitfinder-hub/.next/static/

RUN mkdir -p /app/apps/gitfinder-hub/public /app/apps/gitfinder-hub/.next
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 4630
ENV PORT=4630
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/gitfinder-hub/server.js"]
