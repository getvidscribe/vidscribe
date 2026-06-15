#!/usr/bin/env bash
# Check your plan and remaining monthly quota.
#
# Usage:  bash curl/usage.sh
set -euo pipefail

[ -f .env ] && set -a && . ./.env && set +a

: "${VIDSCRIBE_API_KEY:?Set VIDSCRIBE_API_KEY in your environment or .env}"
BASE="${VIDSCRIBE_BASE_URL:-https://getvidscribe.com/v1}"

curl -sS "$BASE/usage" \
  -H "x-api-key: $VIDSCRIBE_API_KEY"
echo
