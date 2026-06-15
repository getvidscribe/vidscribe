// Transcribe a video with the VidScribe API (Node.js 18+, uses built-in fetch).
//
// Usage:
//   cd node && npm install && npm start -- "https://youtu.be/VIDEO_ID"

import "dotenv/config";

const API_KEY = process.env.VIDSCRIBE_API_KEY || "tsk_your_secret_key";
const BASE = process.env.VIDSCRIBE_BASE_URL || "https://getvidscribe.com/v1";
const headers = { "x-api-key": API_KEY, "content-type": "application/json" };

export async function transcribe(url, lang = "en", mode = "auto") {
  const res = await fetch(`${BASE}/transcript`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url, lang, mode }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();

  // Short videos return the transcript; long ones return a job to poll.
  return data.transcript ?? poll(data.job_id);
}

export async function poll(jobId, interval = 3000) {
  while (true) {
    const res = await fetch(`${BASE}/transcript/${jobId}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.status === "completed") return data.transcript;
    if (data.status === "failed") throw new Error(data.error || "Transcription failed.");
    console.log(`  job ${jobId}: ${data.status} ...`);
    await new Promise((r) => setTimeout(r, interval));
  }
}

// Run from the command line.
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] || "https://youtu.be/VIDEO_ID";
  if (API_KEY === "tsk_your_secret_key") {
    console.error("Set VIDSCRIBE_API_KEY (see ../.env.example).");
    process.exit(1);
  }
  transcribe(url)
    .then((text) => console.log(text))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
