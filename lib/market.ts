export const europeMarket = {
  label: "Mercados activos",
  description:
    "Regi Kaha opera en mercados europeos seleccionados: España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos, Bélgica, Irlanda y Reino Unido.",
  primaryCountry: "España",
  primaryCountryCode: "ES",
} as const;

export const activeMarkets = [
  { code: "ES", slug: "espana", name: "España", flagCountry: "es", citySlugs: ["madrid", "barcelona", "valencia", "sevilla", "malaga", "zaragoza", "bilbao", "murcia", "palma", "alicante", "valladolid", "vigo"] },
  { code: "FR", slug: "francia", name: "Francia", flagCountry: "fr", citySlugs: ["paris", "lyon", "marseille", "toulouse", "nice", "bordeaux", "lille"] },
  { code: "IT", slug: "italia", name: "Italia", flagCountry: "it", citySlugs: ["roma", "milan", "napoli", "torino", "palermo", "bologna", "firenze"] },
  { code: "PT", slug: "portugal", name: "Portugal", flagCountry: "pt", citySlugs: ["lisboa", "porto", "braga", "coimbra", "faro"] },
  { code: "CH", slug: "suiza", name: "Suiza", flagCountry: "ch", citySlugs: ["zurich", "geneva", "basel", "bern", "lausanne", "lugano"] },
  { code: "DE", slug: "alemania", name: "Alemania", flagCountry: "de", citySlugs: ["berlin", "munich", "hamburg", "koln", "frankfurt", "stuttgart", "dusseldorf", "leipzig"] },
  { code: "NL", slug: "paises-bajos", name: "Países Bajos", flagCountry: "nl", citySlugs: ["amsterdam", "rotterdam", "the-hague", "utrecht", "eindhoven", "groningen"] },
  { code: "BE", slug: "belgica", name: "Bélgica", flagCountry: "be", citySlugs: ["bruselas", "amberes", "ghent", "bruges", "liege"] },
  { code: "IE", slug: "irlanda", name: "Irlanda", flagCountry: "ie", citySlugs: ["dublin", "cork", "galway", "limerick", "waterford"] },
  { code: "GB", slug: "reino-unido", name: "Reino Unido", flagCountry: "gb", citySlugs: ["london", "manchester", "birmingham", "liverpool", "leeds", "glasgow", "edinburgh", "bristol", "cardiff", "belfast"] },
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
