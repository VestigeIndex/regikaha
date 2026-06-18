import { readFile } from "node:fs/promises";
import path from "node:path";

function sql(value) {
  if (value === undefined || value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const root = process.cwd();
const source = path.join(root, "data", "geo", "seed-small.json");
const raw = JSON.parse(await readFile(source, "utf8"));
const places = Array.isArray(raw) ? raw : raw.places;

console.log("-- Ejecuta con: node scripts/import-geodata.mjs | npx wrangler d1 execute <DB> --remote --file -");
console.log("BEGIN TRANSACTION;");
for (const place of places) {
  const displayName = place.name || place.localityName || place.municipalityName || place.slug;
  const searchText = normalize([
    displayName,
    place.localityName,
    place.admin1Name,
    place.admin2Name,
    place.postalCode,
    place.countryCode,
  ].filter(Boolean).join(" "));
  const values = [
    place.id,
    "seed-small",
    place.sourceId || place.id,
    displayName,
    normalize(displayName),
    normalize(place.asciiName || displayName),
    place.slug,
    place.countryCode,
    place.countryName,
    place.admin1Name,
    place.admin2Name,
    place.localityName,
    place.postalCode,
    place.latitude,
    place.longitude,
    place.placeType,
    place.population || 0,
    searchText,
  ].map(sql).join(",");
  console.log(`INSERT OR REPLACE INTO geo_places (id,source,source_id,name,normalized_name,ascii_name,slug,country_code,country_name,admin1_name,admin2_name,locality_name,postal_code,latitude,longitude,place_type,population,search_text) VALUES (${values});`);
}
console.log("COMMIT;");
