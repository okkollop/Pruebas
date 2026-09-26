"use strict";

/*
 * Cliente mínimo de la API de UniFi Network para autorizar invitados.
 * Funciona con consolas UniFi OS (UDM Pro, UDM SE, UCG, Cloud Key Gen2+)
 * y con el controlador clásico (isUnifiOs = false).
 */

const https = require("https");

class UniFi {
  constructor(opts) {
    this.host = opts.host;
    this.port = opts.port || 443;
    this.username = opts.username;
    this.password = opts.password;
    this.site = opts.site || "default";
    this.isUnifiOs = opts.isUnifiOs !== false;
    this.agent = new https.Agent({ keepAlive: true, rejectUnauthorized: !!opts.verifyTls });
    this.cookies = {};
    this.csrf = null;
    this.loggingIn = null;
  }

  get apiBase() {
    return (this.isUnifiOs ? "/proxy/network" : "") + "/api/s/" + encodeURIComponent(this.site);
  }

  raw(method, path, body) {
    const payload = body ? JSON.stringify(body) : null;
    const headers = { Accept: "application/json" };
    if (payload) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }
    const cookie = Object.entries(this.cookies).map(([k, v]) => k + "=" + v).join("; ");
    if (cookie) headers.Cookie = cookie;
    if (this.csrf) headers["X-CSRF-Token"] = this.csrf;

    return new Promise((resolve, reject) => {
      const req = https.request(
        { host: this.host, port: this.port, method, path, headers, agent: this.agent, timeout: 10000 },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            for (const sc of res.headers["set-cookie"] || []) {
              const [pair] = sc.split(";");
              const i = pair.indexOf("=");
              if (i > 0) this.cookies[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
            }
            const csrf = res.headers["x-updated-csrf-token"] || res.headers["x-csrf-token"];
            if (csrf) this.csrf = csrf;
            const text = Buffer.concat(chunks).toString("utf8");
            let json = null;
            try { json = text ? JSON.parse(text) : null; } catch (_) { /* not JSON */ }
            resolve({ status: res.statusCode, json, text });
          });
        }
      );
      req.on("timeout", () => req.destroy(new Error("UniFi request timeout")));
      req.on("error", reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  login() {
    if (!this.loggingIn) {
      this.cookies = {};
      this.csrf = null;
      const path = this.isUnifiOs ? "/api/auth/login" : "/api/login";
      this.loggingIn = this.raw("POST", path, { username: this.username, password: this.password, rememberMe: true })
        .then((r) => {
          if (r.status !== 200) throw new Error("UniFi login failed (HTTP " + r.status + ")");
          if (!this.isUnifiOs && this.cookies.csrf_token) this.csrf = this.cookies.csrf_token;
        })
        .finally(() => { this.loggingIn = null; });
    }
    return this.loggingIn;
  }

  async request(method, path, body) {
    if (!Object.keys(this.cookies).length) await this.login();
    let r = await this.raw(method, path, body);
    if (r.status === 401 || r.status === 403) {
      await this.login();
      r = await this.raw(method, path, body);
    }
    const rc = r.json && r.json.meta && r.json.meta.rc;
    if (r.status !== 200 || (rc && rc !== "ok")) {
      const msg = (r.json && r.json.meta && r.json.meta.msg) || r.text.slice(0, 200);
      throw new Error("UniFi " + method + " " + path + " → HTTP " + r.status + " " + msg);
    }
    return r.json ? r.json.data : null;
  }

  /**
   * Autoriza a un cliente invitado.
   * @param {string} mac   MAC del cliente (parámetro "id" que envía UniFi)
   * @param {object} o     minutes, up/down (kbps), megabytes, apMac
   */
  authorizeGuest(mac, o = {}) {
    const body = { cmd: "authorize-guest", mac: mac.toLowerCase(), minutes: o.minutes || 1440 };
    if (o.up) body.up = o.up;
    if (o.down) body.down = o.down;
    if (o.megabytes) body.bytes = o.megabytes;
    if (o.apMac) body.ap_mac = o.apMac.toLowerCase();
    return this.request("POST", this.apiBase + "/cmd/stamgr", body);
  }

  unauthorizeGuest(mac) {
    return this.request("POST", this.apiBase + "/cmd/stamgr", { cmd: "unauthorize-guest", mac: mac.toLowerCase() });
  }
}

module.exports = { UniFi };
