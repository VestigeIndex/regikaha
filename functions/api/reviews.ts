import { bad, privateJson, requireUser } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { screenFields } from "../../lib/moderation/text";

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  if (user.role !== "professional" && user.role !== "admin" && user.role !== "superadmin") return bad("No autorizado", 403);
  const professional = await env.DB.prepare("SELECT id, average_rating, review_count FROM professionals WHERE user_id = ?").bind(user.id).first();
  if (!professional) return privateJson({ reviews: [], summary: { average: 0, total: 0, replied: 0 } });
  const rows = await env.DB.prepare(
    `SELECT id, client_name, service_label, rating, comment, reply, status, verified, created_at
     FROM reviews WHERE professional_id = ? AND status IN ('published','pending') ORDER BY created_at DESC LIMIT 100`,
  ).bind(professional.id).all();
  const reviews = rows.results || [];
  return privateJson({
    reviews,
    summary: {
      average: Number(professional.average_rating || 0),
      total: Number(professional.review_count || 0),
      replied: reviews.filter((review: any) => Boolean(review.reply)).length,
    },
  });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  if (user.role !== "client") return bad("Solo el cliente que tuvo la interacción puede valorar", 403);
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const projectId = String(body.projectId || "").trim();
  const professionalId = String(body.professionalId || "").trim();
  const rating = Number(body.rating);
  const comment = String(body.comment || "").trim().slice(0, 2000);
  if (!projectId || !professionalId || !Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 20) return bad("Reseña incompleta");
  if (!screenFields(comment).ok) return bad("La reseña contiene contenido no permitido. Revísala y vuelve a intentarlo.", 400);
  const project = await env.DB.prepare("SELECT id FROM project_requests WHERE id = ? AND client_id = ?").bind(projectId, user.id).first();
  const interaction = await env.DB.prepare("SELECT id FROM project_interests WHERE project_id = ? AND professional_id = ?").bind(projectId, professionalId).first();
  if (!project || !interaction) return bad("No existe una interacción verificable para esta reseña", 403);
  const profile = await env.DB.prepare("SELECT display_name FROM profiles WHERE user_id = ?").bind(user.id).first();
  await env.DB.prepare(
    `INSERT INTO reviews (id,professional_id,client_user_id,project_id,client_name,service_label,rating,comment,status,verified)
     VALUES (?,?,?,?,?,?,?,?, 'pending', 1)`,
  ).bind(newId("rev_"), professionalId, user.id, projectId, String(profile?.display_name || "Cliente verificado").slice(0, 100), String(body.serviceLabel || "Proyecto realizado").slice(0, 120), rating, comment).run();
  return privateJson({ ok: true, status: "pending" }, 201);
}

export async function onRequestPatch(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  if (user.role !== "professional") return bad("No autorizado", 403);
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const reviewId = String(body.reviewId || "").trim();
  const reply = String(body.reply || "").trim().slice(0, 1500);
  if (!reviewId || reply.length < 2) return bad("Respuesta incompleta");
  const professional = await env.DB.prepare("SELECT id FROM professionals WHERE user_id = ?").bind(user.id).first();
  if (!professional) return bad("Perfil profesional no encontrado", 404);
  await env.DB.prepare("UPDATE reviews SET reply = ? WHERE id = ? AND professional_id = ?").bind(reply, reviewId, professional.id).run();
  return privateJson({ ok: true });
}
