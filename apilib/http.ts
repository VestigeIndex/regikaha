// Helpers HTTP compartidos por las Pages Functions de Regi Kaha.

export const SESSION_COOKIE = "__Secure-rk_session";
export const LEGACY_SESSION_COOKIE = "rk_session";

export function json(data: unknown, status = 200, initHeaders: HeadersInit = {}): Response {
  const headers = new Headers(initHeaders);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

export function privateJson(data: unknown, status = 200, initHeaders: HeadersInit = {}): Response {
  const headers = new Headers(initHeaders);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return json(data, status, headers);
}

export function bad(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function isProductionDomain(request: Request): boolean {
  const hostname = new URL(request.url).hostname.toLowerCase();
  return hostname === "regikaha.com" || hostname === "www.regikaha.com";
}

export function sessionCookie(token: string, maxAgeSec: number, request: Request): string {
  const expires = new Date(Date.now() + maxAgeSec * 1000).toUTCString();
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Priority=High",
    `Max-Age=${maxAgeSec}`,
    `Expires=${expires}`,
  ];
  return parts.join("; ");
}

export function sessionCookieHeaders(token: string, maxAgeSec: number, request: Request): Headers {
  const headers = new Headers();
  headers.append("Set-Cookie", expiredCookie(LEGACY_SESSION_COOKIE));
  if (isProductionDomain(request)) {
    headers.append("Set-Cookie", expiredCookie(SESSION_COOKIE, "regikaha.com"));
    headers.append("Set-Cookie", expiredCookie(LEGACY_SESSION_COOKIE, "regikaha.com"));
  }
  headers.append("Set-Cookie", sessionCookie(token, maxAgeSec, request));
  return headers;
}

function expiredCookie(name: string, domain?: string): string {
  const parts = [
    `${name}=`,
    "Path=/",
    ...(domain ? [`Domain=${domain}`] : []),
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];
  return parts.join("; ");
}

export function clearSessionCookies(request: Request): string[] {
  const cookies = [
    expiredCookie(SESSION_COOKIE),
    expiredCookie(LEGACY_SESSION_COOKIE),
  ];
  if (isProductionDomain(request)) {
    cookies.push(expiredCookie(SESSION_COOKIE, "regikaha.com"));
    cookies.push(expiredCookie(LEGACY_SESSION_COOKIE, "regikaha.com"));
  }
  return cookies;
}

export function getSessionTokens(request: Request): string[] {
  return [getCookie(request, SESSION_COOKIE), getCookie(request, LEGACY_SESSION_COOKIE)]
    .filter((token): token is string => Boolean(token));
}

/** Devuelve el usuario autenticado (o null) a partir de la cookie de sesión. */
export async function getSessionUser(env: any, request: Request): Promise<any | null> {
  for (const token of getSessionTokens(request)) {
    const row = await env.DB.prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > datetime('now') AND u.status = 'active' AND u.deleted_at IS NULL`,
    )
      .bind(token)
      .first();
    if (row) return row;
  }
  return null;
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
  return requireRole(env, request, ["professional", "admin", "superadmin"]);
}

export function requireCompany(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, ["company", "admin", "superadmin"]);
}

export function requireSubcontractor(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, ["subcontractor", "admin", "superadmin"]);
}

/** Exige sesión con rol admin para APIs internas. */
export async function requireAdmin(env: any, request: Request): Promise<any | Response> {
  return requireRole(env, request, ["admin", "superadmin"]);
}

export async function requireOwnerOrAdmin(env: any, request: Request, ownerUserId: string): Promise<any | Response> {
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  if (user.role !== "admin" && user.role !== "superadmin" && user.id !== ownerUserId) return bad("No autorizado", 403);
  return user;
}

export function isEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}
