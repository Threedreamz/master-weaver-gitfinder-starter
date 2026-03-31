---
name: review
description: Code review for gitfinder-starter.
user_invocable: true
allowed-tools: [Bash, Read, Glob, Grep]
---

# /review

Run automated checks on changed code.

## Checks
1. pnpm turbo typecheck
2. Health routes on all 3 apps
3. No hardcoded secrets
4. Port conventions (4630-4632)

## What's Next
- /git-commit — commit after review passes
- /deploy — deploy after review
