import { json, bad } from "../../apilib/http";
import { slugify, newId } from "../../apilib/auth";
import { getCurrentProfessional, safeJsonArray, textLines } from "../../apilib/professional";

const priceTypes = new Set(["fixed", "from", "hour", "m2", "project"]);

function mapService(row: any, professionalSlug?: string) {
  return {
    id: row.id,
    professionalId: row.professional_id,
    categoryId: row.category_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    priceFrom: Number(row.price_from || 0),
    priceType: row.price_type || "from",
    estimatedTime: row.estimated_time || "",
    includes: safeJsonArray(row.includes),
    excludes: safeJsonArray(row.excludes),
    process: safeJsonArray(row.process),
    faqs: safeJsonArray(row.faqs),
    serviceArea: row.service_area || "",
    isActive: !!row.is_active,
    professionalSlug,
  };
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  const rows = await context.env.DB.prepare(
    `SELECT * FROM services WHERE professional_id = ? AND is_active = 1 ORDER BY title COLLATE NOCASE`,
  ).bind(current.professional.id).all();

  return json({ services: (rows.results || []).map((row: any) => mapService(row, current.professional.slug)) });
}

export async function onRequestPost(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  let b: any;
  try { b = await context.request.json(); } catch { return bad("JSON inválido"); }

  const title = String(b.title || "").trim();
  const description = String(b.description || "").trim();
  const categoryId = String(b.categoryId || "").trim();
  const priceType = priceTypes.has(String(b.priceType)) ? String(b.priceType) : "from";
  const priceFrom = Number(b.priceFrom || 0);
  const estimatedTime = String(b.estimatedTime || "").trim();
  const serviceArea = String(b.serviceArea || current.professional.city || current.professional.region || "").trim();
  const id = String(b.id || "").trim();

  if (title.length < 3) return bad("El título del servicio es demasiado corto");
  if (description.length < 20) return bad("Añade una descripción más completa del servicio");
  if (!Number.isFinite(priceFrom) || priceFrom < 0) return bad("Precio orientativo no válido");

  const slug = slugify(b.slug || title) || newId("servicio-");
  const includes = JSON.stringify(textLines(b.includes, 20));
  const excludes = JSON.stringify(textLines(b.excludes, 20));
  const process = JSON.stringify(textLines(b.process, 20));
  const faqs = JSON.stringify(Array.isArray(b.faqs) ? b.faqs.slice(0, 12) : []);

  if (id) {
    const existing = await context.env.DB.prepare("SELECT id FROM services WHERE id = ? AND professional_id = ?")
      .bind(id, current.professional.id)
      .first();
    if (!existing) return bad("Servicio no encontrado", 404);
    await context.env.DB.prepare(
      `UPDATE services
       SET category_id = ?, title = ?, slug = ?, description = ?, price_from = ?, price_type = ?,
           estimated_time = ?, includes = ?, excludes = ?, process = ?, faqs = ?, service_area = ?, is_active = 1
       WHERE id = ? AND professional_id = ?`,
    ).bind(
      categoryId || null, title, slug, description, priceFrom, priceType,
      estimatedTime, includes, excludes, process, faqs, serviceArea, id, current.professional.id,
    ).run();
    return json({ ok: true, id, slug });
  }

  const newServiceId = newId("svc_");
  await context.env.DB.prepare(
    `INSERT INTO services
      (id, professional_id, category_id, title, slug, description, price_from, price_type,
       estimated_time, includes, excludes, process, faqs, service_area, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
  ).bind(
    newServiceId, current.professional.id, categoryId || null, title, slug, description, priceFrom,
    priceType, estimatedTime, includes, excludes, process, faqs, serviceArea,
  ).run();

  return json({ ok: true, id: newServiceId, slug }, 201);
}

export async function onRequestDelete(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  let b: any;
  try { b = await context.request.json(); } catch { return bad("JSON inválido"); }
  const id = String(b.id || "").trim();
  if (!id) return bad("Falta el servicio");

  await context.env.DB.prepare("UPDATE services SET is_active = 0 WHERE id = ? AND professional_id = ?")
    .bind(id, current.professional.id)
    .run();

  return json({ ok: true });
}
