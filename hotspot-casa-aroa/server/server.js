"use strict";

/*
 * Hotel Casa Aroa · Servidor de portal externo para UniFi
 * Sirve el portal (../portal) y autoriza a los huéspedes en el UDM Pro.
 * Sin dependencias: Node.js 18+.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { UniFi } = require("./unifi");

loadEnv(path.join(__dirname, ".env"));

const env = (k, d) => (process.env[k] !== undefined && process.env[k] !== "" ? process.env[k] : d);
const num = (k, d) => Number(env(k, d)) || 0;

const CONFIG = {
  port: num("PORT", 80),
  portalDir: path.resolve(__dirname, env("PORTAL_DIR", "../portal")),
  site: env("UNIFI_SITE", "default"),
  accessCode: env("ACCESS_CODE", ""),
  logFile: path.resolve(__dirname, env("GUEST_LOG", "./data/guests.jsonl")),
  guest: {
    minutes: num("GUEST_MINUTES", 4320),
    down: num("GUEST_DOWN_KBPS", 0),
    up: num("GUEST_UP_KBPS", 0),
    megabytes: num("GUEST_MB_LIMIT", 0),
  },
  dryRun: env("DRY_RUN", "false") === "true",
};

const unifi = new UniFi({
  host: env("UNIFI_HOST", "192.168.1.1"),
  port: num("UNIFI_PORT", 443),
  username: env("UNIFI_USER", ""),
  password: env("UNIFI_PASS", ""),
  site: CONFIG.site,
  isUnifiOs: env("UNIFI_OS", "true") !== "false",
  verifyTls: env("UNIFI_VERIFY_TLS", "false") === "true",
});

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const MAC_RE = /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i;

/* ---------- Rate limit (por IP) ---------- */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 10;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) if (!list.some((t) => now - t < 60000)) hits.delete(ip);
}, 60000).unref();

/* ---------- Helpers ---------- */
function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    ...headers,
  });
  res.end(body);
}
const json = (res, status, obj) =>
  send(res, status, JSON.stringify(obj), { "Content-Type": MIME[".json"], "Cache-Control": "no-store" });

function readBody(req, limit = 8192) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) { reject(new Error("too_large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a).trim().toUpperCase()).digest();
  const hb = crypto.createHash("sha256").update(String(b).trim().toUpperCase()).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function logGuest(entry) {
  fs.mkdir(path.dirname(CONFIG.logFile), { recursive: true }, () => {
    fs.appendFile(CONFIG.logFile, JSON.stringify(entry) + "\n", { mode: 0o600 }, (err) => {
      if (err) console.error("[log] no se pudo guardar el registro:", err.message);
    });
  });
}

/* ---------- API ---------- */
async function handleAuthorize(req, res) {
  const ip = req.socket.remoteAddress;
  if (rateLimited(ip)) return json(res, 429, { ok: false, error: "rate_limited" });

  let data;
  try { data = JSON.parse(await readBody(req)); } catch (_) { return json(res, 400, { ok: false, error: "bad_request" }); }

  const mac = clean(data.mac, 17).replace(/-/g, ":");
  if (!MAC_RE.test(mac)) return json(res, 400, { ok: false, error: "no_mac" });

  const name = clean(data.name, 80);
  if (name.length < 2) return json(res, 400, { ok: false, error: "invalid" });

  if (CONFIG.accessCode && !safeEqual(data.accessCode || "", CONFIG.accessCode)) {
    return json(res, 401, { ok: false, error: "bad_code" });
  }

  const apMac = clean(data.ap, 17).replace(/-/g, ":");
  const email = clean(data.email, 120);

  try {
    if (!CONFIG.dryRun) {
      await unifi.authorizeGuest(mac, { ...CONFIG.guest, apMac: MAC_RE.test(apMac) ? apMac : "" });
    }
  } catch (err) {
    console.error("[unifi]", err.message);
    return json(res, 502, { ok: false, error: "unifi" });
  }

  logGuest({
    ts: new Date().toISOString(),
    mac: mac.toLowerCase(),
    name,
    room: clean(data.room, 8),
    email: email || undefined,
    marketing: !!(email && data.marketing),
    lang: clean(data.lang, 5),
    ssid: clean(data.ssid, 64),
    ap: apMac.toLowerCase() || undefined,
  });

  console.log("[ok] invitado autorizado", mac.toLowerCase(), CONFIG.dryRun ? "(dry run)" : "");
  return json(res, 200, { ok: true });
}

/* ---------- Estáticos ---------- */
function serveStatic(req, res, pathname) {
  // UniFi redirige a /guest/s/<site>/?id=...; el portal usa rutas relativas.
  let rel = pathname.replace(/^\/guest\/s\/[^/]+\/?/, "/");
  if (rel === "/" || rel === "") rel = "/index.html";

  let file;
  try { file = path.resolve(CONFIG.portalDir, "." + decodeURIComponent(rel)); } catch (_) { return send(res, 400, "Bad request"); }
  if (!file.startsWith(CONFIG.portalDir + path.sep)) return send(res, 403, "Forbidden");

  fs.readFile(file, (err, buf) => {
    if (err) {
      // Cualquier ruta desconocida muestra el portal (útil para la detección de portal cautivo).
      if (path.extname(rel)) return send(res, 404, "Not found");
      return serveStatic(req, res, "/index.html");
    }
    const ext = path.extname(file).toLowerCase();
    let body = buf;
    if (path.basename(file) === "config.js") {
      // El servidor manda: modo externo y código de acceso si está configurado.
      body = Buffer.concat([
        buf,
        Buffer.from(
          "\nwindow.PORTAL_CONFIG.mode='external';" +
          "window.PORTAL_CONFIG.site=" + JSON.stringify(CONFIG.site) + ";" +
          "window.PORTAL_CONFIG.form=window.PORTAL_CONFIG.form||{};" +
          "window.PORTAL_CONFIG.form.askAccessCode=" + (CONFIG.accessCode ? "true" : "false") + ";\n"
        ),
      ]);
    }
    const longCache = ext === ".woff2" || /^\/(img|fonts)\//.test(rel);
    send(res, 200, req.method === "HEAD" ? undefined : body, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": longCache ? "public, max-age=604800" : "no-store",
    });
  });
}

/* ---------- Servidor ---------- */
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://portal.local");

  if (pathname === "/api/authorize" && req.method === "POST") {
    handleAuthorize(req, res).catch((err) => {
      console.error("[api]", err.message);
      json(res, 500, { ok: false, error: "server" });
    });
    return;
  }
  if (pathname === "/healthz") return json(res, 200, { ok: true });
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed");
  serveStatic(req, res, pathname);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("ERROR: el puerto " + CONFIG.port + " ya está en uso (¿el servidor web del NAS?). Usa una IP propia para el contenedor o cambia PORT.");
  } else if (err.code === "EACCES") {
    console.error("ERROR: sin permiso para abrir el puerto " + CONFIG.port + ". Ejecuta el contenedor como root o usa un puerto > 1024.");
  } else {
    console.error("ERROR al arrancar el servidor:", err.message);
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("ERROR inesperado:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (err) => {
  console.error("ERROR inesperado (promesa):", err && err.message ? err.message : err);
});

if (!fs.existsSync(path.join(CONFIG.portalDir, "index.html"))) {
  console.error("AVISO: no encuentro " + path.join(CONFIG.portalDir, "index.html") + ". Revisa que la carpeta portal/ está junto a server/.");
}
if (!fs.existsSync(path.join(__dirname, ".env"))) {
  console.warn("AVISO: no hay fichero .env en " + __dirname + " (copia .env.example como .env).");
}

server.listen(CONFIG.port, () => {
  console.log("Portal Casa Aroa escuchando en :" + CONFIG.port + (CONFIG.dryRun ? " (DRY_RUN: no se autoriza en UniFi)" : ""));
  console.log("UDM: " + unifi.host + ":" + unifi.port + " · usuario: " + (unifi.username || "(vacío)") + " · portal: " + CONFIG.portalDir);
  if (!CONFIG.dryRun && (!unifi.username || !unifi.password)) {
    console.warn("Aviso: faltan UNIFI_USER / UNIFI_PASS en .env");
  }
});

/* ---------- .env ---------- */
function loadEnv(file) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch (_) { return; }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
