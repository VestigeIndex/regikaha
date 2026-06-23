import { json, bad } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { getCurrentProfessional, getSubscriptionAccess } from "../../apilib/professional";
import { enforcePlanLimits, enforceUploadLimits, rateLimitByUser } from "../../packages/cost-guards";
import { uploadOptimizedImageToR2 } from "../../packages/image-optimizer";
import { screenFields } from "../../lib/moderation/text";

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
    thumbnailUrl: row.thumbnail_url || row.image_url,
    imageSize: Number(row.image_size || 0),
    width: Number(row.image_width || 0),
    height: Number(row.image_height || 0),
    moderationStatus: row.moderation_status || "approved",
  };
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const access = await getSubscriptionAccess(context.env, current.user.id);
  const plan = access.subscription?.plan === "europa_pro" ? "europa_pro" : "autonomo_nacional";

  const rows = await context.env.DB.prepare(
    `SELECT * FROM portfolio_items WHERE professional_id = ? ORDER BY sort_order ASC, created_at DESC`,
  ).bind(current.professional.id).all();

  return json({
    items: (rows.results || []).map(mapItem),
    logoImage: current.professional.logo_image || null,
    limits: enforcePlanLimits(context.env, plan),
  });
}

export async function onRequestPost(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  const limited = await rateLimitByUser(context.env, current.user.id, "portfolio:upload", 12);
  if (limited) return limited;
  if (!context.env.MEDIA) return bad("El almacenamiento R2 todavía no está activo", 503);

  const form = await context.request.formData();
  const file = form.get("file");
  const thumbnail = form.get("thumbnail");
  const kind = String(form.get("kind") || "portfolio");

  if (!(file instanceof File)) return bad("Falta la imagen");
  if (!(thumbnail instanceof File)) return bad("Falta la miniatura optimizada");
  if (!new Set(["logo", "portfolio"]).has(kind)) return bad("Tipo de imagen no válido");

  const access = await getSubscriptionAccess(context.env, current.user.id);
  const plan = access.subscription?.plan === "europa_pro" ? "europa_pro" : "autonomo_nacional";
  const fileError = enforceUploadLimits(context.env, { file, plan });
  if (fileError) return fileError;
  const thumbnailError = enforceUploadLimits(context.env, { file: thumbnail, plan, thumbnail: true });
  if (thumbnailError) return thumbnailError;
  const limits = enforcePlanLimits(context.env, plan);

  if (kind !== "logo") {
    const count = await context.env.DB.prepare("SELECT COUNT(*) AS total FROM portfolio_items WHERE professional_id = ?")
      .bind(current.professional.id)
      .first();
    const totalProfilePhotos = Number(count?.total || 0) + (current.professional.logo_image ? 1 : 0);
    if (totalProfilePhotos >= limits.profilePhotos) {
      return bad(`Tu plan permite hasta ${limits.profilePhotos} imágenes de perfil`);
    }
  }

  const id = newId(kind === "logo" ? "logo_" : "port_");
  const key = `media/${current.professional.id}/${kind}/${id}.webp`;
  const thumbnailKey = `media/${current.professional.id}/${kind}/${id}-thumb.webp`;
  const metadata = { professionalId: String(current.professional.id), kind, optimized: "true" };

  if (kind === "logo") {
    await uploadOptimizedImageToR2(context.env.MEDIA, thumbnail, key, { ...metadata, thumbnail: "true" });
    const url = `/api/media/${key}`;
    await context.env.DB.prepare("UPDATE professionals SET logo_image = ? WHERE id = ?")
      .bind(url, current.professional.id)
      .run();
    const previous = String(current.professional.logo_image || "");
    if (previous.startsWith("/api/media/media/") && previous !== url) {
      await context.env.MEDIA.delete(previous.replace("/api/media/", ""));
    }
    return json({ ok: true, logoImage: url });
  }

  await uploadOptimizedImageToR2(context.env.MEDIA, file, key, metadata);
  try {
    await uploadOptimizedImageToR2(context.env.MEDIA, thumbnail, thumbnailKey, { ...metadata, thumbnail: "true" });
  } catch (error) {
    await context.env.MEDIA.delete(key);
    throw error;
  }
  const url = `/api/media/${key}`;
  const thumbnailUrl = `/api/media/${thumbnailKey}`;

  const title = String(form.get("title") || "Trabajo realizado").trim().slice(0, 120);
  const category = String(form.get("category") || "").trim().slice(0, 80);
  const description = String(form.get("description") || "").trim().slice(0, 600);
  const location = String(form.get("location") || current.professional.city || current.professional.region || "").trim().slice(0, 120);
  if (!screenFields(title, description, location).ok) {
    return bad("El texto del trabajo contiene contenido no permitido. Revísalo y vuelve a intentarlo.", 400);
  }
  const completionDate = String(form.get("completionDate") || "").trim().slice(0, 20) || null;
  const width = Math.max(1, Math.min(limits.maxWidth, Number(form.get("width") || 0) || 1));
  const height = Math.max(1, Math.min(10000, Number(form.get("height") || 0) || 1));

  await context.env.DB.prepare(
    `INSERT INTO portfolio_items
      (id, professional_id, title, category, description, location, image_url, r2_key, thumbnail_url,
       thumbnail_r2_key, image_size, image_width, image_height, mime_type, sort_order, completion_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    id, current.professional.id, title, category, description, location, url, key, thumbnailUrl,
    thumbnailKey, file.size, width, height, file.type, 0, completionDate,
  ).run();

  return json({ ok: true, item: { id, title, category, description, location, imageUrl: url, thumbnailUrl } }, 201);
}

export async function onRequestDelete(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  let b: any;
  try { b = await context.request.json(); } catch { return bad("JSON inválido"); }
  const id = String(b.id || "").trim();
  if (!id) return bad("Falta la foto");

  const row = await context.env.DB.prepare("SELECT r2_key, thumbnail_r2_key FROM portfolio_items WHERE id = ? AND professional_id = ?")
    .bind(id, current.professional.id)
    .first();
  await context.env.DB.prepare("DELETE FROM portfolio_items WHERE id = ? AND professional_id = ?")
    .bind(id, current.professional.id)
    .run();
  if (row?.r2_key && context.env.MEDIA) await context.env.MEDIA.delete(row.r2_key);
  if (row?.thumbnail_r2_key && context.env.MEDIA) await context.env.MEDIA.delete(row.thumbnail_r2_key);

  return json({ ok: true });
}
