import { createReadStream } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";

const countries = ["ES", "FR", "IT", "PT", "CH", "DE", "NL", "BE", "IE", "GB"];
const countryNames = {
  ES: "España", FR: "Francia", IT: "Italia", PT: "Portugal", CH: "Suiza",
  DE: "Alemania", NL: "Países Bajos", BE: "Bélgica", IE: "Irlanda", GB: "Reino Unido",
};
const excludedCodes = new Set(["PPLH", "PPLQ", "PPLW"]);

function argument(name, fallback) {
  const item = process.argv.find((value) => value.startsWith(`--${name}=`));
  return item ? item.slice(name.length + 3) : fallback;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value) {
  return normalize(value).replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 72);
}

function prefix(value) {
  return normalize(value).replace(/[^a-z0-9]/g, "").slice(0, 1).padEnd(1, "_");
}

function placeType(featureCode, population) {
  if (featureCode === "PPLX") return "suburb";
  if (featureCode === "PPLL" || featureCode === "PPLF" || featureCode === "PPLCH") return "village";
  if (featureCode === "PPLC" || featureCode.startsWith("PPLA") || population >= 100000) return "city";
  if (population >= 10000) return "town";
  return "village";
}

async function codeMap(file, keyIndex, nameIndex) {
  const result = new Map();
  const content = await readFile(file, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line) continue;
    const columns = line.split("\t");
    result.set(columns[keyIndex], columns[nameIndex] || "");
  }
  return result;
}

const root = process.cwd();
const inputRoot = path.resolve(argument("input", path.join(root, "data", "geo", "raw", "geonames")));
const outputRoot = path.resolve(argument("output", path.join(root, "public", "geo", "places")));
const statsOutput = path.resolve(argument("stats", path.join(root, "lib", "geo", "coverage-stats.generated.ts")));
const allowedOutputRoot = path.resolve(path.join(root, "public", "geo"));
if (!outputRoot.startsWith(`${allowedOutputRoot}${path.sep}`)) throw new Error(`Unsafe output path: ${outputRoot}`);

const admin1 = await codeMap(path.join(inputRoot, "admin1CodesASCII.txt"), 0, 1);
const admin2 = await codeMap(path.join(inputRoot, "admin2Codes.txt"), 0, 1);
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const counts = {};
const manifest = {
  source: "GeoNames",
  sourceUrl: "https://download.geonames.org/export/dump/",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  generatedAt: new Date().toISOString(),
  countries: {},
};

for (const country of countries) {
  const shards = new Map();
  const file = path.join(inputRoot, country, `${country}.txt`);
  const lines = readline.createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  let count = 0;

  for await (const line of lines) {
    const columns = line.split("\t");
    if (columns[6] !== "P" || excludedCodes.has(columns[7])) continue;
    const id = columns[0];
    const name = columns[1];
    const asciiName = columns[2] || name;
    const population = Number(columns[14] || 0);
    const aliases = [...new Set((columns[3] || "").split(",").map(normalize).filter((item) => item.length >= 2 && item.length <= 80))].slice(0, 12);
    const normalizedName = normalize(name);
    if (normalizedName.length < 2) continue;
    const admin1Code = columns[10];
    const admin2Code = columns[11];
    const row = [
      `geonames:${id}`,
      name,
      normalize(asciiName),
      `${country.toLowerCase()}-${slug(name)}-${id}`,
      admin1.get(`${country}.${admin1Code}`) || "",
      admin2.get(`${country}.${admin1Code}.${admin2Code}`) || "",
      Number(columns[4]),
      Number(columns[5]),
      placeType(columns[7], population),
      population,
      aliases,
    ];
    const prefixes = new Set([prefix(normalizedName), prefix(asciiName), ...aliases.map(prefix)]);
    for (const shard of prefixes) {
      if (!shards.has(shard)) shards.set(shard, []);
      shards.get(shard).push(row);
    }
    count += 1;
  }

  const countryOutput = path.join(outputRoot, country);
  await mkdir(countryOutput, { recursive: true });
  for (const [shard, rows] of shards) {
    rows.sort((left, right) => right[9] - left[9] || String(left[1]).localeCompare(String(right[1])));
    await writeFile(path.join(countryOutput, `${shard}.json`), JSON.stringify(rows));
  }
  counts[country] = count;
  manifest.countries[country] = { name: countryNames[country], places: count, shards: shards.size };
  console.log(`${country}: ${count.toLocaleString("en")} places, ${shards.size} shards`);
}

manifest.totalPlaces = Object.values(counts).reduce((sum, value) => sum + value, 0);
await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await mkdir(path.dirname(statsOutput), { recursive: true });
await writeFile(
  statsOutput,
  `import type { ActiveCountryCode } from "@/lib/market";\n\nexport const coveragePlaceCounts: Record<ActiveCountryCode, number> = ${JSON.stringify(counts, null, 2)};\n\nexport const totalCoveragePlaces = ${manifest.totalPlaces};\n`,
);
console.log(`Total: ${manifest.totalPlaces.toLocaleString("en")} searchable places`);
