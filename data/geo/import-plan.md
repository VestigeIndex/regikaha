# Plan de importación

1. Descargar datasets por país en `data/geo/raw/<country>/` fuera del bundle frontend.
2. Ejecutar `node scripts/normalize-geodata.mjs --country=ES --input=...`.
3. Generar chunks JSON por país con `node scripts/build-geo-index.mjs`.
4. Validar mínimos obligatorios con `node scripts/validate-geodata.mjs`.
5. Importar a D1 en lotes hacia `geo_places` y `geo_aliases`.
6. Marcar `is_featured` e `is_indexable` solo cuando haya oferta, demanda, ciudad destacada o estrategia SEO aprobada.

No crear páginas indexables para localidades sin oferta/demanda.
