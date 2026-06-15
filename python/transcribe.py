"""Transcribe a video with the VidScribe API.

Short videos return the transcript immediately; long videos return a job id
that this script polls until it is done.

Usage:
    pip install -r requirements.txt
    python transcribe.py "https://youtu.be/VIDEO_ID"
"""

import os
import sys
import time

import requests

API_KEY = os.environ.get("VIDSCRIBE_API_KEY", "tsk_your_secret_key")
BASE = os.environ.get("VIDSCRIBE_BASE_URL", "https://getvidscribe.com/v1")
HEADERS = {"x-api-key": API_KEY}


def transcribe(url, lang="en", mode="auto"):
    """Return the transcript text for a video URL."""
    res = requests.post(
        f"{BASE}/transcript",
        headers=HEADERS,
        json={"url": url, "lang": lang, "mode": mode},
        timeout=60,
    )
    res.raise_for_status()
    data = res.json()

    # Short videos come back with the transcript right away.
    if data.get("transcript"):
        return data["transcript"]

    # Long videos return a job id to poll.
    return poll(data["job_id"])


def poll(job_id, interval=3):
    """Poll a queued job until it is completed (or raise on failure)."""
    while True:
        res = requests.get(f"{BASE}/transcript/{job_id}", headers=HEADERS, timeout=30)
        res.raise_for_status()
        data = res.json()
        status = data["status"]
        if status == "completed":
            return data["transcript"]
        if status == "failed":
            raise RuntimeError(data.get("error") or "Transcription failed.")
        print(f"  job {job_id}: {status} ...")
        time.sleep(interval)


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "https://youtu.be/VIDEO_ID"
    if API_KEY == "tsk_your_secret_key":
        print("Set VIDSCRIBE_API_KEY (see ../.env.example).", file=sys.stderr)
        sys.exit(1)

    try:
        text = transcribe(url)
    except requests.HTTPError as err:
        # The API returns a helpful message in the body.
        print(f"Error {err.response.status_code}: {err.response.text}", file=sys.stderr)
        sys.exit(1)

    print(text)


if __name__ == "__main__":
    main()
