import { privateJson, bad, getSessionUser, activeRoleCookieHeaders } from "../../../apilib/http";
import { normalizeRole, panelPathForRole, type AccountRole } from "../../../lib/accounts";

const publicRoles = new Set(["client", "professional", "company", "subcontractor"]);
const ROLE_COOKIE_MAX_AGE = 30 * 24 * 3600;

function isPublicRole(role: AccountRole) {
  return publicRoles.has(role);
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
  } catch {}

  return [...roles];
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const requestedRole = normalizeRole(body.role, "client");
  if (!isPublicRole(requestedRole)) return bad("Rol no permitido", 403);

  const availableRoles = await availableRolesForUser(env, user);
  if (!availableRoles.includes(requestedRole)) return bad("Este perfil todavía no está disponible en tu cuenta", 403);

  return privateJson(
    {
      ok: true,
      activeRole: requestedRole,
      availableRoles,
      panelPath: panelPathForRole(requestedRole),
    },
    200,
    activeRoleCookieHeaders(requestedRole, ROLE_COOKIE_MAX_AGE, request),
  );
}
