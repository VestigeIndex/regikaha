export interface MaterialResult {
  normalized: string;
  category: string;
  dimensions?: string;
  unit: string;
  uses: string[];
  equivalents: string[];
  complements: string[];
  offers: Array<{ supplier: string; price: number; unit: string; distanceKm: number }>;
}

const aliases: Array<{ match: RegExp; normalized: string; category: string; unit: string; uses: string[]; equivalents: string[]; complements: string[] }> = [
  { match: /(pladur|drywall|placo|cartongesso|gipsplaat|gipskarton|gypsum)/i, normalized: "Gypsum plasterboard", category: "Dry construction", unit: "sheet", uses: ["Partitions", "Ceilings", "Wall lining"], equivalents: ["Fibre gypsum board", "Cement board"], complements: ["Metal profiles", "Joint compound", "Screws"] },
  { match: /(cement|cemento|ciment|zement|cimento|أسمنت|水泥)/i, normalized: "Portland cement", category: "Masonry", unit: "25 kg bag", uses: ["Mortar", "Concrete", "Repairs"], equivalents: ["Low-carbon cement", "Ready-mix mortar"], complements: ["Sand", "Aggregate", "Plasticiser"] },
  { match: /(lana.*roca|rock.?wool|laine.*roche|steinwolle|lana.*roccia|rocha|岩棉)/i, normalized: "Mineral wool insulation", category: "Insulation", unit: "pack", uses: ["Thermal insulation", "Acoustic insulation", "Fire protection"], equivalents: ["Glass wool", "Wood fibre"], complements: ["Vapour barrier", "Insulation fixings", "Sealing tape"] },
  { match: /(cable|cabo|kabel|cavo|电缆|كابل)/i, normalized: "Electrical cable", category: "Electrical", unit: "100 m roll", uses: ["Power circuits", "Lighting", "Distribution"], equivalents: ["Low-smoke cable", "Flexible conduit wire"], complements: ["Conduit", "Junction boxes", "Circuit protection"] },
  { match: /(tile|azulejo|carrelage|fliese|piastrella|tegel|rajola|瓷砖|بلاط)/i, normalized: "Porcelain tile", category: "Ceramics", unit: "m²", uses: ["Floors", "Wet rooms", "Wall finish"], equivalents: ["Ceramic tile", "Natural stone"], complements: ["Tile adhesive", "Grout", "Levelling clips"] },
];

function hash(value: string): number {
  return [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
}

export function analyseMaterial(query: string): MaterialResult {
  const clean = query.trim();
  const definition = aliases.find((entry) => entry.match.test(clean)) ?? {
    normalized: clean || "Construction material",
    category: "General materials",
    unit: "unit",
    uses: ["Construction work"],
    equivalents: ["Equivalent specification product"],
    complements: ["Manufacturer-recommended accessories"],
  };
  const dimensions = clean.match(/\b\d+(?:[.,]\d+)?\s?(?:mm|cm|m|x)\b.*$/i)?.[0];
  const base = 8 + (hash(clean.toLowerCase()) % 8400) / 100;
  return {
    normalized: definition.normalized,
    category: definition.category,
    dimensions,
    unit: definition.unit,
    uses: definition.uses,
    equivalents: definition.equivalents,
    complements: definition.complements,
    offers: [
      { supplier: "ConstruMarket Centro", price: Number(base.toFixed(2)), unit: definition.unit, distanceKm: 2.4 },
      { supplier: "ObraSupply", price: Number((base * 1.06).toFixed(2)), unit: definition.unit, distanceKm: 5.1 },
      { supplier: "ProMaterial", price: Number((base * 0.96).toFixed(2)), unit: definition.unit, distanceKm: 8.3 },
    ],
  };
}
