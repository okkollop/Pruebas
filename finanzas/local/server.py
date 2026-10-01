#!/usr/bin/env python3
"""Servidor local de Finanzas de Casa.

Sirve el dashboard y guarda los datos en la carpeta datos/ (un archivo JSON por año),
así todos los dispositivos de casa ven y editan los mismos datos.

Uso:
    python3 server.py                 # http://localhost:8080
    python3 server.py --port 9000
    python3 server.py --host 0.0.0.0  # accesible desde otros dispositivos de tu red

Solo necesita Python 3 (sin instalar nada más).
"""
import argparse
import json
import re
import shutil
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "datos"
BACKUPS = DATA / "copias"
YEAR_RE = re.compile(r"^/api/years/(\d{4})$")


def read_years():
    years = {}
    for f in sorted(DATA.glob("*.json")):
        if re.fullmatch(r"\d{4}", f.stem):
            try:
                years[f.stem] = json.loads(f.read_text(encoding="utf-8"))
            except ValueError:
                pass
    return years


def seed():
    """Primera vez: si la carpeta datos/ está vacía, carga los datos_AAAA.json incluidos."""
    DATA.mkdir(exist_ok=True)
    if any(DATA.glob("*.json")):
        return
    for f in HERE.glob("datos_*.json"):
        year = f.stem.split("_")[-1]
        if re.fullmatch(r"\d{4}", year):
            shutil.copyfile(f, DATA / f"{year}.json")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(HERE), **kw)

    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/years":
            return self._json(200, {"years": read_years()})
        if self.path.startswith("/datos") or self.path.endswith(".py"):
            return self.send_error(404)
        return super().do_GET()

    def do_PUT(self):
        m = YEAR_RE.match(self.path)
        if not m:
            return self.send_error(404)
        length = int(self.headers.get("Content-Length") or 0)
        if length > 2_000_000:
            return self.send_error(413)
        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(data, dict):
                raise ValueError
        except ValueError:
            return self._json(400, {"error": "JSON no válido"})
        target = DATA / f"{m.group(1)}.json"
        tmp = target.with_suffix(".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        tmp.replace(target)
        return self._json(200, {"ok": True})

    def do_DELETE(self):
        m = YEAR_RE.match(self.path)
        if not m:
            return self.send_error(404)
        target = DATA / f"{m.group(1)}.json"
        if target.exists():
            BACKUPS.mkdir(exist_ok=True)
            stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            target.replace(BACKUPS / f"{m.group(1)}-borrado-{stamp}.json")
        return self._json(200, {"ok": True})

    def log_message(self, fmt, *args):
        if not self.path.startswith("/api/"):
            return
        super().log_message(fmt, *args)


def main():
    ap = argparse.ArgumentParser(description="Servidor local de Finanzas de Casa")
    ap.add_argument("--host", default="127.0.0.1", help="0.0.0.0 para abrirlo a tu red local")
    ap.add_argument("--port", type=int, default=8080)
    args = ap.parse_args()
    seed()
    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    shown = "localhost" if args.host in ("127.0.0.1", "0.0.0.0") else args.host
    print(f"Finanzas de Casa en http://{shown}:{args.port}  (Ctrl+C para parar)")
    print(f"Datos en: {DATA}")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
