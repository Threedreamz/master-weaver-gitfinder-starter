# GitFinder Starter

DAG-based smart merge orchestration for multi-repo ecosystems.

## Apps
- `gitfinder-hub` (port 4630) — Main dashboard with ReactFlow DAG canvas
- `gitfinder-api` (port 4631) — REST API for merge analysis and execution (planned)
- `gitfinder-worker` (port 4632) — Background merge worker (planned)

## Quick Start
```bash
pnpm install
pnpm dev
```

## Architecture
- Uses `@mw/merge-dag` for topological sort and wave execution
- Uses `@mw/team-sync` for merge analysis and conflict prediction
- ReactFlow for DAG visualization
- Drizzle ORM + PostgreSQL for persistence
- 4-tier AI integration (KeyStore -> ZAI -> Anthropic -> OAuth)
