import { privateJson, getSessionUser } from "../../apilib/http";
import { panelPathForRole } from "../../lib/accounts";

// GET /api/me — usuario autenticado + su perfil, categorías y zonas.
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return privateJson({ authenticated: false });

  const pro = await env.DB.prepare("SELECT * FROM professionals WHERE user_id = ?").bind(user.id).first();
  let profile: any = null;
  try {
    profile = await env.DB.prepare("SELECT * FROM profiles WHERE user_id = ?").bind(user.id).first();
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
      role: user.role,
      name: user.name || profile?.display_name || null,
      emailVerified: Number(user.email_verified || 0) === 1,
    },
    profile,
    professional: pro || null,
    panelPath: panelPathForRole(user.role),
    categories,
    areas,
  });
}
