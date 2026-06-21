import { bad, privateJson, requireAdmin } from "../../../apilib/http";
import { newId } from "../../../apilib/auth";

const statuses = new Set(["active", "suspended"]);
const roles = new Set(["client", "professional", "company", "subcontractor", "admin", "superadmin"]);

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const admin = await requireAdmin(env, request);
  if (admin instanceof Response) return admin;
  const url = new URL(request.url);
  const role = url.searchParams.get("role") || "";
  const status = url.searchParams.get("status") || "";
  const search = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const rows = await env.DB.prepare(
    `SELECT u.id, u.email, u.role, u.status, u.email_verified, u.created_at,
      COALESCE(p.display_name, pr.public_name, '') AS display_name
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     LEFT JOIN professionals pr ON pr.user_id = u.id
     WHERE u.deleted_at IS NULL
       AND (? = '' OR u.role = ?)
       AND (? = '' OR u.status = ?)
       AND (? = '' OR lower(u.email) LIKE '%' || lower(?) || '%' OR lower(COALESCE(p.display_name, pr.public_name, '')) LIKE '%' || lower(?) || '%')
     ORDER BY u.created_at DESC LIMIT 200`,
  ).bind(role, role, status, status, search, search, search).all();
  return privateJson({ users: rows.results || [], currentRole: admin.role });
}

export async function onRequestPatch(context: any) {
  const { request, env } = context;
  const admin = await requireAdmin(env, request);
  if (admin instanceof Response) return admin;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const userId = String(body.userId || "").trim();
  const status = String(body.status || "").trim();
  const role = String(body.role || "").trim();
  if (!userId || userId === admin.id) return bad("Operación no permitida");
  const target = await env.DB.prepare("SELECT id, role FROM users WHERE id = ? AND deleted_at IS NULL").bind(userId).first();
  if (!target) return bad("Usuario no encontrado", 404);
  if (target.role === "superadmin" && admin.role !== "superadmin") return bad("No autorizado", 403);

  if (status) {
    if (!statuses.has(status)) return bad("Estado inválido");
    await env.DB.batch([
      env.DB.prepare("UPDATE users SET status = ? WHERE id = ?").bind(status, userId),
      env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND ? = 'suspended'").bind(userId, status),
      env.DB.prepare("INSERT INTO admin_actions (id,admin_user_id,action,target_type,target_id,metadata_json) VALUES (?,?,?,?,?,?)").bind(newId("adm_"), admin.id, `user_${status}`, "user", userId, JSON.stringify({ previousRole: target.role })),
    ]);
  }
  if (role) {
    if (admin.role !== "superadmin" || !roles.has(role)) return bad("Solo un superadministrador puede cambiar roles", 403);
    await env.DB.batch([
      env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, userId),
      env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId),
      env.DB.prepare("INSERT INTO admin_actions (id,admin_user_id,action,target_type,target_id,metadata_json) VALUES (?,?,?,?,?,?)").bind(newId("adm_"), admin.id, "role_changed", "user", userId, JSON.stringify({ from: target.role, to: role })),
    ]);
  }
  return privateJson({ ok: true });
}
