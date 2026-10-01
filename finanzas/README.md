# Finanzas de Casa

Dashboard interactivo con dos secciones (Ahorro y Gastos) y una pestaña de Comparativa entre años.

- `index.html`: el dashboard. Publicado como Artifact (datos guardados y sincronizados en la nube).
  Si se abre como archivo local, guarda los datos en el navegador (localStorage).
- `datos_2026.json`: datos de 2026 extraídos de `AHORRO 2026.xlsx` (Hoja1) y `GASTOS 2026.xlsx` (Hoja4).
  Se pueden cargar con **Datos → Importar (.json)**.

## Cómo se usa
- **Ahorro**: cada fondo tiene saldo inicial y aportación mensual. «Repartir en meses» prorratea un importe
  entre los meses elegidos. Las retiradas (pagos desde un fondo) restan del saldo de ese fondo.
- **Gastos**: conceptos × meses, editables. «Rellenar meses» pone un importe mensual o reparte un total.
- **+ Año**: crea un año nuevo copiando conceptos (e importes) del anterior; el saldo final de cada fondo
  pasa a ser el saldo inicial.
- **Comparativa**: elige años para comparar gasto mensual, saldo de ahorro y totales por concepto.
  Los conceptos se emparejan por nombre.
