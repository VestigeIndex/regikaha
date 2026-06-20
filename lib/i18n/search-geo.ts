import type { Locale } from "./config";

export const searchGeoDictionaries: Record<Locale, {
  placeholder: string;
  radius: string;
  unlimited: string;
  useMyLocation: string;
  currentLocation: string;
  locationError: string;
  distanceAway: (distance: number) => string;
}> = {
  es: { placeholder: "Ciudad, pueblo o código postal", radius: "Radio de búsqueda", unlimited: "Sin limitar radio", useMyLocation: "Usar mi ubicación", currentLocation: "Mi ubicación actual", locationError: "No se pudo obtener tu ubicación", distanceAway: (distance) => `A ${distance.toFixed(1)} km` },
  fr: { placeholder: "Ville, commune ou code postal", radius: "Rayon de recherche", unlimited: "Aucune limite de rayon", useMyLocation: "Utiliser ma position", currentLocation: "Ma position actuelle", locationError: "Impossible d'obtenir votre position", distanceAway: (distance) => `À ${distance.toFixed(1)} km` },
  it: { placeholder: "Città, comune o CAP", radius: "Raggio di ricerca", unlimited: "Nessun limite di raggio", useMyLocation: "Usa la mia posizione", currentLocation: "La mia posizione attuale", locationError: "Impossibile ottenere la posizione", distanceAway: (distance) => `A ${distance.toFixed(1)} km` },
  pt: { placeholder: "Cidade, localidade ou código postal", radius: "Raio de pesquisa", unlimited: "Sem limite de raio", useMyLocation: "Usar a minha localização", currentLocation: "A minha localização atual", locationError: "Não foi possível obter a sua localização", distanceAway: (distance) => `A ${distance.toFixed(1)} km` },
  de: { placeholder: "Stadt, Gemeinde oder Postleitzahl", radius: "Suchradius", unlimited: "Radius nicht begrenzen", useMyLocation: "Meinen Standort verwenden", currentLocation: "Mein aktueller Standort", locationError: "Standort konnte nicht ermittelt werden", distanceAway: (distance) => `${distance.toFixed(1)} km entfernt` },
  nl: { placeholder: "Stad, gemeente of postcode", radius: "Zoekradius", unlimited: "Geen radiusbeperking", useMyLocation: "Mijn locatie gebruiken", currentLocation: "Mijn huidige locatie", locationError: "Je locatie kon niet worden opgehaald", distanceAway: (distance) => `${distance.toFixed(1)} km afstand` },
  en: { placeholder: "City, town or postcode", radius: "Search radius", unlimited: "No radius limit", useMyLocation: "Use my location", currentLocation: "My current location", locationError: "Your location could not be obtained", distanceAway: (distance) => `${distance.toFixed(1)} km away` },
};
