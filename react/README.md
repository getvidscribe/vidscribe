# React example

`useTranscript.jsx` is a drop-in hook (plus a small demo component) for adding
transcription to a React app.

## The golden rule

**Never put your API key in browser code.** Anyone can read it. Instead:

```
React app  --POST /api/transcribe-->  your backend  --x-api-key-->  VidScribe
(no key)                              (holds the key)
```

This hook calls *your* backend at `/api/transcribe`. Use the
[Node proxy](../node/server.js) as that backend (or fold the same route into
your existing server / Next.js API route / serverless function).

## Use it

1. Copy `useTranscript.jsx` into your project (e.g. `src/`).
2. Run a backend that exposes `POST /api/transcribe` returning `{ "transcript": "..." }`.
   The [Node proxy](../node) does exactly this.
3. Render the hook:

   ```jsx
   import TranscribeDemo from "./useTranscript";

   export default function App() {
     return <TranscribeDemo />;
   }
   ```

   Or use just the hook in your own UI:

   ```jsx
   const { loading, transcript, error, transcribe } = useTranscript();
   ```

If your backend lives on another origin during development, pass its URL:
`useTranscript({ endpoint: "http://localhost:8787/api/transcribe" })`.
