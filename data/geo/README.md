# Regi Kaha Geodata

Arquitectura conservadora para incorporar ciudades, pueblos, municipios, comunas, boroughs, distritos y códigos postales de los países activos sin meter listas gigantes en componentes React.

El frontend usa `/api/geo/search?q=&country=&limit=` y `components/geo/PlaceAutocomplete.tsx`. El endpoint intenta D1 (`geo_places`, `geo_aliases`) y cae a `seed-small.json` en desarrollo si la base no está disponible.

La carga completa debe hacerse por país con los scripts de `scripts/` y datasets documentados en `sources.md`.

`scripts/build-geonames-coverage.mjs` genera índices estáticos fragmentados por país y prefijo. Estos índices permiten buscar todas las ciudades, municipios, pueblos, suburbios y localidades pobladas integradas sin cargar una lista masiva en React ni convertir cada localidad sin oferta en una página SEO indexable.

La disponibilidad territorial y la disponibilidad profesional son conceptos distintos: una localidad puede buscarse y usarse en proyectos o perfiles aunque todavía no tenga profesionales activos. La interfaz debe mostrar ese estado con transparencia.
