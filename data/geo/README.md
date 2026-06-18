# RegiKaha Geodata

Arquitectura conservadora para incorporar ciudades, pueblos, municipios, comunas, boroughs, distritos y códigos postales de los países activos sin meter listas gigantes en componentes React.

El frontend usa `/api/geo/search?q=&country=&limit=` y `components/geo/PlaceAutocomplete.tsx`. El endpoint intenta D1 (`geo_places`, `geo_aliases`) y cae a `seed-small.json` en desarrollo si la base no está disponible.

La carga completa debe hacerse por país con los scripts de `scripts/` y datasets documentados en `sources.md`.
