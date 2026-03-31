#!/usr/bin/env bash
set -e

# GitFinder Starter — Developer Setup
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "============================================"
echo "  GitFinder Starter — Developer Setup"
echo "============================================"
echo ""

# Check Node 20+
if ! command -v node &>/dev/null; then
  echo "[FAIL] Node.js not installed. Visit https://nodejs.org"
  exit 1
fi
NODE_MAJOR=$(node -v | sed "s/v//" | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ] 2>/dev/null; then
  echo "[FAIL] Node.js $(node -v) — version 20+ required."
  exit 1
fi
echo "[OK] Node.js $(node -v)"

# Check pnpm
if ! command -v pnpm &>/dev/null; then
  echo "[FAIL] pnpm not installed."
  echo "Run: corepack enable && corepack prepare pnpm@latest --activate"
  exit 1
fi
echo "[OK] pnpm $(pnpm -v)"

# Install dependencies
echo "Installing dependencies..."
pnpm install
echo "[OK] Dependencies ready"

# Create .env.local for each app
for APP_DIR in "$REPO_ROOT"/apps/*/; do
  APP_NAME=$(basename "$APP_DIR")
  APP_ENV="$APP_DIR/.env.local"
  ROOT_EXAMPLE="$REPO_ROOT/.env.example"
  if [ ! -f "$APP_ENV" ] && [ -f "$ROOT_EXAMPLE" ]; then
    cp "$ROOT_EXAMPLE" "$APP_ENV"
    AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")
    sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=${AUTH_SECRET}|" "$APP_ENV" 2>/dev/null || true
    echo "[OK] Created ${APP_NAME}/.env.local"
  fi
done

echo ""
echo "Setup complete!"
echo "  GitFinder Hub:    http://localhost:4630"
echo "  GitFinder API:    http://localhost:4631"
echo "  GitFinder Worker: http://localhost:4632"
echo ""
echo "Start with: pnpm dev"
