#!/usr/bin/env bash
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
echo "Checking for outdated dependencies..."
pnpm outdated || true
echo ""
echo "To upgrade: pnpm update --recursive"