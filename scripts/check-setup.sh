#!/usr/bin/env bash
# Quick health check for gitfinder-starter
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
echo "Checking gitfinder-starter setup..."
[ -d node_modules ] && echo "[OK] node_modules" || echo "[WARN] Run pnpm install"
[ -f .env.example ] && echo "[OK] .env.example" || echo "[WARN] Missing .env.example"
[ -f apps/gitfinder-hub/.env.local ] && echo "[OK] hub .env.local" || echo "[INFO] Run scripts/setup.sh"
echo "Done."