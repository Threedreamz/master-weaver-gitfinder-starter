---
name: guide
description: Context-aware suggestions for what to do next in gitfinder-starter.
user_invocable: true
allowed-tools: [Bash, Read, Glob, Grep]
---

# /guide

Analyze current state and show only the most relevant commands.

## Steps
1. Read .claude/developer.json for level
2. Run git status and git branch --show-current
3. Check node_modules and .env.local presence

## Classify State

**Getting Started** (no node_modules): bash scripts/setup.sh
**In Progress** (uncommitted changes): /review -> /git-commit -> /share
**Clean branch**: pnpm dev

## What's Next
- /git-commit — commit your work
- /review — code review
- /onboard — first-time setup
