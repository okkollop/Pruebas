#!/usr/bin/env python3
"""Genera local/index.html (versión independiente del artefacto) a partir de index.html.

Uso: python3 build_local.py
Vuelve a ejecutarlo cada vez que cambie index.html.
"""
from pathlib import Path
import shutil

here = Path(__file__).resolve().parent
src = (here / "index.html").read_text(encoding="utf-8")
src = src.replace(
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js",
    "chart.umd.min.js",  # copia local: funciona sin internet
)
head = (
    "<!doctype html>\n<html lang=\"es\">\n<head>\n"
    "<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n"
    "<style>[hidden]{display:none!important}img{max-width:100%}</style>\n"
    "</head>\n<body>\n"
)
out = here / "local"
out.mkdir(exist_ok=True)
(out / "index.html").write_text(head + src + "\n</body>\n</html>\n", encoding="utf-8")
for f in here.glob("datos_*.json"):
    shutil.copyfile(f, out / f.name)
print("Generado", out / "index.html")
