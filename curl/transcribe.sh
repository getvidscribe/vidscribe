#!/usr/bin/env bash
# Transcribe a video. Short videos return the transcript immediately (200);
# long videos return { "job_id": N } (202) - poll it with poll.sh.
#
# Usage:  bash curl/transcribe.sh "https://youtu.be/VIDEO_ID"
set -euo pipefail

# Load .env if present.
[ -f .env ] && set -a && . ./.env && set +a

: "${VIDSCRIBE_API_KEY:?Set VIDSCRIBE_API_KEY in your environment or .env}"
BASE="${VIDSCRIBE_BASE_URL:-https://getvidscribe.com/v1}"
URL="${1:-https://youtu.be/VIDEO_ID}"

curl -sS -X POST "$BASE/transcript" \
  -H "x-api-key: $VIDSCRIBE_API_KEY" \
  -H "content-type: application/json" \
  -d "{ \"url\": \"$URL\", \"lang\": \"en\", \"mode\": \"auto\" }"
echo
