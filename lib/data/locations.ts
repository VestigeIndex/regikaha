import type { Location } from "@/lib/types";
import { europeanCountryOptions } from "@/lib/market";

const countryLocations: Location[] = europeanCountryOptions.map((country) => ({
  slug: country.code.toLowerCase(),
  label: country.name,
  scope: "country",
  countryCode: country.code,
  country: country.name,
}));

const cityLocations: Location[] = [
  { slug: "madrid", label: "Madrid, España", scope: "city", countryCode: "ES", country: "España", city: "Madrid", province: "Madrid", autonomousCommunity: "Comunidad de Madrid" },
  { slug: "barcelona", label: "Barcelona, España", scope: "city", countryCode: "ES", country: "España", city: "Barcelona", province: "Barcelona", autonomousCommunity: "Cataluña" },
  { slug: "valencia", label: "Valencia, España", scope: "city", countryCode: "ES", country: "España", city: "Valencia", province: "Valencia", autonomousCommunity: "Comunidad Valenciana" },
  { slug: "sevilla", label: "Sevilla, España", scope: "city", countryCode: "ES", country: "España", city: "Sevilla", province: "Sevilla", autonomousCommunity: "Andalucía" },
  { slug: "malaga", label: "Málaga, España", scope: "city", countryCode: "ES", country: "España", city: "Málaga", province: "Málaga", autonomousCommunity: "Andalucía" },
  { slug: "zaragoza", label: "Zaragoza, España", scope: "city", countryCode: "ES", country: "España", city: "Zaragoza", province: "Zaragoza", autonomousCommunity: "Aragón" },
  { slug: "bilbao", label: "Bilbao, España", scope: "city", countryCode: "ES", country: "España", city: "Bilbao", province: "Vizcaya", autonomousCommunity: "País Vasco" },
  { slug: "murcia", label: "Murcia, España", scope: "city", countryCode: "ES", country: "España", city: "Murcia", province: "Murcia", autonomousCommunity: "Región de Murcia" },
  { slug: "palma", label: "Palma, España", scope: "city", countryCode: "ES", country: "España", city: "Palma", province: "Islas Baleares", autonomousCommunity: "Islas Baleares" },
  { slug: "alicante", label: "Alicante, España", scope: "city", countryCode: "ES", country: "España", city: "Alicante", province: "Alicante", autonomousCommunity: "Comunidad Valenciana" },
  { slug: "valladolid", label: "Valladolid, España", scope: "city", countryCode: "ES", country: "España", city: "Valladolid", province: "Valladolid", autonomousCommunity: "Castilla y León" },
  { slug: "vigo", label: "Vigo, España", scope: "city", countryCode: "ES", country: "España", city: "Vigo", province: "Pontevedra", autonomousCommunity: "Galicia" },
  { slug: "lisboa", label: "Lisboa, Portugal", scope: "city", countryCode: "PT", country: "Portugal", city: "Lisboa", province: "Lisboa" },
  { slug: "porto", label: "Porto, Portugal", scope: "city", countryCode: "PT", country: "Portugal", city: "Porto", province: "Porto" },
  { slug: "paris", label: "París, Francia", scope: "city", countryCode: "FR", country: "Francia", city: "París", province: "Île-de-France" },
  { slug: "lyon", label: "Lyon, Francia", scope: "city", countryCode: "FR", country: "Francia", city: "Lyon", province: "Auvernia-Ródano-Alpes" },
  { slug: "berlin", label: "Berlín, Alemania", scope: "city", countryCode: "DE", country: "Alemania", city: "Berlín", province: "Berlín" },
  { slug: "munich", label: "Múnich, Alemania", scope: "city", countryCode: "DE", country: "Alemania", city: "Múnich", province: "Baviera" },
  { slug: "milan", label: "Milán, Italia", scope: "city", countryCode: "IT", country: "Italia", city: "Milán", province: "Lombardía" },
  { slug: "roma", label: "Roma, Italia", scope: "city", countryCode: "IT", country: "Italia", city: "Roma", province: "Lacio" },
  { slug: "zurich", label: "Zúrich, Suiza", scope: "city", countryCode: "CH", country: "Suiza", city: "Zúrich", province: "Zúrich" },
  { slug: "geneva", label: "Ginebra, Suiza", scope: "city", countryCode: "CH", country: "Suiza", city: "Ginebra", province: "Ginebra" },
  { slug: "amsterdam", label: "Ámsterdam, Países Bajos", scope: "city", countryCode: "NL", country: "Países Bajos", city: "Ámsterdam", province: "Holanda Septentrional" },
  { slug: "rotterdam", label: "Róterdam, Países Bajos", scope: "city", countryCode: "NL", country: "Países Bajos", city: "Róterdam", province: "Holanda Meridional" },
  { slug: "bruselas", label: "Bruselas, Bélgica", scope: "city", countryCode: "BE", country: "Bélgica", city: "Bruselas", province: "Bruselas-Capital" },
  { slug: "amberes", label: "Amberes, Bélgica", scope: "city", countryCode: "BE", country: "Bélgica", city: "Amberes", province: "Flandes" },
  { slug: "dublin", label: "Dublín, Irlanda", scope: "city", countryCode: "IE", country: "Irlanda", city: "Dublín", province: "Leinster" },
  { slug: "cork", label: "Cork, Irlanda", scope: "city", countryCode: "IE", country: "Irlanda", city: "Cork", province: "Munster" },
  { slug: "london", label: "Londres, Reino Unido", scope: "city", countryCode: "GB", country: "Reino Unido", city: "Londres", province: "Inglaterra" },
  { slug: "manchester", label: "Mánchester, Reino Unido", scope: "city", countryCode: "GB", country: "Reino Unido", city: "Mánchester", province: "Inglaterra" },
];

export const locations: Location[] = [...countryLocations, ...cityLocations];

export const countrySearchLocations = countryLocations;
export const citySearchLocations = cityLocations;

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
