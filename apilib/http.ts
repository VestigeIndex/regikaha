// Helpers HTTP compartidos por las Pages Functions de RegiKaha.

export const SESSION_COOKIE = "rk_session";

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

export function bad(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function sessionCookie(token: string, maxAgeSec: number): string {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  return parts.join("; ");
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

/** Devuelve el usuario autenticado (o null) a partir de la cookie de sesión. */
export async function getSessionUser(env: any, request: Request): Promise<any | null> {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > datetime('now')`,
  )
    .bind(token)
    .first();
  return row || null;
}

export async function requireUser(env: any, request: Request): Promise<any | Response> {
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  return user;
}

export async function requireRole(env: any, request: Request, roles: string | string[]): Promise<any | Response> {
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) return bad("No autorizado", 403);
  return user;
}

export function requireProfessional(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, ["professional", "admin"]);
}

export function requireCompany(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, ["company", "admin"]);
}

export function requireSubcontractor(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, ["subcontractor", "admin"]);
}

/** Exige sesión con rol admin para APIs internas. */
export async function requireAdmin(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, "admin");
}

export async function requireOwnerOrAdmin(env: any, request: Request, ownerUserId: string): Promise<any | Response> {
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  if (user.role !== "admin" && user.id !== ownerUserId) return bad("No autorizado", 403);
  return user;
}

export function isEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}
