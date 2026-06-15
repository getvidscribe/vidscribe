import { useState } from "react";

/**
 * useTranscript - a tiny React hook for transcribing a video.
 *
 * IMPORTANT: your VidScribe secret key must stay on the server. This hook calls
 * YOUR OWN backend (see ../node/server.js), which holds the key and calls the
 * VidScribe API. The browser never sees the key.
 */
export function useTranscript({ endpoint = "/api/transcribe" } = {}) {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  async function transcribe(url) {
    setLoading(true);
    setError("");
    setTranscript("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
      setTranscript(data.transcript);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, transcript, error, transcribe };
}

/** Example component using the hook. */
export default function TranscribeDemo() {
  const { loading, transcript, error, transcribe } = useTranscript();
  const [url, setUrl] = useState("");

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>VidScribe demo</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (url.trim()) transcribe(url.trim());
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtu.be/VIDEO_ID"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Transcribing..." : "Transcribe"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {transcript && <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>{transcript}</pre>}
    </div>
  );
}
