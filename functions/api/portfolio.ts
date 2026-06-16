import { json, bad } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { getCurrentProfessional } from "../../apilib/professional";

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function mapItem(row: any) {
  return {
    id: row.id,
    professionalId: row.professional_id,
    title: row.title,
    category: row.category || "Trabajo realizado",
    description: row.description || "",
    location: row.location || "",
    beforeImage: row.image_url,
    afterImage: row.image_url,
    galleryImages: [row.image_url],
    completionDate: row.completion_date || row.created_at,
    imageUrl: row.image_url,
  };
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  const rows = await context.env.DB.prepare(
    `SELECT * FROM portfolio_items WHERE professional_id = ? ORDER BY sort_order ASC, created_at DESC`,
  ).bind(current.professional.id).all();

  return json({ items: (rows.results || []).map(mapItem), logoImage: current.professional.logo_image || null });
}

export async function onRequestPost(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  const form = await context.request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "portfolio");
  const hasMedia = !!context.env.MEDIA;

  if (!(file instanceof File)) return bad("Falta la imagen");
  const ext = allowedTypes[file.type];
  if (!ext) return bad("Formato no soportado. Usa JPG, PNG o WebP");
  const maxSize = hasMedia ? 5 * 1024 * 1024 : 900 * 1024;
  if (file.size > maxSize) return bad(hasMedia ? "La imagen no puede superar 5 MB" : "Sin R2 activo, la imagen no puede superar 900 KB");

  if (kind !== "logo") {
    const count = await context.env.DB.prepare("SELECT COUNT(*) AS total FROM portfolio_items WHERE professional_id = ?")
      .bind(current.professional.id)
      .first();
    if (Number(count?.total || 0) >= 5) return bad("Puedes publicar hasta 5 fotos de trabajos");
  }

  const id = newId(kind === "logo" ? "logo_" : "port_");
  let key: string | null = null;
  let url: string;
  if (hasMedia) {
    key = `media/${current.professional.id}/${kind}/${id}.${ext}`;
    await context.env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
      customMetadata: {
        professionalId: current.professional.id,
        kind,
      },
    });
    url = `/api/media/${key}`;
  } else {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    url = `data:${file.type};base64,${btoa(binary)}`;
  }

  if (kind === "logo") {
    await context.env.DB.prepare("UPDATE professionals SET logo_image = ? WHERE id = ?")
      .bind(url, current.professional.id)
      .run();
    return json({ ok: true, logoImage: url });
  }

  const title = String(form.get("title") || "Trabajo realizado").trim().slice(0, 120);
  const category = String(form.get("category") || "").trim().slice(0, 80);
  const description = String(form.get("description") || "").trim().slice(0, 600);
  const location = String(form.get("location") || current.professional.city || current.professional.region || "").trim().slice(0, 120);
  const completionDate = String(form.get("completionDate") || "").trim().slice(0, 20) || null;

  await context.env.DB.prepare(
    `INSERT INTO portfolio_items
      (id, professional_id, title, category, description, location, image_url, r2_key, sort_order, completion_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(id, current.professional.id, title, category, description, location, url, key, 0, completionDate).run();

  return json({ ok: true, item: { id, title, category, description, location, imageUrl: url } }, 201);
}

export async function onRequestDelete(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  let b: any;
  try { b = await context.request.json(); } catch { return bad("JSON inválido"); }
  const id = String(b.id || "").trim();
  if (!id) return bad("Falta la foto");

  const row = await context.env.DB.prepare("SELECT r2_key FROM portfolio_items WHERE id = ? AND professional_id = ?")
    .bind(id, current.professional.id)
    .first();
  await context.env.DB.prepare("DELETE FROM portfolio_items WHERE id = ? AND professional_id = ?")
    .bind(id, current.professional.id)
    .run();
  if (row?.r2_key && context.env.MEDIA) await context.env.MEDIA.delete(row.r2_key);

  return json({ ok: true });
}
