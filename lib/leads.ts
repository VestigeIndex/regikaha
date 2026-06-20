export type LeadCurrency = "EUR" | "CHF" | "GBP";

export interface LeadPriceInput {
  countryCode: string;
  categoryId?: string;
  budgetRange?: string;
  urgency?: string;
  clientType?: string;
  b2b?: boolean;
}

export interface LeadPriceResult {
  amount: number;
  currency: LeadCurrency;
  maxProfessionals: number;
  band: "small" | "standard" | "medium" | "large" | "specialist";
}

const currencyByCountry: Record<string, LeadCurrency> = {
  ES: "EUR",
  FR: "EUR",
  IT: "EUR",
  PT: "EUR",
  CH: "CHF",
  DE: "EUR",
  NL: "EUR",
  BE: "EUR",
  IE: "EUR",
  GB: "GBP",
};

const specialistCategories = new Set([
  "arquitectura-licencias",
  "aparejadores-ingenieria",
  "peritos-tecnicos",
  "mantenimiento-industrial",
]);

const basePrices: Record<LeadCurrency, Record<LeadPriceResult["band"], number>> = {
  EUR: { small: 500, standard: 1200, medium: 2500, large: 4500, specialist: 7500 },
  CHF: { small: 500, standard: 1300, medium: 2700, large: 4900, specialist: 8200 },
  GBP: { small: 400, standard: 1000, medium: 2200, large: 3900, specialist: 6800 },
};

export function leadCurrency(countryCode: string): LeadCurrency {
  return currencyByCountry[String(countryCode || "").toUpperCase()] || "EUR";
}

export function getLeadPrice(input: LeadPriceInput): LeadPriceResult {
  const currency = leadCurrency(input.countryCode);
  let band: LeadPriceResult["band"] = "standard";
  if (input.b2b || specialistCategories.has(String(input.categoryId || ""))) band = "specialist";
  else if (input.budgetRange === "menos-1000") band = "small";
  else if (input.budgetRange === "5000-15000") band = "medium";
  else if (input.budgetRange === "15000-50000") band = "large";
  else if (input.budgetRange === "mas-50000") band = "specialist";

  let amount = basePrices[currency][band];
  if (input.urgency === "urgent") amount = Math.round(amount * 1.15);
  if (["empresa", "comunidad", "administrador_fincas", "developer", "contractor"].includes(String(input.clientType || ""))) {
    amount = Math.round(amount * 1.1);
  }
  amount = Math.round(amount / 50) * 50;

  return {
    amount,
    currency,
    maxProfessionals: input.b2b ? 5 : input.urgency === "urgent" || band === "specialist" ? 3 : 4,
    band,
  };
}

export function leadQualityScore(input: {
  description?: string;
  hasPhone?: boolean;
  hasCoordinates?: boolean;
  hasBudget?: boolean;
  hasPostalCode?: boolean;
}): number {
  let score = 35;
  if (String(input.description || "").trim().length >= 120) score += 20;
  if (input.hasPhone) score += 15;
  if (input.hasCoordinates) score += 15;
  if (input.hasBudget) score += 10;
  if (input.hasPostalCode) score += 5;
  return Math.min(score, 100);
}

export function minorMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(amount || 0) / 100);
}

export const leadInvalidReasons = [
  "fake_phone",
  "fake_email",
  "nonexistent_client",
  "duplicate",
  "wrong_category",
  "system_area_error",
  "spam",
] as const;

export type LeadInvalidReason = (typeof leadInvalidReasons)[number];
