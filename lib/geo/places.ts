import seed from "@/data/geo/seed-small.json";
import type { Place, PlaceSearchResult } from "./types";
import { compactSearchText, normalizeGeoText } from "./normalize";

export const seedPlaces: Place[] = (seed as Place[]).map((place) => ({
  ...place,
  normalizedName: place.normalizedName || normalizeGeoText(place.localityName || place.municipalityName || place.slug),
  searchText:
    place.searchText ||
    compactSearchText([
      place.localityName,
      place.municipalityName,
      place.postalCode,
      place.admin1Name,
      place.admin2Name,
      place.countryName,
      ...place.aliases,
    ]),
}));

export function placeLabel(place: Place) {
  return [
    place.localityName || place.municipalityName || place.slug,
    place.postalCode,
    place.admin2Name || place.admin1Name,
    place.countryName,
  ]
    .filter(Boolean)
    .join(", ");
}

export function toPlaceSearchResult(place: Place): PlaceSearchResult {
  const name = place.localityName || place.municipalityName || place.slug;
  return {
    id: place.id,
    name,
    label: placeLabel(place),
    countryCode: place.countryCode,
    countryName: place.countryName,
    admin1Name: place.admin1Name,
    admin2Name: place.admin2Name,
    municipalityName: place.municipalityName,
    localityName: place.localityName,
    postalCode: place.postalCode,
    latitude: place.latitude,
    longitude: place.longitude,
    placeType: place.placeType,
    slug: place.slug,
  };
}
