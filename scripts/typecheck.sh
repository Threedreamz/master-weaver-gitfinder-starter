#!/usr/bin/env bash
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
echo "Running TypeScript type check..."
pnpm turbo typecheck
echo "Type check passed."