# VidScribe API examples

Ready-to-run examples for the [VidScribe](https://getvidscribe.com) transcription API.
Send a video URL, get the transcript back as JSON. Short videos return instantly;
long videos return a job you poll until it is done.

These samples cover **cURL**, **Python**, **Node.js**, and **React**.

## Get started

1. Create an API key in your VidScribe dashboard: **[getvidscribe.com/keys](https://getvidscribe.com/keys)**
2. Copy `.env.example` to `.env` and paste your key:

   ```bash
   cp .env.example .env
   ```

   ```ini
   VIDSCRIBE_API_KEY=tsk_your_secret_key
   VIDSCRIBE_BASE_URL=https://getvidscribe.com/v1
   ```

3. Pick a language folder below and follow its README.

| Example | Run it |
| --- | --- |
| [`curl/`](./curl) | `bash curl/transcribe.sh` |
| [`python/`](./python) | `pip install -r python/requirements.txt && python python/transcribe.py` |
| [`node/`](./node) | `cd node && npm install && npm start` |
| [`react/`](./react) | drop `useTranscript.jsx` into your app (see its README) |

## The API in 30 seconds

Authenticate with your secret key in the `x-api-key` header. Base URL: `https://getvidscribe.com/v1`.

| Method | Endpoint | What it does |
| --- | --- | --- |
| `POST` | `/v1/transcript` | Transcribe a video. Returns the transcript (`200`) or a job to poll (`202`). |
| `GET` | `/v1/transcript/{job_id}` | Check a queued job until it is `completed`. |
| `GET` | `/v1/transcript?url=...&text=true` | Simple one-call GET, returns plain text. |
| `GET` | `/v1/usage` | Your plan and remaining monthly quota. |

Full reference: **[getvidscribe.com/docs](https://getvidscribe.com/docs)**

## Keep your key safe

Your API key is a secret, like a password. Use it only from a server you control.
Never ship it in browser, mobile, or other public code. The [React example](./react)
shows the correct pattern: the browser calls *your* backend, and your backend holds
the key.

## Machine-readable specs

- [`openapi.yaml`](./openapi.yaml) - import into Postman, Insomnia, or generate a client
- [`postman_collection.json`](./postman_collection.json) - one-click "try the API" collection

## License

MIT - see [LICENSE](./LICENSE). Use these snippets freely in your own projects.
