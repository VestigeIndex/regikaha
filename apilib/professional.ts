import { bad, getSessionUser } from "./http";

export async function getCurrentProfessional(env: any, request: Request): Promise<{ user: any; professional: any } | Response> {
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  const professional = await env.DB.prepare("SELECT * FROM professionals WHERE user_id = ?").bind(user.id).first();
  if (!professional) return bad("Perfil no encontrado", 404);
  return { user, professional };
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
