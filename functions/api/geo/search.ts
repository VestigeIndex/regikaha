import { bad, json } from "../../../apilib/http";
import { isActiveCountryCode } from "../../../lib/market";
import { activeMarkets, getActiveMarketByCode } from "../../../lib/market";
import { searchPlacesD1 } from "../../../lib/geo/adapters";
import { normalizeGeoText } from "../../../lib/geo/normalize";
import { searchPlaces } from "../../../lib/geo/search";
import type { PlaceSearchResult, PlaceType } from "../../../lib/geo/types";
import { cachePublicResponse } from "../../../packages/cost-guards";

function clampLimit(value: string | null): number {
  const parsed = Number(value || 8);
  if (!Number.isFinite(parsed)) return 8;
  return Math.max(1, Math.min(20, Math.round(parsed)));
}

type CompactPlace = [string, string, string, string, string, string, number, number, PlaceType, number, string[]];

function shardPrefix(value: string) {
  return normalizeGeoText(value).replace(/[^a-z0-9]/g, "").slice(0, 1).padEnd(1, "_");
}

function compactResult(row: CompactPlace, country: string): PlaceSearchResult {
  const market = getActiveMarketByCode(country);
  const parts = [row[1], row[5], row[4], market?.name].filter((item, index, list) => item && list.indexOf(item) === index);
  return {
    id: row[0],
    name: row[1],
    label: parts.join(", "),
    countryCode: country,
    countryName: market?.name || country,
    admin1Name: row[4] || undefined,
    admin2Name: row[5] || undefined,
    municipalityName: row[5] || row[1],
    localityName: row[1],
    latitude: row[6],
    longitude: row[7],
    placeType: row[8],
    slug: row[3],
  };
}

async function searchCoverageAssets(request: Request, query: string, country: string, limit: number): Promise<PlaceSearchResult[]> {
  const normalizedQuery = normalizeGeoText(query);
  const prefix = shardPrefix(normalizedQuery);
  const countries = country ? [country] : activeMarkets.map((market) => market.code);
  const rows = await Promise.all(countries.map(async (code) => {
    try {
      const url = new URL(`/geo/places/${code}/${prefix}.json`, request.url);
      const response = await fetch(url, { cf: { cacheTtl: 86400, cacheEverything: true } } as RequestInit);
      if (!response.ok) return [];
      const data = await response.json();
      return (Array.isArray(data) ? data : []).map((row) => ({ row: row as CompactPlace, country: code }));
    } catch {
      return [];
    }
  }));

  const matches = rows.flat().filter(({ row }) => {
    const values = [normalizeGeoText(row[1]), row[2], normalizeGeoText(row[4]), normalizeGeoText(row[5]), ...(row[10] || [])];
    return values.some((value) => value.includes(normalizedQuery));
  });
  matches.sort((left, right) => {
    const leftName = normalizeGeoText(left.row[1]);
    const rightName = normalizeGeoText(right.row[1]);
    const leftScore = leftName === normalizedQuery ? 3 : leftName.startsWith(normalizedQuery) ? 2 : 1;
    const rightScore = rightName === normalizedQuery ? 3 : rightName.startsWith(normalizedQuery) ? 2 : 1;
    return rightScore - leftScore || right.row[9] - left.row[9] || leftName.localeCompare(rightName);
  });

  const unique = new Map<string, PlaceSearchResult>();
  for (const match of matches) {
    if (!unique.has(match.row[0])) unique.set(match.row[0], compactResult(match.row, match.country));
    if (unique.size >= limit) break;
  }
  return [...unique.values()];
}

// GET /api/geo/search?q=&country=&limit=
async function geoSearchResponse(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const country = (url.searchParams.get("country") || "").trim().toUpperCase();
  const limit = clampLimit(url.searchParams.get("limit"));

  if (q.length < 2) return json({ total: 0, results: [] });
  if (country && !isActiveCountryCode(country)) return bad("País no disponible en Regi Kaha", 400);

  try {
    if (env.DB) {
      const results = await searchPlacesD1(env, { q, country: country || undefined, limit });
      if (results.length) return json({ total: results.length, results });
    }
  } catch {
    // Si D1 aún no tiene geodata importada, el seed mantiene el alta y la búsqueda operativas.
  }

  const coverageResults = await searchCoverageAssets(request, q, country, limit);
  if (coverageResults.length) return json({ total: coverageResults.length, results: coverageResults, source: "coverage_index" });

  const results = searchPlaces({ q, country: country || undefined, limit });
  return json({ total: results.length, results });
}

export async function onRequestGet(context: any) {
  return cachePublicResponse(context.request, 900, () => geoSearchResponse(context));
}
