import {
  professionalPlans,
  type BillingInterval,
  type ProfessionalPlan,
  type ProfessionalPlanId,
} from "../pricing";

export const ACTIVE_SUBSCRIPTION_STATUSES = ["founder_trial_0_eur", "trialing", "active"] as const;

export const CONTRACT_CHECKBOX_KEYS = [
  "professionalTerms",
  "verificationPolicy",
  "reviewsPolicy",
  "fairRankingPolicy",
  "renewalCancellationPolicy",
  "futurePaymentUnderstood",
  "accessLimitationUnderstood",
  "truthfulInformation",
  "professionalResponsibility",
] as const;

export type ContractCheckboxKey = (typeof CONTRACT_CHECKBOX_KEYS)[number];
export type SubscriptionStatus =
  | "no_subscription"
  | "founder_trial_0_eur"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "cancelled"
  | "suspended"
  | "expired";

export const DEFAULT_FOUNDER_MONTHS = 5;
export const DEFAULT_FOUNDER_SLOTS = 300;
export const DEFAULT_FOUNDER_RESERVATION_HOURS = 24;

export function isProfessionalPlan(value: string): value is ProfessionalPlanId {
  return value === "autonomo_nacional" || value === "europa_pro";
}

export function isBillingInterval(value: string): value is BillingInterval {
  return value === "monthly" || value === "yearly";
}

export function isOfferingRole(role: string): boolean {
  return role === "professional" || role === "company" || role === "subcontractor" || role === "admin";
}

export function isActiveSubscriptionStatus(status?: string | null): boolean {
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number]);
}

export function commercialAccessStatus(status?: string | null): "active" | "limited_visibility" {
  return isActiveSubscriptionStatus(status) ? "active" : "limited_visibility";
}

export function getProfessionalPlan(planId: ProfessionalPlanId): ProfessionalPlan {
  const plan = professionalPlans.find((candidate) => candidate.id === planId);
  if (!plan) throw new Error(`Plan no reconocido: ${planId}`);
  return plan;
}

export function planPriceCents(planId: ProfessionalPlanId, interval: BillingInterval): number {
  const plan = getProfessionalPlan(planId);
  return Math.round((interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice) * 100);
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  const originalDay = next.getUTCDate();
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
  next.setUTCDate(Math.min(originalDay, lastDay));
  return next;
}

export function allContractCheckboxesAccepted(value: unknown): value is Record<ContractCheckboxKey, true> {
  if (!value || typeof value !== "object") return false;
  const checkboxes = value as Record<string, unknown>;
  return CONTRACT_CHECKBOX_KEYS.every((key) => checkboxes[key] === true);
}

export function founderMonths(env: Record<string, unknown>): number {
  const value = Number(env.BILLING_FOUNDER_FREE_MONTHS || DEFAULT_FOUNDER_MONTHS);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.round(value), 12) : DEFAULT_FOUNDER_MONTHS;
}

export function founderSlotLimit(env: Record<string, unknown>): number {
  const value = Number(env.BILLING_FOUNDER_SLOTS || DEFAULT_FOUNDER_SLOTS);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.round(value), 10_000) : DEFAULT_FOUNDER_SLOTS;
}

export function founderReservationHours(env: Record<string, unknown>): number {
  const value = Number(env.BILLING_FOUNDER_RESERVATION_HOURS || DEFAULT_FOUNDER_RESERVATION_HOURS);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.round(value), 168) : DEFAULT_FOUNDER_RESERVATION_HOURS;
}

export function trialRequiresPaymentMethod(env: Record<string, unknown>): boolean {
  return String(env.BILLING_REQUIRE_PAYMENT_METHOD_FOR_TRIAL || "true") !== "false";
}
