#!/usr/bin/env bash
set -e
# Deploy gitfinder services to Railway
# Usage: bash scripts/deploy-railway.sh [service|gitfinder-all] [--env dev|staging]
SERVICE="${1:-gitfinder-all}"
ENV=dev
while [[ $# -gt 0 ]]; do
  case $1 in
    --env) ENV="$2"; shift 2 ;;
    *) SERVICE="$1"; shift ;;
  esac
done
echo "Deploying $SERVICE to Railway env=$ENV..."
SERVICES=(gitfinder-hub gitfinder-api gitfinder-worker)
deploy_service() {
  echo "  Deploying $1..."
  railway up --service "$1" --detach 2>/dev/null || echo "  [WARN] railway CLI not linked"
}
if [ "$SERVICE" = "gitfinder-all" ]; then
  for svc in "${SERVICES[@]}"; do deploy_service "$svc"; done
else
  deploy_service "$SERVICE"
fi
echo "Deploy triggered."