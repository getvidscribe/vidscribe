#!/usr/bin/env bash
# Simple one-call GET endpoint - pass the URL as a query parameter and get the
# plain-text transcript straight back. Handy for quick scripts and pipelines.
#
# Usage:  bash curl/quick-get.sh "https://youtu.be/VIDEO_ID"
set -euo pipefail

[ -f .env ] && set -a && . ./.env && set +a

: "${VIDSCRIBE_API_KEY:?Set VIDSCRIBE_API_KEY in your environment or .env}"
BASE="${VIDSCRIBE_BASE_URL:-https://getvidscribe.com/v1}"
URL="${1:-https://youtu.be/VIDEO_ID}"

curl -sS -G "$BASE/transcript" \
  --data-urlencode "url=$URL" \
  --data-urlencode "text=true" \
  --data-urlencode "lang=en" \
  -H "x-api-key: $VIDSCRIBE_API_KEY"
echo
