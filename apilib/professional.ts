import { bad, getSessionUser } from "./http";
import { isActiveSubscriptionStatus } from "../lib/billing/subscription";

export async function getCurrentProfessional(env: any, request: Request): Promise<{ user: any; professional: any } | Response> {
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  const professional = await env.DB.prepare("SELECT * FROM professionals WHERE user_id = ?").bind(user.id).first();
  if (!professional) return bad("Perfil no encontrado", 404);
  return { user, professional };
}

export async function getSubscriptionAccess(env: any, userId: string) {
  const subscription = await env.DB.prepare(
    `SELECT * FROM subscriptions
     WHERE user_id = ?
     ORDER BY updated_at DESC
     LIMIT 1`,
  ).bind(userId).first();
  return {
    subscription: subscription || null,
    active: isActiveSubscriptionStatus(subscription?.status),
  };
}

export async function requireActiveProfessional(env: any, request: Request) {
  const current = await getCurrentProfessional(env, request);
  if (current instanceof Response) return current;
  const access = await getSubscriptionAccess(env, current.user.id);
  if (!access.active) {
    return bad("Tu suscripción no está activa. Reactiva tu plan para usar funciones comerciales.", 402);
  }
  return { ...current, subscription: access.subscription };
}

export function safeJsonArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function textLines(value: unknown, max = 20): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean).slice(0, max);
  return String(value || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}
