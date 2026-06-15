# Node.js example

Uses the built-in `fetch` (Node 18+). `dotenv` loads your key from the repo
root `.env` file.

## CLI: transcribe a video

```bash
cd node
npm install
npm start -- "https://youtu.be/VIDEO_ID"
```

It prints the transcript and waits automatically for long videos.

## Backend proxy (for the React example)

`server.js` is a tiny server that keeps your secret key safe and exposes a
single `POST /api/transcribe` endpoint for a browser app to call:

```bash
cd node
npm install
node server.js
# -> Proxy listening on http://localhost:8787
```

Then your [React](../react) app calls `POST /api/transcribe` with `{ "url": "..." }`
and never sees the API key. In production, fold this route into your own backend
instead of running it standalone.
