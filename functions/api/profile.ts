import { json, bad, getSessionUser } from "../../apilib/http";
import { newId } from "../../apilib/auth";

// POST /api/profile — actualiza perfil, categorías y zonas de operación (autenticado).
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  const pro = await env.DB.prepare("SELECT * FROM professionals WHERE user_id = ?").bind(user.id).first();
  if (!pro) return bad("Perfil no encontrado", 404);

  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const map: Record<string, any> = {
    public_name: b.publicName, legal_name: b.legalName, nif_cif: b.nifCif, type: b.type,
    country: b.country !== undefined ? String(b.country).toUpperCase() : undefined,
    region: b.region, city: b.city, phone: b.phone, description: b.description,
    short_tagline: b.tagline, years_experience: b.yearsExperience, service_radius_km: b.serviceRadiusKm,
    price_from: b.priceFrom,
    insurance_declared: b.insuranceDeclared !== undefined ? (b.insuranceDeclared ? 1 : 0) : undefined,
    invoice_declared: b.invoiceDeclared !== undefined ? (b.invoiceDeclared ? 1 : 0) : undefined,
    offers_urgent: b.offersUrgent !== undefined ? (b.offersUrgent ? 1 : 0) : undefined,
  };
  if (b.publicName || b.tagline || b.city || b.country) {
    const name = String(b.publicName || pro.public_name || "Profesional RegiKaha").trim();
    const city = String(b.city || pro.city || "").trim();
    const rawCountry = String(b.country || pro.country || "mercados activos").trim();
    const country = rawCountry.length <= 3 ? rawCountry.toUpperCase() : rawCountry;
    map.seo_title = `${name} - profesional verificado en ${city || country} | RegiKaha`;
    map.seo_description = String(b.tagline || b.description || pro.short_tagline || pro.description || "")
      .trim()
      .slice(0, 160);
  }
  const sets: string[] = [];
  const vals: any[] = [];
  for (const k of Object.keys(map)) {
    if (map[k] !== undefined) { sets.push(`${k} = ?`); vals.push(map[k]); }
  }
  if (Array.isArray(b.languages)) { sets.push("languages = ?"); vals.push(JSON.stringify(b.languages)); }
  if (sets.length) {
    vals.push(pro.id);
    await env.DB.prepare(`UPDATE professionals SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  }

  if (Array.isArray(b.categories)) {
    const st = [env.DB.prepare("DELETE FROM professional_categories WHERE professional_id = ?").bind(pro.id)];
    for (const c of b.categories.slice(0, 12)) {
      st.push(env.DB.prepare("INSERT OR IGNORE INTO professional_categories (professional_id,category_id) VALUES (?,?)").bind(pro.id, String(c)));
    }
    await env.DB.batch(st);
  }

  if (Array.isArray(b.areas)) {
    const st = [env.DB.prepare("DELETE FROM service_areas WHERE professional_id = ?").bind(pro.id)];
    for (const a of b.areas.slice(0, 80)) {
      st.push(env.DB.prepare("INSERT INTO service_areas (id,professional_id,country,region,city,postal_prefix) VALUES (?,?,?,?,?,?)")
        .bind(newId("area_"), pro.id, String(a.country || "").toUpperCase(), String(a.region || ""), String(a.city || ""), String(a.postalPrefix || "")));
    }
    await env.DB.batch(st);
  }

  return json({ ok: true });
}
