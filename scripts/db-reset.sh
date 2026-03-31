#!/usr/bin/env bash
set -e
# Reset gitfinder database files
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Resetting gitfinder databases..."
find "$REPO_ROOT/apps" -name "gitfinder.db" -delete 2>/dev/null || true
echo "Done. Run pnpm dev to reinitialize."