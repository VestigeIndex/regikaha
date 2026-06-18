import type { Place, PlaceSearchResult } from "./types";
import { normalizeGeoText } from "./normalize";
import { toPlaceSearchResult } from "./places";

function rowToPlace(row: any): Place {
  return {
    id: String(row.id),
    source: String(row.source || "d1"),
    sourceId: String(row.source_id || row.sourceId || row.id),
    countryCode: String(row.country_code || row.countryCode || "").toUpperCase(),
    countryName: String(row.country_name || row.countryName || ""),
    admin1Code: row.admin1_code || row.admin1Code || undefined,
    admin1Name: row.admin1_name || row.admin1Name || undefined,
    admin2Code: row.admin2_code || row.admin2Code || undefined,
    admin2Name: row.admin2_name || row.admin2Name || undefined,
    municipalityName: row.municipality_name || row.municipalityName || undefined,
    localityName: row.locality_name || row.localityName || undefined,
    postalCode: row.postal_code || row.postalCode || undefined,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    population: Number(row.population || 0),
    placeType: row.place_type || row.placeType || "city",
    slug: String(row.slug || row.id),
    normalizedName: row.normalized_name || row.normalizedName || undefined,
    aliases: typeof row.aliases === "string" ? JSON.parse(row.aliases || "[]") : [],
    searchText: row.search_text || row.searchText || undefined,
    isFeatured: !!(row.is_featured ?? row.isFeatured),
    isIndexable: !!(row.is_indexable ?? row.isIndexable),
  };
}

export async function searchPlacesD1(env: any, { q, country, limit = 20 }: { q: string; country?: string; limit?: number }): Promise<PlaceSearchResult[]> {
  if (!env?.DB || normalizeGeoText(q).length < 2) return [];
  const capped = Math.max(1, Math.min(limit, 20));
  const query = normalizeGeoText(q);
  const binds: unknown[] = [`%${query}%`, `${query}%`, q.trim(), capped];
  let countryClause = "";
  if (country) {
    countryClause = "AND country_code = ?";
    binds.splice(3, 0, country.toUpperCase());
  }
  const rows = await env.DB.prepare(
    `SELECT *
     FROM geo_places
     WHERE (search_text LIKE ? OR normalized_name LIKE ? OR postal_code = ?)
     ${countryClause}
     ORDER BY is_featured DESC, population DESC
     LIMIT ?`,
  )
    .bind(...binds)
    .all();
  return (rows.results || []).map(rowToPlace).map(toPlaceSearchResult);
}
