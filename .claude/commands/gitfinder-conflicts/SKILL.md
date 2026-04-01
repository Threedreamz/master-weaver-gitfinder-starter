---
name: gitfinder-conflicts
description: Inspect and resolve predicted merge conflicts across all repos
user-invocable: true
---

# /gitfinder-conflicts — Conflict Inspector

Shows all predicted merge conflicts across the ecosystem, grouped by severity. Guides you through resolution options.

## Step 1 — Scan for Conflicts

```bash
mw gf conflicts
```

This runs `git merge-tree` (non-destructive) against all repos and shows:
- **Critical** — schema/migration files: highest risk, must resolve manually
- **High** — `package.json`, `pnpm-lock.yaml`, `tsconfig.*`, auth/middleware files
- **Medium** — API routes, server actions
- **Low** — UI components, docs, tests

If output is empty: all repos are clean. Skip to `/gitfinder-waves`.

## Step 2 — Triage a Specific Repo

For a deeper look at one repo:
```bash
mw gf merge <repo-name> --dry-run
```

This shows:
- Source and target branches
- Files that will conflict
- AI strategy recommendation
- Whether fast-forward is possible

Example:
```bash
mw gf merge finder-starter --dry-run
mw gf merge ODYN-starter --dry-run --source dev --target main
```

## Step 3 — AI-Assisted Resolution

For conflicts GitFinder can suggest resolutions for:
```bash
mw gf ai-resolve <repo-name> --file <conflicting-file>
```

This sends the conflict markers to Claude and returns a resolved version with explanation. Always requires your review before applying.

Flags:
- `--dry-run` — show what would be resolved without writing (default)
- `--confirm` — write the resolved content to disk
- `--model opus` — use Opus 4.6 for complex conflicts

## Step 4 — Manual Resolution for Critical Conflicts

For schema/migration conflicts, AI resolution is disabled by default. Instead:
1. Open the conflicting file
2. Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Decide which version (or a combination) is correct
4. Remove the markers and save
5. Run `git add <file>` then `git merge --continue`

## Step 5 — Verify No New Conflicts

After resolving:
```bash
mw gf conflicts
```

Repeat until output is clean, then proceed to wave execution.

## What's Next

- `/gitfinder-waves` — Execute the merge waves once conflicts are resolved
- `/gitfinder-dag` — See which wave a conflicting repo belongs to