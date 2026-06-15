# cURL examples

Plain shell scripts using `curl`. They read `VIDSCRIBE_API_KEY` and
`VIDSCRIBE_BASE_URL` from your environment or a `.env` file in the repo root.

```bash
# from the repo root
cp .env.example .env        # then paste your key into .env

bash curl/transcribe.sh "https://youtu.be/VIDEO_ID"   # transcribe (200 or 202)
bash curl/poll.sh 5                                    # poll job id 5
bash curl/quick-get.sh "https://youtu.be/VIDEO_ID"     # one-call plain text
bash curl/usage.sh                                     # plan + remaining quota
```

Tip: pipe the output through [`jq`](https://stedolan.github.io/jq/) for pretty JSON,
e.g. `bash curl/transcribe.sh "<url>" | jq`.
