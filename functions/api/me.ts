import { json, getSessionUser } from "../../apilib/http";

// GET /api/me — usuario autenticado + su perfil, categorías y zonas.
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return json({ authenticated: false });

  const pro = await env.DB.prepare("SELECT * FROM professionals WHERE user_id = ?").bind(user.id).first();
  let categories: string[] = [];
  let areas: any[] = [];
  if (pro) {
    const c = await env.DB.prepare("SELECT category_id FROM professional_categories WHERE professional_id = ?").bind(pro.id).all();
    categories = (c.results || []).map((r: any) => r.category_id);
    const a = await env.DB.prepare("SELECT id,country,region,city,postal_prefix FROM service_areas WHERE professional_id = ?").bind(pro.id).all();
    areas = a.results || [];
  }
  return json({
    authenticated: true,
    user: { id: user.id, email: user.email, role: user.role },
    professional: pro || null,
    categories,
    areas,
  });
}
