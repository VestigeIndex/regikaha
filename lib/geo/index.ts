import type { Professional } from "@/lib/types";
import { getCategoryById } from "@/lib/data/categories";

export * from "./adapters";
export * from "./distance";
export * from "./normalize";
export * from "./places";
export * from "./search";
export * from "./types";

export type Coordinates = { lat: number; lng: number };

export type CoverageStatus =
  | "sin-cobertura"
  | "verificando"
  | "inicial"
  | "activa"
  | "fuerte";

export const cityCoordinates: Record<string, Coordinates> = {
  madrid: { lat: 40.4168, lng: -3.7038 },
  barcelona: { lat: 41.3874, lng: 2.1686 },
  valencia: { lat: 39.4699, lng: -0.3763 },
  sevilla: { lat: 37.3891, lng: -5.9845 },
  malaga: { lat: 36.7213, lng: -4.4214 },
  zaragoza: { lat: 41.6488, lng: -0.8891 },
  bilbao: { lat: 43.263, lng: -2.935 },
  alicante: { lat: 38.3452, lng: -0.481 },
  lisboa: { lat: 38.7223, lng: -9.1393 },
  porto: { lat: 41.1579, lng: -8.6291 },
  paris: { lat: 48.8566, lng: 2.3522 },
  lyon: { lat: 45.764, lng: 4.8357 },
  berlin: { lat: 52.52, lng: 13.405 },
  munich: { lat: 48.1351, lng: 11.582 },
  milan: { lat: 45.4642, lng: 9.19 },
  milano: { lat: 45.4642, lng: 9.19 },
  roma: { lat: 41.9028, lng: 12.4964 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  rotterdam: { lat: 51.9244, lng: 4.4777 },
  bruselas: { lat: 50.8503, lng: 4.3517 },
  bruxelles: { lat: 50.8503, lng: 4.3517 },
  antwerpen: { lat: 51.2194, lng: 4.4025 },
  amberes: { lat: 51.2194, lng: 4.4025 },
  dublin: { lat: 53.3498, lng: -6.2603 },
  cork: { lat: 51.8985, lng: -8.4756 },
  london: { lat: 51.5072, lng: -0.1276 },
  manchester: { lat: 53.4808, lng: -2.2426 },
  zurich: { lat: 47.3769, lng: 8.5417 },
  geneva: { lat: 46.2044, lng: 6.1432 },
  ginebra: { lat: 46.2044, lng: 6.1432 },
  stuttgart: { lat: 48.7758, lng: 9.1829 },
  bonn: { lat: 50.7374, lng: 7.0982 },
  terrassa: { lat: 41.5632, lng: 2.0089 },
  sabadell: { lat: 41.5463, lng: 2.1086 },
  rubi: { lat: 41.4923, lng: 2.0331 },
  "sant-cugat-del-valles": { lat: 41.4706, lng: 2.0853 },
  algeciras: { lat: 36.1408, lng: -5.4562 },
  marbella: { lat: 36.5101, lng: -4.8824 },
};

const countryCoordinates: Record<string, Coordinates> = {
  ES: { lat: 40.4168, lng: -3.7038 },
  FR: { lat: 48.8566, lng: 2.3522 },
  IT: { lat: 41.9028, lng: 12.4964 },
  PT: { lat: 38.7223, lng: -9.1393 },
  CH: { lat: 46.948, lng: 7.4474 },
  DE: { lat: 52.52, lng: 13.405 },
  NL: { lat: 52.3676, lng: 4.9041 },
  BE: { lat: 50.8503, lng: 4.3517 },
  IE: { lat: 53.3498, lng: -6.2603 },
  GB: { lat: 51.5072, lng: -0.1276 },
};

const fallbackActiveMarkets = { lat: 46.9, lng: 7.4 };

function key(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function coordinatesForCity(city?: string, countryCode?: string): Coordinates {
  if (city && cityCoordinates[key(city)]) return cityCoordinates[key(city)];
  if (countryCode && countryCoordinates[countryCode.toUpperCase()]) {
    return countryCoordinates[countryCode.toUpperCase()];
  }
  return fallbackActiveMarkets;
}

export function coordinatesForProfessional(pro: Professional, index = 0): Coordinates {
  const base = coordinatesForCity(pro.city || pro.locationSlug, pro.countryCode);
  const offset = ((index % 7) - 3) * 0.018;
  const ring = (Math.floor(index / 7) % 5) * 0.012;
  return { lat: base.lat + offset, lng: base.lng + ring - offset / 2 };
}

export function coverageStatus(professionalsCount: number, demandCount = 0): CoverageStatus {
  if (professionalsCount >= 8) return "fuerte";
  if (professionalsCount >= 4) return "activa";
  if (professionalsCount >= 1) return "inicial";
  if (demandCount > 0) return "verificando";
  return "sin-cobertura";
}

export function coverageLabel(status: CoverageStatus): string {
  switch (status) {
    case "fuerte":
      return "Cobertura fuerte";
    case "activa":
      return "Cobertura activa";
    case "inicial":
      return "Cobertura inicial";
    case "verificando":
      return "Verificando profesionales";
    case "sin-cobertura":
      return "Sin cobertura";
  }
}

export function professionalMarkerKind(pro: Professional): "company" | "technical" | "founder" | "professional" {
  if (pro.founderMember) return "founder";
  if (pro.type === "empresa_reformas" || pro.type === "multiservicio") return "company";
  if (pro.type === "estudio_arquitectura" || pro.type === "ingenieria") return "technical";
  return "professional";
}

export function primaryCategoryName(pro: Professional): string {
  return getCategoryById(pro.categoryIds[0])?.name || "Servicios técnicos";
}
