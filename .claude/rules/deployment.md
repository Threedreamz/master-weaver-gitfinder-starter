# Deployment Rules

## Dev-First Workflow (MANDATORY)
1. Push to `dev` branch -> Railway auto-deploys to dev environments
2. Verify on dev URLs (`*-dev.up.railway.app`)
3. Only then merge to `main` -> production

## Railway Services
- `gitfinder-hub` (port 4630) — Next.js frontend
- `gitfinder-api` (port 4631) — REST API
- `gitfinder-worker` (port 4632) — Background worker

## Required Env Vars
- `HOSTNAME=0.0.0.0` — Required for Next.js standalone on Railway
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV=production`

## Health Routes
- Every service MUST have `/api/health` responding with `{status: "ok"}`

## Forbidden
- Never push directly to main without testing on dev
- Never force push to main/master
- Never commit .env files or secrets
