import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "data", "geo", "seed-small.json");
const allowedCountries = new Set(["ES", "FR", "IT", "PT", "CH", "DE", "NL", "BE", "IE", "GB"]);

const raw = JSON.parse(await readFile(file, "utf8"));
const places = Array.isArray(raw) ? raw : raw.places;
if (!Array.isArray(places)) throw new Error("seed-small.json debe ser un array o contener { places: [] }");

const ids = new Set();
for (const place of places) {
  const name = place.name || place.localityName || place.municipalityName;
  if (!name) throw new Error(`Lugar inválido: falta nombre en ${JSON.stringify(place)}`);
  for (const key of ["id", "slug", "countryCode", "latitude", "longitude", "placeType"]) {
    if (place[key] === undefined || place[key] === null || place[key] === "") {
      throw new Error(`Lugar inválido: falta ${key} en ${JSON.stringify(place)}`);
    }
  }
  if (ids.has(place.id)) throw new Error(`ID duplicado: ${place.id}`);
  ids.add(place.id);
  if (!allowedCountries.has(place.countryCode)) throw new Error(`País no activo: ${place.countryCode} (${place.id})`);
}

console.log(`Geodata OK: ${places.length} lugares validados en ${[...allowedCountries].join(", ")}`);
