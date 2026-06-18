import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function slug(value) {
  return normalize(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const root = process.cwd();
const source = path.join(root, "data", "geo", "seed-small.json");
const raw = JSON.parse(await readFile(source, "utf8"));
const places = Array.isArray(raw) ? raw : raw.places;
const normalized = places.map((place) => ({
  ...place,
  asciiName: normalize(place.asciiName || place.localityName || place.municipalityName || place.name),
  slug: place.slug || `${String(place.countryCode).toLowerCase()}-${slug(place.localityName || place.municipalityName || place.name)}`,
}));

await writeFile(source, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Geodata normalizada: ${normalized.length} lugares`);
