export type PlaceType =
  | "country"
  | "region"
  | "province"
  | "municipality"
  | "city"
  | "town"
  | "village"
  | "commune"
  | "borough"
  | "district"
  | "suburb"
  | "postal_code";

export interface Place {
  id: string;
  source: string;
  sourceId: string;
  countryCode: string;
  countryName: string;
  admin1Code?: string;
  admin1Name?: string;
  admin2Code?: string;
  admin2Name?: string;
  municipalityName?: string;
  localityName?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  population?: number;
  placeType: PlaceType;
  slug: string;
  normalizedName?: string;
  aliases: string[];
  searchText?: string;
  isFeatured: boolean;
  isIndexable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  label: string;
  countryCode: string;
  countryName: string;
  admin1Name?: string;
  admin2Name?: string;
  municipalityName?: string;
  localityName?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  placeType: PlaceType;
  slug: string;
}
