import { json, bad, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";

function clean(value: unknown, max = 600): string {
  return String(value || "").trim().slice(0, max);
}

async function upsertCoverage(env: any, country: string, city: string, categoryId: string) {
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM professionals p JOIN professional_categories pc ON pc.professional_id = p.id WHERE p.active_status = 1 AND p.country = ? AND lower(p.city) = lower(?) AND pc.category_id = ?",
  ).bind(country, city, categoryId).first();
  const professionalsCount = Number(row?.total || 0);
  const status = professionalsCount >= 4 ? "activa" : professionalsCount >= 1 ? "inicial" : "verificando";
  const id = `${country}:${city}:${categoryId}`.toLowerCase();
  await env.DB.prepare(
    `INSERT INTO coverage_status (id,country,city,category_id,status,professionals_count,demand_count,last_updated)
     VALUES (?,?,?,?,?,?,1,datetime('now'))
     ON CONFLICT(country, city, category_id) DO UPDATE SET
       status = excluded.status,
       professionals_count = excluded.professionals_count,
       demand_count = demand_count + 1,
       last_updated = datetime('now')`,
  ).bind(id, country, city, categoryId, status, professionalsCount).run();
  if (professionalsCount === 0) {
    await env.DB.prepare(
      `INSERT INTO growth_tasks (id,type,country,city,category_id,priority,status,prompt)
       VALUES (?,?,?,?,?,1,'open',?)`,
    ).bind(
      newId("gt_"),
      "captar_profesionales",
      country,
      city,
      categoryId,
      `Buscar profesionales verificados de ${categoryId} en ${city}, ${country}. Hay demanda real pendiente y se debe preparar outreach fundador.`,
    ).run();
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const email = clean(b.email, 160).toLowerCase();
  const description = clean(b.description, 2000);
  const country = clean(b.country, 4).toUpperCase();
  const city = clean(b.city, 120);
  const categoryId = clean(b.categoryId || b.category, 120);
  if (clean(b.website, 200)) return bad("Solicitud no válida");
  if (!isEmail(email)) return bad("Email no válido");
  if (description.length < 10) return bad("Describe un poco más el proyecto");
  if (!country || !city || !categoryId) return bad("Faltan país, ciudad o categoría");
  if (String(b.acceptsPreEstimate) !== "true" && b.acceptsPreEstimate !== true) {
    return bad("Debes aceptar recibir pre-presupuestos no vinculantes");
  }

  const projectId = newId("prj_");
  const quoteId = newId("qr_");
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO project_requests
        (id,client_type,country,city,postal_code,category_id,subcategory,description,urgency,budget_range,property_type,approximate_measures,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'published')`,
    ).bind(
      projectId,
      clean(b.clientType || "particular", 80),
      country,
      city,
      clean(b.postalCode, 20),
      categoryId,
      clean(b.subcategory, 120),
      description,
      clean(b.urgency || "flexible", 40),
      clean(b.budgetRange, 80),
      clean(b.propertyType, 80),
      clean(b.approximateMeasures, 120),
    ),
    env.DB.prepare(
      `INSERT INTO quote_requests
        (id,professional_id,category_id,service_id,client_name,client_email,client_phone,country,region,city,description,budget_range,urgency,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'new')`,
    ).bind(
      quoteId, null, categoryId, null, clean(b.name || "Cliente", 120), email, clean(b.phone, 80),
      country, clean(b.region, 120), city, description, clean(b.budgetRange, 80), clean(b.urgency || "flexible", 40),
    ),
  ]);

  await upsertCoverage(env, country, city, categoryId);

  return json({ ok: true, projectId, quoteId }, 201);
}
