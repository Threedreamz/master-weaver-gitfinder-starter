---
name: gitfinder-dag
description: Visualize the merge dependency graph (DAG) and understand wave order
user-invocable: true
---

# /gitfinder-dag — Merge Dependency Graph

Shows the topologically sorted merge DAG: which repos depend on which, which wave each lives in, and whether any cycles exist.

## Step 1 — Show the DAG

```bash
mw gf dag
```

This prints all repos grouped by wave (Wave 1 can merge in parallel, Wave 2 after Wave 1 completes, etc.) with dependency arrows.

For Mermaid diagram format (paste into any Mermaid renderer):
```bash
mw gf dag --format mermaid
```

For raw JSON (useful for scripting):
```bash
mw gf dag --format json
```

## Step 2 — Understand the Wave Order

Each wave is a set of repos that can safely merge in parallel:

- **Wave 1**: Repos with no dependencies (e.g., `master-weaver-master` providing `@mw/*` packages)
- **Wave 2**: Auth infrastructure (e.g., `finderauth`)
- **Wave 3**: Independent starter repos
- **Wave 4+**: Consumer repos that depend on packages from earlier waves

**Rule**: Never merge a repo before its dependencies are merged.

## Step 3 — Check for Issues

Look for:
- ⚠️ **Cycle detected** — a repo depends on itself transitively (GitFinder will still work but logs a warning)
- 🔴 **Red nodes** — score < 50, not ready to merge
- 🟡 **Yellow nodes** — score 50-79, needs attention before merging

If you see red nodes in Wave 1, those must be resolved before any downstream waves can safely proceed.

## Step 4 — View Live in Dashboard

Open the GitFinder dashboard to see the ReactFlow interactive canvas:
```
http://localhost:4630/dag
```

Click any repo node to see its branches, conflicts, and merge plan.

## What's Next

- `/gitfinder-waves` — Plan and execute the actual merge waves
- `/gitfinder-conflicts` — Inspect conflicts in red-scored repos
- `/gitfinder-repos` — Add or remove repos from the DAG
