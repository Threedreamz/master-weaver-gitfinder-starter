# master-weaver-gitfinder-starter

GitFinder merge orchestration UI — DAG canvas, merge planning, and conflict resolution for multi-repo ecosystems.

## Quick Start

\Scope: all 83 workspace projects
Progress: resolved 0, reused 1, downloaded 0, added 0
packages/ui                              |  WARN  deprecated eslint@8.57.1
Progress: resolved 122, reused 116, downloaded 0, added 0
Progress: resolved 448, reused 418, downloaded 0, added 0
Progress: resolved 985, reused 849, downloaded 0, added 0
Progress: resolved 1337, reused 1131, downloaded 0, added 0
 WARN  12 deprecated subdependencies found: @esbuild-kit/core-utils@3.3.2, @esbuild-kit/esm-loader@2.6.5, @humanwhocodes/config-array@0.13.0, @humanwhocodes/object-schema@2.0.3, git-raw-commits@4.0.0, glob@10.5.0, glob@7.2.3, inflight@1.0.6, prebuild-install@7.1.3, rimraf@3.0.2, three-mesh-bvh@0.7.8, whatwg-encoding@3.1.1
Already up to date
Progress: resolved 1337, reused 1131, downloaded 0, added 0, done
. prepare$ husky
. prepare: Done
 WARN  Issues with peer dependencies found
packages/auth-nextauth
└─┬ next-auth 4.24.13
  └── ✕ unmet peer @auth/core@0.34.3: found 0.41.1

packages/open3d-viewer
└─┬ @types/react-dom 18.3.7
  └── ✕ unmet peer @types/react@^18.0.0: found 19.2.14

packages/test-utils
└─┬ @testing-library/react 16.3.2
  └── ✕ unmet peer @testing-library/dom@^10.0.0: found 9.3.4

packages/ui-3d
└─┬ @testing-library/react 16.3.2
  └── ✕ unmet peer @testing-library/dom@^10.0.0: found 9.3.4

packages/ui-auth
└─┬ next-auth 4.24.13
  └── ✕ unmet peer @auth/core@0.34.3: found 0.41.1

Done in 31.2s using pnpm v10.6.2
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "dev" not found
Or use the guided setup:
\
## Project

**Purpose**: GitFinder provides topological merge orchestration for multi-repo ecosystems. This starter ships a full working UI with DAG visualization, merge planning, conflict resolution, and wave execution.

**Stack**: Next.js 15, Tailwind CSS v4, shadcn/ui, ReactFlow, Drizzle ORM, PostgreSQL

## Apps

| App | Port | Description |
|-----|------|-------------|
|  | 4630 | Main dashboard — ReactFlow DAG canvas, merge planning, conflict resolution |
|  | 4631 | REST API for merge analysis and execution |
|  | 4632 | Background merge worker for scheduled operations |

## Packages

| Package | Description |
|---------|-------------|
|  | Shared utilities and types |
|  | Configuration constants and port registry |
|  | Shared TypeScript base configuration |

## Key URLs (dev)

- Hub: http://localhost:4630
- API health: http://localhost:4631/api/health
- Worker health: http://localhost:4632/api/health

## Claude Code Commands

| Command | Description |
|---------|-------------|
|  | Context-aware suggestions for what to do next |
|  | Conventional commit + branch + optional PR |
|  | Deploy to Railway dev/staging |
|  | Automated code review |
|  | First-time setup wizard |

## Architecture Notes

- **DAG Canvas**:  — ReactFlow with dagre layout
- **Merge Waves**:  — Wave-based parallel merge execution
- **Conflict Resolution**:  — Diff viewer and AI resolution
- **API Routes**:  — Backend endpoints

## Environment

Copy  to :
\
Required for production: FINDERAUTH_ISSUER, FINDERAUTH_CLIENT_ID, FINDERAUTH_CLIENT_SECRET, AUTH_SECRET, DATABASE_URL

## Railway Deployment

Services: gitfinder-hub, gitfinder-api, gitfinder-worker
Branch flow: dev -> staging -> main

\
Services: finderauth oidc filament-finder finder-finder machine-finder resin-finder filament-admin finder-admin machine-admin resin-admin admin-odyn admin-devtools admin-etd design odyn-hub odyn-maker odyn-cluster ersatzteildrucken ersatzteilscannen devtools-control-plane devtools-dashboard devtools-agent affiliate-app crawler-worker crowds-api crowds-app db-hub db-api db-worker mw-hub landing-hub teams-app

Groups: essential crowds-all etd-all affiliate-all db-all finder-all admin-all odyn-all devtools-all

Services: finderauth oidc filament-finder finder-finder machine-finder resin-finder filament-admin finder-admin machine-admin resin-admin admin-odyn admin-devtools admin-etd design odyn-hub odyn-maker odyn-cluster ersatzteildrucken ersatzteilscannen devtools-control-plane devtools-dashboard devtools-agent affiliate-app crawler-worker crowds-api crowds-app db-hub db-api db-worker mw-hub landing-hub teams-app

Groups: essential crowds-all etd-all affiliate-all db-all finder-all admin-all odyn-all devtools-all