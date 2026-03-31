# Testing Rules

## Type Safety
- Run `pnpm turbo typecheck` before committing
- Zero TypeScript errors required on main branch

## Health Checks
- All services must respond to GET /api/health with {status: "ok"}
- Test health endpoints before Railway deploy

## Manual Testing
1. Start all apps: `pnpm dev`
2. Open http://localhost:4630 — DAG canvas loads
3. Verify API: curl http://localhost:4631/api/health
4. Verify worker: curl http://localhost:4632/api/health

## Continuous Integration
- CI runs on all PRs to main and dev
- Required: typecheck + build pass before merge
