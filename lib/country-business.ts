import type { Locale } from "@/lib/i18n/config";

export interface CountryBusinessConfig {
  currency: "EUR" | "CHF" | "GBP";
  defaultTaxRate: number;
  taxLabel: string;
  numberLocale: string;
}

const baseConfig: Record<string, Omit<CountryBusinessConfig, "taxLabel">> = {
  ES: { currency: "EUR", defaultTaxRate: 21, numberLocale: "es-ES" },
  FR: { currency: "EUR", defaultTaxRate: 20, numberLocale: "fr-FR" },
  IT: { currency: "EUR", defaultTaxRate: 22, numberLocale: "it-IT" },
  PT: { currency: "EUR", defaultTaxRate: 23, numberLocale: "pt-PT" },
  CH: { currency: "CHF", defaultTaxRate: 8.1, numberLocale: "de-CH" },
  DE: { currency: "EUR", defaultTaxRate: 19, numberLocale: "de-DE" },
  NL: { currency: "EUR", defaultTaxRate: 21, numberLocale: "nl-NL" },
  BE: { currency: "EUR", defaultTaxRate: 21, numberLocale: "nl-BE" },
  IE: { currency: "EUR", defaultTaxRate: 23, numberLocale: "en-IE" },
  GB: { currency: "GBP", defaultTaxRate: 20, numberLocale: "en-GB" },
};

export function countryBusinessConfig(countryCode: string, locale: Locale): CountryBusinessConfig {
  const code = countryCode.toUpperCase();
  const base = baseConfig[code] || baseConfig.ES;
  let taxLabel = "VAT";
  if (code === "CH") taxLabel = locale === "fr" ? "TVA" : locale === "it" ? "IVA" : locale === "de" ? "MWST" : "VAT";
  else if (locale === "es" || locale === "it" || locale === "pt") taxLabel = "IVA";
  else if (locale === "fr") taxLabel = "TVA";
  else if (locale === "de") taxLabel = "MwSt.";
  else if (locale === "nl") taxLabel = "btw";
  return { ...base, taxLabel };
}

export function formatBusinessMoney(value: number, countryCode: string, locale: Locale): string {
  const config = countryBusinessConfig(countryCode, locale);
  return new Intl.NumberFormat(config.numberLocale, {
    style: "currency",
    currency: config.currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}
