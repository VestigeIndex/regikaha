import { readFile, readdir } from "node:fs/promises";
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

const coverageRoot = path.join(root, "public", "geo", "places");
const manifest = JSON.parse(await readFile(path.join(coverageRoot, "manifest.json"), "utf8"));
let coverageTotal = 0;
for (const country of allowedCountries) {
  const entry = manifest.countries?.[country];
  if (!entry || Number(entry.places || 0) < 1000) throw new Error(`Cobertura incompleta para ${country}`);
  const shards = (await readdir(path.join(coverageRoot, country))).filter((name) => name.endsWith(".json"));
  if (shards.length !== Number(entry.shards)) throw new Error(`Número de fragmentos incorrecto para ${country}`);
  coverageTotal += Number(entry.places);
}
if (coverageTotal !== Number(manifest.totalPlaces)) throw new Error("El total de cobertura no coincide con el manifiesto");

console.log(`Geodata OK: ${places.length} lugares destacados y ${coverageTotal} localidades buscables en ${[...allowedCountries].join(", ")}`);
