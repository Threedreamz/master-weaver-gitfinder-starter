---
name: gitfinder-waves
description: Plan and execute topologically ordered merge waves across the ecosystem
user-invocable: true
---

# /gitfinder-waves — Wave Execution Wizard

Merges all repos in dependency order. Wave 1 first (packages/auth), then parallel consumer repos in Wave 2+. Each wave creates backup refs before any mutation.

## Step 1 — Preview the Wave Plan

```bash
mw gf merge-wave
```

Shows all waves with repo readiness scores. No changes made.

Check the output:
- Score >= 90 → ready (will fast-forward or clean-merge)
- Score 70-89 → caution (may have minor issues)
- Score < 70 → **not ready** — run `/gitfinder-conflicts` first

## Step 2 — Preview a Specific Wave

```bash
mw gf merge-wave 1
```

Shows exactly which repos are in Wave 1 and what would happen. Still dry-run.

## Step 3 — Execute Wave 1 (Dependencies First)

Once you're satisfied with the preview:
```bash
mw gf merge-wave 1 --confirm
```

GitFinder will:
1. Check each repo for uncommitted changes (skip if dirty)
2. Fetch from origin
3. Check for conflicts via `git merge-tree`
4. Create a backup ref at `refs/backup/merge-wave/<timestamp>`
5. Execute fast-forward or `--no-ff` merge
6. Report status per repo

To merge into a non-default target branch:
```bash
mw gf merge-wave 1 --confirm --source dev --target staging
```

To run repos one at a time instead of in parallel:
```bash
mw gf merge-wave 1 --confirm --sequential
```

## Step 4 — Execute Remaining Waves

After Wave 1 completes successfully:
```bash
mw gf merge-wave 2 --confirm
mw gf merge-wave 3 --confirm
```

**Important**: Only proceed to the next wave if the previous one succeeded. If any Wave N repo failed, investigate before continuing.

## Step 5 — Rollback if Needed

Every merge creates a backup ref. To roll back a specific repo:
```bash
# Find the backup ref in the output, e.g.:
# refs/backup/merge-wave/main-2026-04-01T10-00-00-000Z
git -C /path/to/repo update-ref main $(git rev-parse refs/backup/merge-wave/<timestamp>)
git -C /path/to/repo checkout main
```

## Step 6 — Verify

```bash
mw gf status
```

All repos should show green scores. Check the dashboard at `http://localhost:4630/waves` for a visual summary.

## What's Next

- `/gitfinder-dag` — Verify the dependency order before executing
- `/gitfinder-conflicts` — Resolve any conflicts that blocked a wave
- `/git-commit` — Commit and push the merged state
