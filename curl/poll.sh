#!/usr/bin/env bash
# Poll a queued job until it is completed or failed.
#
# Usage:  bash curl/poll.sh JOB_ID
set -euo pipefail

[ -f .env ] && set -a && . ./.env && set +a

: "${VIDSCRIBE_API_KEY:?Set VIDSCRIBE_API_KEY in your environment or .env}"
BASE="${VIDSCRIBE_BASE_URL:-https://getvidscribe.com/v1}"
JOB_ID="${1:?Usage: bash curl/poll.sh JOB_ID}"

curl -sS "$BASE/transcript/$JOB_ID" \
  -H "x-api-key: $VIDSCRIBE_API_KEY"
echo
