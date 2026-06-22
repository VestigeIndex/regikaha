import { json, bad, getSessionUser } from "../../../apilib/http";
import { newId } from "../../../apilib/auth";
import { getSubscriptionAccess } from "../../../apilib/professional";
import { planTier, limitsForPlan } from "../../../lib/regiworks/storage/limits";
import { enforceUploadLimits } from "../../../packages/cost-guards";
import { uploadOptimizedImageToR2 } from "../../../packages/image-optimizer";
import { logError } from "../../../lib/observability";

const PLAN_KEY = { free: "free", pro: "autonomo_nacional", business: "europa_pro" } as const;

// POST /api/regiworks/media — sube una imagen YA comprimida (WebP) a R2.
// Rechaza archivos grandes y aplica la cuota de imágenes del plan.
export async function onRequestPost(context: any) {
  const { env, request } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  if (!env.MEDIA) return bad("El almacenamiento de imágenes no está activo", 503);

  let form: FormData;
  try { form = await request.formData(); } catch { return bad("Solicitud no válida"); }
  const file = form.get("file");
  const thumb = form.get("thumbnail");
  if (!(file instanceof File)) return bad("Selecciona una imagen válida");

  const { subscription } = await getSubscriptionAccess(env, user.id);
  const plan = planTier(subscription);
  const limits = limitsForPlan(plan);
  const planKey = PLAN_KEY[plan];

  let used = 0;
  try {
    const row = await env.DB.prepare("SELECT COUNT(*) AS total FROM regiworks_media WHERE user_id = ?").bind(user.id).first();
    used = Number(row?.total || 0);
  } catch { used = 0; }
  if (used >= limits.maxImages) return bad(`Has alcanzado el máximo de ${limits.maxImages} imágenes de tu plan.`, 409);

  if (file.size > limits.maxImageBytes) return bad(`La imagen supera el máximo de ${Math.round(limits.maxImageBytes / 1000)} KB de tu plan.`, 413);
  const uploadErr = enforceUploadLimits(env, { file, plan: planKey });
  if (uploadErr) return uploadErr;
  if (thumb instanceof File) {
    if (thumb.size > limits.maxThumbnailBytes) return bad("La miniatura es demasiado grande.", 413);
    const thumbErr = enforceUploadLimits(env, { file: thumb, plan: planKey, thumbnail: true });
    if (thumbErr) return thumbErr;
  }

  const id = newId("rwm_");
  const projectId = String(form.get("projectId") || "").slice(0, 64) || null;
  const key = `media/regiworks/${user.id}/${id}.webp`;
  const thumbKey = `media/regiworks/${user.id}/${id}-thumb.webp`;
  try {
    await uploadOptimizedImageToR2(env.MEDIA, file, key, { userId: String(user.id), kind: "regiworks", optimized: "true" });
    if (thumb instanceof File) {
      await uploadOptimizedImageToR2(env.MEDIA, thumb, thumbKey, { userId: String(user.id), kind: "regiworks", thumbnail: "true" });
    }
    const width = Math.max(0, Math.min(4000, Number(form.get("width") || 0))) || null;
    const height = Math.max(0, Math.min(10000, Number(form.get("height") || 0))) || null;
    await env.DB.prepare(
      "INSERT INTO regiworks_media (id,user_id,project_id,r2_key,thumb_key,width,height,size_bytes) VALUES (?,?,?,?,?,?,?,?)",
    ).bind(id, user.id, projectId, key, thumb instanceof File ? thumbKey : null, width, height, file.size).run();
  } catch (error) {
    logError("regiworks.media", error, { userId: user.id });
    return bad("No se pudo subir la imagen", 500);
  }
  return json({
    ok: true,
    id,
    url: `/api/media/${key}`,
    thumbnailUrl: thumb instanceof File ? `/api/media/${thumbKey}` : `/api/media/${key}`,
  }, 201);
}
