export const europeMarket = {
  label: "Mercados activos",
  description:
    "RegiKaha opera inicialmente en España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos, Bélgica, Irlanda y Reino Unido.",
  primaryCountry: "España",
  primaryCountryCode: "ES",
} as const;

export const europeanCountryOptions = [
  { code: "ES", name: "España" },
  { code: "FR", name: "Francia" },
  { code: "IT", name: "Italia" },
  { code: "PT", name: "Portugal" },
  { code: "CH", name: "Suiza" },
  { code: "DE", name: "Alemania" },
  { code: "NL", name: "Países Bajos" },
  { code: "BE", name: "Bélgica" },
  { code: "IE", name: "Irlanda" },
  { code: "GB", name: "Reino Unido" },
] as const;
