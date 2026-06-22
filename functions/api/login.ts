import { privateJson, bad, isEmail, sessionCookieHeadersWithRole } from "../../apilib/http";
import { verifyPassword, createSession } from "../../apilib/auth";
import { logAudit } from "../../apilib/audit";
import { normalizeRole, panelPathForRole, safeInternalPath, type AccountRole } from "../../lib/accounts";
import { rateLimitByIP } from "../../packages/cost-guards";

const publicRoles = new Set(["client", "professional", "company", "subcontractor"]);

function isPublicRole(role: AccountRole) {
  return publicRoles.has(role);
}

async function hasProfileRole(env: any, userId: string, role: AccountRole) {
  if (role === "professional") {
    const pro = await env.DB.prepare("SELECT id FROM professionals WHERE user_id = ? LIMIT 1").bind(userId).first();
    return Boolean(pro);
  }
  if (role === "company" || role === "subcontractor") {
    try {
      const profile = await env.DB.prepare("SELECT user_id FROM profiles WHERE user_id = ? AND role = ? LIMIT 1").bind(userId, role).first();
      return Boolean(profile);
    } catch {
      return false;
    }
  }
  return false;
}

async function availableRolesForUser(env: any, user: any): Promise<AccountRole[]> {
  const roles = new Set<AccountRole>();
  const legacyRole = normalizeRole(user.role, "client");
  if (isPublicRole(legacyRole)) roles.add(legacyRole);

  const pro = await env.DB.prepare("SELECT id FROM professionals WHERE user_id = ? LIMIT 1").bind(user.id).first();
  if (pro && legacyRole !== "professional") roles.add("professional");

  try {
    const profiles = await env.DB.prepare("SELECT role FROM profiles WHERE user_id = ? AND status != 'suspended'").bind(user.id).all();
    for (const row of profiles.results || []) {
      const role = normalizeRole((row as any).role, "client");
      if (isPublicRole(role)) roles.add(role);
    }
  } catch {
    // profiles may not exist in older deployments.
  }
  return [...roles];
}

// POST /api/login
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const limited = await rateLimitByIP(env, request, "login", 10, 600);
  if (limited) return limited;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (!isEmail(email) || !password) return bad("Credenciales incompletas");

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return bad("Email o contraseña incorrectos", 401);
  }
  if (user.status !== "active" || user.deleted_at) return bad("Cuenta no disponible", 403);

  const requestedRole = normalizeRole(b.role || user.role, normalizeRole(user.role, "client"));
  if (requestedRole === "admin" && user.role !== "admin" && user.role !== "superadmin") return bad("No autorizado", 403);

  const availableRoles = await availableRolesForUser(env, user);
  let activeRole: AccountRole = normalizeRole(user.role, "client");

  if (requestedRole === "admin" || requestedRole === "superadmin") {
    activeRole = normalizeRole(user.role, "admin");
  } else if (isPublicRole(requestedRole) && (availableRoles.includes(requestedRole) || await hasProfileRole(env, user.id, requestedRole))) {
    activeRole = requestedRole;
  } else if (availableRoles.includes(activeRole)) {
    activeRole = activeRole;
  } else {
    activeRole = normalizeRole(user.role, "client");
  }

  const fallbackPath = panelPathForRole(activeRole);
  const redirectTo = safeInternalPath(b.redirectTo, fallbackPath);
  const safeRedirect = redirectTo.startsWith(fallbackPath) || redirectTo === "/panel" ? redirectTo : fallbackPath;
  const { token, maxAge } = await createSession(env, user.id);
  await logAudit(env, { userId: user.id, action: "login", meta: { role: activeRole }, request });
  return privateJson(
    {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: activeRole,
        activeRole,
        defaultRole: user.role,
        availableRoles,
      },
      redirectTo: safeRedirect,
    },
    200,
    sessionCookieHeadersWithRole(token, maxAge, request, activeRole),
  );
}
