// Límites por plan para RegiWorks Cloud. Puro (sin React/navegador) para poder
// usarse tanto en el cliente como en las Functions. Survival/cost-controlled.

export type RegiworksPlan = "free" | "pro" | "business";

export interface RegiworksLimits {
  /** Tamaño máximo del workspace JSON sincronizado (sin imágenes base64). */
  maxWorkspaceBytes: number;
  maxClients: number;
  maxProjects: number;
  maxQuotes: number;
  /** Imágenes totales en R2 por cuenta. */
  maxImages: number;
  /** Peso máximo por imagen final (WebP) en R2. */
  maxImageBytes: number;
  maxThumbnailBytes: number;
}

export const REGIWORKS_LIMITS: Record<RegiworksPlan, RegiworksLimits> = {
  free: { maxWorkspaceBytes: 90_000, maxClients: 15, maxProjects: 15, maxQuotes: 20, maxImages: 6, maxImageBytes: 350_000, maxThumbnailBytes: 120_000 },
  pro: { maxWorkspaceBytes: 360_000, maxClients: 300, maxProjects: 300, maxQuotes: 500, maxImages: 6, maxImageBytes: 350_000, maxThumbnailBytes: 120_000 },
  business: { maxWorkspaceBytes: 720_000, maxClients: 2000, maxProjects: 2000, maxQuotes: 3000, maxImages: 30, maxImageBytes: 500_000, maxThumbnailBytes: 120_000 },
};

const ACTIVE_STATUSES = new Set(["founder_trial_0_eur", "trialing", "active"]);

/** Deriva el plan de RegiWorks a partir de la suscripción del usuario. */
export function planTier(subscription: { status?: unknown; plan?: unknown } | null | undefined): RegiworksPlan {
  if (!subscription || !ACTIVE_STATUSES.has(String(subscription.status || ""))) return "free";
  return String(subscription.plan || "") === "europa_pro" ? "business" : "pro";
}

export function limitsForPlan(plan: RegiworksPlan): RegiworksLimits {
  return REGIWORKS_LIMITS[plan];
}
