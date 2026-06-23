import { privateJson, bad, requireAdmin } from "../../../apilib/http";
import { logAudit } from "../../../apilib/audit";

// GET /api/admin/media-moderation — imágenes de portfolio pendientes de aprobación.
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const admin = await requireAdmin(env, request);
  if (admin instanceof Response) return admin;
  let items: any[] = [];
  try {
    const rows = await env.DB.prepare(
      `SELECT pi.id, pi.title, pi.description, pi.location, pi.image_url, pi.thumbnail_url, pi.created_at,
              pr.public_name AS professional, pr.country AS country
       FROM portfolio_items pi
       LEFT JOIN professionals pr ON pr.id = pi.professional_id
       WHERE pi.moderation_status = 'pending'
       ORDER BY pi.created_at ASC
       LIMIT 100`,
    ).all();
    items = rows.results || [];
  } catch {
    items = [];
  }
  return privateJson({ items });
}

// POST /api/admin/media-moderation — { id, action: 'approve' | 'reject' }
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const admin = await requireAdmin(env, request);
  if (admin instanceof Response) return admin;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const id = String(body.id || "");
  const action = String(body.action || "");
  if (!id || !["approve", "reject"].includes(action)) return bad("Acción no válida");
  const status = action === "approve" ? "approved" : "rejected";
  try {
    await env.DB.prepare("UPDATE portfolio_items SET moderation_status = ? WHERE id = ?").bind(status, id).run();
    await logAudit(env, { userId: (admin as any).id || null, action: `media_${status}`, resourceType: "portfolio_item", resourceId: id, request });
  } catch {
    return bad("No se pudo actualizar", 500);
  }
  return privateJson({ ok: true, id, status });
}
