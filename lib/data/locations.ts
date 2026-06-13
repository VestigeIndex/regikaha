import type { Location } from "@/lib/types";

/** Ubicaciones iniciales. Ampliable a todas las provincias de España. */
export const locations: Location[] = [
  { slug: "madrid", city: "Madrid", province: "Madrid", autonomousCommunity: "Comunidad de Madrid" },
  { slug: "barcelona", city: "Barcelona", province: "Barcelona", autonomousCommunity: "Cataluña" },
  { slug: "valencia", city: "Valencia", province: "Valencia", autonomousCommunity: "Comunidad Valenciana" },
  { slug: "sevilla", city: "Sevilla", province: "Sevilla", autonomousCommunity: "Andalucía" },
  { slug: "malaga", city: "Málaga", province: "Málaga", autonomousCommunity: "Andalucía" },
  { slug: "zaragoza", city: "Zaragoza", province: "Zaragoza", autonomousCommunity: "Aragón" },
  { slug: "bilbao", city: "Bilbao", province: "Vizcaya", autonomousCommunity: "País Vasco" },
  { slug: "murcia", city: "Murcia", province: "Murcia", autonomousCommunity: "Región de Murcia" },
  { slug: "palma", city: "Palma", province: "Islas Baleares", autonomousCommunity: "Islas Baleares" },
  { slug: "alicante", city: "Alicante", province: "Alicante", autonomousCommunity: "Comunidad Valenciana" },
  { slug: "valladolid", city: "Valladolid", province: "Valladolid", autonomousCommunity: "Castilla y León" },
  { slug: "vigo", city: "Vigo", province: "Pontevedra", autonomousCommunity: "Galicia" },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
