# Architecture Rules

## Package Structure
- `apps/gitfinder-hub` — Next.js 15 UI with ReactFlow DAG canvas
- `apps/gitfinder-api` — Standalone Node.js REST API
- `apps/gitfinder-worker` — Background job processor
- `packages/shared` — `@mw/gitfinder-shared` — shared types and utilities
- `packages/config` — `@mw/gitfinder-config` — port registry and constants
- `packages/tsconfig` — `@mw/gitfinder-tsconfig` — base TypeScript config

## Port Registry
- gitfinder-hub: 4630
- gitfinder-api: 4631
- gitfinder-worker: 4632

## Key Conventions
- All ports via env vars: `Number(process.env.PORT) || 4630`
- React components in `src/app/` or `src/components/`
- API routes in `src/app/api/`
- Every deployed service needs `/api/health` route

## DAG Canvas
- ReactFlow + dagre for layout
- Types: `src/app/lib/types.ts`
- Canvas page: `src/app/dag/`
- Waves page: `src/app/waves/`
