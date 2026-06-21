import { privateJson, getSessionUser, getRequestedActiveRole } from "../../apilib/http";
import { normalizeRole, panelPathForRole, type AccountRole } from "../../lib/accounts";

const publicRoles = new Set(["client", "professional", "company", "subcontractor"]);

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
  if (user.role === "admin" || user.role === "superadmin") roles.add(normalizeRole(user.role, "admin"));
  return [...roles];
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return privateJson({ authenticated: false });

  const availableRoles = await availableRolesForUser(env, user);
  const cookieRole = normalizeRole(getRequestedActiveRole(request), normalizeRole(user.role, "client"));
  const activeRole = availableRoles.includes(cookieRole) ? cookieRole : (availableRoles[0] || normalizeRole(user.role, "client"));

  const pro = await env.DB.prepare("SELECT * FROM professionals WHERE user_id = ?").bind(user.id).first();
  let profile: any = null;
  try {
    profile = await env.DB.prepare("SELECT * FROM profiles WHERE user_id = ? AND role = ?").bind(user.id, activeRole).first();
    if (!profile) profile = await env.DB.prepare("SELECT * FROM profiles WHERE user_id = ?").bind(user.id).first();
  } catch {
    profile = null;
  }

  let categories: string[] = [];
  let areas: any[] = [];
  if (pro) {
    const c = await env.DB.prepare("SELECT category_id FROM professional_categories WHERE professional_id = ?").bind(pro.id).all();
    categories = (c.results || []).map((r: any) => r.category_id);
    const a = await env.DB.prepare("SELECT id,country,region,city,postal_prefix,latitude,longitude FROM service_areas WHERE professional_id = ?").bind(pro.id).all();
    areas = a.results || [];
  }

  return privateJson({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: activeRole,
      activeRole,
      defaultRole: user.role,
      availableRoles,
      name: user.name || profile?.display_name || pro?.public_name || null,
      emailVerified: Number(user.email_verified || 0) === 1,
    },
    profile,
    professional: pro || null,
    panelPath: panelPathForRole(activeRole),
    categories,
    areas,
  });
}
