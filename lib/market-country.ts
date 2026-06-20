import type { Locale } from "@/lib/i18n/config";
import { europeanCountryOptions } from "@/lib/market";

const localeCountries: Record<Locale, string> = {
  es: "ES",
  fr: "FR",
  it: "IT",
  pt: "PT",
  de: "DE",
  nl: "NL",
  en: "GB",
};

const activeCountries = new Set<string>(europeanCountryOptions.map((country) => country.code));

export function defaultCountryForLocale(locale: Locale): string {
  return localeCountries[locale];
}

export async function detectMarketCountry(locale: Locale): Promise<string> {
  try {
    const response = await fetch("/api/locale", { cache: "no-store", headers: { accept: "application/json" } });
    if (!response.ok) return defaultCountryForLocale(locale);
    const data = await response.json();
    const country = String(data.country || "").toUpperCase();
    return activeCountries.has(country) ? country : defaultCountryForLocale(locale);
  } catch {
    return defaultCountryForLocale(locale);
  }
}
