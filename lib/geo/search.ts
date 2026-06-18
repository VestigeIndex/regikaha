import type { PlaceSearchResult } from "./types";
import { normalizeGeoText } from "./normalize";
import { seedPlaces, toPlaceSearchResult } from "./places";

export function searchPlaces({ q, country, limit = 20 }: { q: string; country?: string; limit?: number }): PlaceSearchResult[] {
  const query = normalizeGeoText(q);
  if (query.length < 2) return [];
  const countryCode = country?.toUpperCase();
  const capped = Math.max(1, Math.min(limit, 20));

  return seedPlaces
    .filter((place) => !countryCode || place.countryCode === countryCode)
    .map((place) => {
      const searchText = place.searchText || "";
      const exact = place.normalizedName === query || place.postalCode === q.trim();
      const starts = searchText.split(" ").some((part) => part.startsWith(query));
      const includes = searchText.includes(query);
      const score = exact ? 100 : starts ? 70 : includes ? 40 : 0;
      return { place, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.place.population || 0) - Number(a.place.population || 0))
    .slice(0, capped)
    .map((item) => toPlaceSearchResult(item.place));
}
