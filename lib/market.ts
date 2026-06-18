export const europeMarket = {
  label: "Mercados activos",
  description:
    "RegiKaha opera en mercados europeos seleccionados: España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos, Bélgica, Irlanda y Reino Unido.",
  primaryCountry: "España",
  primaryCountryCode: "ES",
} as const;

export const activeMarkets = [
  { code: "ES", slug: "espana", name: "España", flagCountry: "es", citySlugs: ["madrid", "barcelona", "valencia", "sevilla", "malaga", "zaragoza", "bilbao", "murcia", "palma", "alicante", "valladolid", "vigo"] },
  { code: "FR", slug: "francia", name: "Francia", flagCountry: "fr", citySlugs: ["paris", "lyon"] },
  { code: "IT", slug: "italia", name: "Italia", flagCountry: "it", citySlugs: ["milan", "roma"] },
  { code: "PT", slug: "portugal", name: "Portugal", flagCountry: "pt", citySlugs: ["lisboa", "porto"] },
  { code: "CH", slug: "suiza", name: "Suiza", flagCountry: "ch", citySlugs: ["zurich", "geneva"] },
  { code: "DE", slug: "alemania", name: "Alemania", flagCountry: "de", citySlugs: ["berlin", "munich"] },
  { code: "NL", slug: "paises-bajos", name: "Países Bajos", flagCountry: "nl", citySlugs: ["amsterdam", "rotterdam"] },
  { code: "BE", slug: "belgica", name: "Bélgica", flagCountry: "be", citySlugs: ["bruselas", "amberes"] },
  { code: "IE", slug: "irlanda", name: "Irlanda", flagCountry: "ie", citySlugs: ["dublin", "cork"] },
  { code: "GB", slug: "reino-unido", name: "Reino Unido", flagCountry: "gb", citySlugs: ["london", "manchester"] },
] as const;

export type ActiveMarket = (typeof activeMarkets)[number];
export type ActiveCountryCode = ActiveMarket["code"];

export const europeanCountryOptions = activeMarkets.map(({ code, name }) => ({ code, name }));

export function getActiveMarketBySlug(slug: string): ActiveMarket | undefined {
  return activeMarkets.find((market) => market.slug === slug);
}

export function getActiveMarketByCode(code: string): ActiveMarket | undefined {
  return activeMarkets.find((market) => market.code === code.toUpperCase());
}

export function isActiveCountryCode(code: string): code is ActiveCountryCode {
  return !!getActiveMarketByCode(code);
}

export function countryFlagEmoji(countryCode: string): string {
  const normalized = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "";
  return normalized
    .split("")
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
}
