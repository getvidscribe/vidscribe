// Minimal backend proxy for the React example.
//
// Your secret API key lives here on the server - never in the browser. The
// React app calls POST /api/transcribe on this server, and this server calls
// VidScribe with the key attached.
//
// Usage:
//   cd node && npm install && node server.js
//   then POST http://localhost:8787/api/transcribe  { "url": "..." }

import "dotenv/config";
import http from "node:http";
import { transcribe } from "./transcribe.js";

const PORT = process.env.PORT || 8787;

const server = http.createServer(async (req, res) => {
  // Allow your frontend's origin to call this proxy.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.writeHead(204).end();

  if (req.method === "POST" && req.url === "/api/transcribe") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { url } = JSON.parse(body || "{}");
        if (!url) throw new Error("Missing 'url'.");
        const transcript = await transcribe(url);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ transcript }));
      } catch (err) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT}`));
