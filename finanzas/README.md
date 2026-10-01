# Finanzas de Casa

Dashboard interactivo con dos secciones (Ahorro y Gastos) y una pestaña de Comparativa entre años.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El dashboard tal como se publica en claude.ai (Artifact, datos sincronizados en la nube). |
| `local/` | **Versión independiente** para tenerla en tu ordenador o en un servidor de casa. Copia esta carpeta entera. |
| `datos_2025.json`, `datos_2026.json` | Datos extraídos de los Excel (AHORRO Hoja1, GASTOS Hoja4). |
| `build_local.py` | Regenera `local/index.html` si cambias `index.html`. |

## Usarlo fuera de claude.ai

### Opción A: abrir el archivo directamente
Haz doble clic en `local/index.html`. Los datos se guardan **solo en ese navegador**.
La primera vez, carga tus años con **Datos → Importar (.json)** (`datos_2025.json`, `datos_2026.json`).
Exporta una copia de vez en cuando (**Datos → Exportar copia**).

### Opción B: servidor local (recomendado)
Necesita Python 3, sin instalar nada más:

```bash
cd local
python3 server.py                  # http://localhost:8080 (solo este ordenador)
python3 server.py --host 0.0.0.0   # también desde el móvil u otros PCs de tu red: http://IP-DEL-PC:8080
```

- Los datos se guardan en `local/datos/2025.json`, `2026.json`… (un archivo por año). Haz copia de esa carpeta.
- La primera vez carga automáticamente los `datos_AAAA.json` incluidos.
- Todos los dispositivos que abran la dirección ven los mismos datos (se refresca cada 20 s).
- Al borrar un año, se guarda una copia en `local/datos/copias/`.
- No tiene usuario ni contraseña: úsalo solo dentro de tu red de casa, no lo abras a internet.

Con un NAS o Raspberry Pi: copia `local/` y lanza `python3 server.py --host 0.0.0.0` al arrancar.
Si lo sirves con Apache/nginx como web estática, funciona igual que la opción A (datos en cada navegador).

### Pasar datos del Artifact a la versión local
En el Artifact: **Datos → Exportar copia** y, en la versión local, **Datos → Importar**.

## Cómo se usa
- **Ahorro**: cada fondo tiene saldo inicial y aportación mensual. «Repartir en meses» prorratea un importe
  entre los meses elegidos. Las retiradas (pagos desde un fondo) restan del saldo de ese fondo.
- **Gastos**: conceptos × meses, editables. «Rellenar meses» pone un importe mensual o reparte un total.
- **+ Año**: crea un año nuevo copiando conceptos (e importes) del anterior; el saldo final de cada fondo
  pasa a ser el saldo inicial.
- **Comparativa**: elige años para comparar gasto mensual, saldo de ahorro y totales por concepto.
  Los conceptos se emparejan por nombre: mantén el mismo nombre de un año a otro.
