export const europeMarket = {
  label: "Toda Europa",
  description:
    "RegiKaha está planteado como marketplace europeo: búsqueda por toda Europa, por país y por ciudad o región.",
  primaryCountry: "España",
  primaryCountryCode: "ES",
} as const;

export const europeanCountryOptions = [
  { code: "ES", name: "España" },
  { code: "PT", name: "Portugal" },
  { code: "FR", name: "Francia" },
  { code: "IT", name: "Italia" },
  { code: "DE", name: "Alemania" },
  { code: "NL", name: "Países Bajos" },
  { code: "BE", name: "Bélgica" },
  { code: "IE", name: "Irlanda" },
  { code: "AT", name: "Austria" },
  { code: "PL", name: "Polonia" },
] as const;
