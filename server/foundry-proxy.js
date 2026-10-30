#!/usr/bin/env node
// Proxy local (homologação) para o Microsoft Foundry usando autenticação Entra ID via Azure CLI.
// Uso: az login && FOUNDRY_PROJECT_ENDPOINT="https://<recurso>.services.ai.azure.com/api/projects/<projeto>" node server/foundry-proxy.js
// No portal (Configurações → IA): Endpoint = http://localhost:8787/chat/completions, Deployment = nome do modelo, API key em branco.
const http = require("http");
const { execFile } = require("child_process");

const PROJECT = (process.env.FOUNDRY_PROJECT_ENDPOINT || "").replace(/\/+$/, "");
const PORT = +process.env.PORT || 8787;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:8080,http://127.0.0.1:8080").split(",");
if (!PROJECT) { console.error("Defina FOUNDRY_PROJECT_ENDPOINT (endpoint do projeto Foundry)."); process.exit(1); }

let cached = null;
const getToken = () => new Promise((resolve, reject) => {
  if (cached && cached.exp - Date.now() > 5 * 60e3) return resolve(cached.token);
  execFile("az", ["account", "get-access-token", "--scope", "https://ai.azure.com/.default", "-o", "json"], (err, out) => {
    if (err) return reject(new Error("Falha ao obter token (rode 'az login'): " + err.message));
    const j = JSON.parse(out);
    cached = { token: j.accessToken, exp: (j.expires_on ? j.expires_on * 1000 : Date.parse(j.expiresOn)) || Date.now() + 30 * 60e3 };
    resolve(cached.token);
  });
});

http.createServer((req, res) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "content-type, api-key");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.end();
  const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };
  if (req.method !== "POST" || !req.url.startsWith("/chat/completions")) return send(404, { error: { message: "Use POST /chat/completions" } });
  let body = "";
  req.on("data", d => { body += d; if (body.length > 1e6) req.destroy(); });
  req.on("end", async () => {
    try {
      const r = await fetch(`${PROJECT}/openai/v1/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getToken()}` }, body });
      res.writeHead(r.status, { "Content-Type": r.headers.get("content-type") || "application/json" });
      res.end(await r.text());
    } catch (e) { send(502, { error: { message: e.message } }); }
  });
}).listen(PORT, "127.0.0.1", () => console.log(`Foundry proxy em http://localhost:${PORT}/chat/completions → ${PROJECT}`));
