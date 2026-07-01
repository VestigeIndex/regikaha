import type { Location } from "@/lib/types";
import { europeanCountryOptions } from "@/lib/market";
import { prioritySeoPlaces } from "@/lib/geo/priority-places";

const countryLocations: Location[] = europeanCountryOptions.map((country) => ({
  slug: country.code.toLowerCase(),
  label: country.name,
  scope: "country",
  countryCode: country.code,
  country: country.name,
}));

const cityLocations: Location[] = prioritySeoPlaces.map((place) => ({
  slug: place.slug,
  label: `${place.localityName || place.municipalityName || place.slug}, ${place.countryName}`,
  scope: "city",
  countryCode: place.countryCode,
  country: place.countryName,
  city: place.localityName || place.municipalityName || place.slug,
  province: place.admin1Name,
  autonomousCommunity: place.admin1Name,
}));

export const locations: Location[] = [...countryLocations, ...cityLocations];

export const countrySearchLocations = countryLocations;
export const citySearchLocations = cityLocations;

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
