---
name: gitfinder-repos
description: Add, remove, or inspect repos in the GitFinder ecosystem registry
user-invocable: true
---

# /gitfinder-repos — Repository Management

Shows all repos tracked by GitFinder, their health scores, and how to add or remove repos from the ecosystem registry.

## Step 1 — List All Repos

```bash
mw gf status
```

Shows a table with:
- Repo name and ecosystem
- Current branch
- Ahead/behind counts vs remote
- Merge readiness score (0-100)
- Status: `ready` | `attention` | `conflict`

For a specific repo:
```bash
mw gf status --repo finder-starter
```

## Step 2 — Scan for Fresh Data

The status command uses cached scan data. To force a fresh scan:
```bash
mw gf scan
```

This fetches all repos, runs conflict detection, and saves updated results.

## Step 3 — Check Health

```bash
mw gf health
```

Shows which services are reachable, when the last scan ran, and whether the GitFinder hub API is up.

## Step 4 — Add a Repo to the Ecosystem

Repos are registered in `ecosystem.json`. To add a new one:

1. Open `ecosystem.json` in master-weaver-master
2. Find the correct ecosystem block
3. Add the repo entry:
```json
"master-weaver-my-new-repo": {
  "type": "starter",
  "accessTier": "open",
  "stack": ["next"],
  "apps": [{ "name": "my-app", "port": 4000 }]
}
```
4. Run `mw gf scan` to pick up the new repo

## Step 5 — Remove a Repo

1. Delete or comment out its entry in `ecosystem.json`
2. Run `mw gf scan` to refresh
3. Run `mw gf status` to confirm it's no longer listed

## Step 6 — View in Dashboard

The repos list with full details is at:
```
http://localhost:4630/repos
```

Click any repo for branch details, conflict files, and merge history.

## What's Next

- `/gitfinder-dag` — See how this repo fits in the merge dependency graph
- `/gitfinder-conflicts` — Check if this repo has any predicted conflicts
- `/gitfinder-waves` — Include this repo in the next merge wave