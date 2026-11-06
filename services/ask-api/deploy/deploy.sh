#!/usr/bin/env bash
# Deploys or updates the assistant on the VPS.
# Usage (on the server, from a checkout of this repo): services/ask-api/deploy/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f ask.env ]]; then
  echo "ask.env is missing — copy deploy/settings.example to ask.env and add your API key." >&2
  exit 1
fi

docker compose up -d --build
echo "Waiting for health check..."
for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8090/healthz >/dev/null; then
    curl -fsS http://127.0.0.1:8090/healthz
    echo
    echo "ask-api is up."
    exit 0
  fi
  sleep 2
done
echo "ask-api did not become healthy; recent logs:" >&2
docker compose logs --tail 50 ask-api >&2
exit 1
