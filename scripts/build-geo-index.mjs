import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const root = process.cwd();
const source = path.join(root, "data", "geo", "seed-small.json");
const output = path.join(root, "data", "geo", "index-small.json");
const raw = JSON.parse(await readFile(source, "utf8"));
const places = Array.isArray(raw) ? raw : raw.places;

const indexed = places.map((place) => ({
  ...place,
  normalizedName: normalize(place.name || place.localityName || place.municipalityName || place.slug),
  searchText: normalize([
    place.name,
    place.localityName,
    place.admin1Name,
    place.admin2Name,
    place.postalCode,
    place.countryCode,
  ].filter(Boolean).join(" ")),
}));

await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), places: indexed }, null, 2)}\n`);
console.log(`Índice geográfico escrito en ${output}`);
