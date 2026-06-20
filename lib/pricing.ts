export const ANNUAL_DISCOUNT_PERCENT = 10;
export const VAT_COPY = "+ IVA/VAT";

export type ProfessionalPlanId = "autonomo_nacional" | "europa_pro";
export type BillingInterval = "monthly" | "yearly";

export interface ProfessionalPlan {
  id: ProfessionalPlanId;
  name: string;
  shortName: string;
  badge: string;
  audience: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyLookupKey: string;
  yearlyLookupKey: string;
  monthlySecretName: string;
  yearlySecretName: string;
  features: string[];
}

export const professionalPlans: ProfessionalPlan[] = [
  {
    id: "autonomo_nacional",
    name: "Autónomo Nacional",
    shortName: "Autónomo",
    badge: "Para operar dentro de un país",
    audience: "Autónomos y equipos pequeños",
    description:
      "Visibilidad profesional en un país y sus principales regiones, ideal cuando tu margen y capacidad operativa son locales o nacionales.",
    monthlyPrice: 19.95,
    yearlyPrice: 215.46,
    monthlyLookupKey: "regikaha_autonomo_monthly",
    yearlyLookupKey: "regikaha_autonomo_yearly",
    monthlySecretName: "STRIPE_PRICE_AUTONOMO_MONTHLY",
    yearlySecretName: "STRIPE_PRICE_AUTONOMO_YEARLY",
    features: [
      "Perfil profesional verificado",
      "Cobertura en un país",
      "Selección de regiones y ciudades",
      "Portfolio, servicios y reseñas verificadas",
      "Oportunidades compatibles y saldo de contactos transparente",
      "Ranking justo por mérito",
      "Regi Works para presupuestos, obras y documentos",
    ],
  },
  {
    id: "europa_pro",
    name: "Multi-mercado Pro",
    shortName: "Multi-mercado",
    badge: "Para crecer por regiones y países",
    audience: "Empresas, estudios y profesionales multi-región",
    description:
      "Visibilidad ampliada para quienes pueden atender varias regiones, trabajar en distintos países activos o captar proyectos de mayor alcance.",
    monthlyPrice: 49.95,
    yearlyPrice: 539.46,
    monthlyLookupKey: "regikaha_europa_monthly",
    yearlyLookupKey: "regikaha_europa_yearly",
    monthlySecretName: "STRIPE_PRICE_EUROPA_MONTHLY",
    yearlySecretName: "STRIPE_PRICE_EUROPA_YEARLY",
    features: [
      "Todo lo incluido en Autónomo Nacional",
      "Cobertura multi-región y multi-mercado",
      "Más zonas de servicio activas",
      "Perfil preparado para búsquedas transfronterizas",
      "Prioridad de revisión en verificación",
      "Soporte para expansión de cobertura",
      "Regi Works con organización multi-mercado",
    ],
  },
];

export function formatEuro(value: number, locale = "es-ES"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatIntervalPrice(plan: ProfessionalPlan, interval: BillingInterval): string {
  const price = interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const suffix = interval === "monthly" ? "/mes" : "/año";
  return `${formatEuro(price)} ${suffix} ${VAT_COPY}`;
}

export function priceSecretName(plan: ProfessionalPlanId, interval: BillingInterval): string {
  const found = professionalPlans.find((p) => p.id === plan);
  if (!found) throw new Error(`Plan no reconocido: ${plan}`);
  return interval === "monthly" ? found.monthlySecretName : found.yearlySecretName;
}

export function subscriptionPlanLabel(plan: string): string {
  switch (plan) {
    case "autonomo_monthly":
      return "Autónomo Nacional mensual";
    case "autonomo_yearly":
      return "Autónomo Nacional anual";
    case "europa_monthly":
      return "Multi-mercado Pro mensual";
    case "europa_yearly":
      return "Multi-mercado Pro anual";
    case "founder":
      return "Fundador";
    default:
      return plan;
  }
}

export function monthlyEquivalent(plan: string, priceEur: number): number {
  return plan.endsWith("_yearly") ? priceEur / 12 : priceEur;
}
