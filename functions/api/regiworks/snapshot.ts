import { privateJson, bad, getSessionUser } from "../../../apilib/http";

// GET /api/regiworks/snapshot — estado cloud del workspace del usuario.
export async function onRequestGet(context: any) {
  const { env, request } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  let row: any = null;
  try {
    row = await env.DB.prepare("SELECT data, revision, updated_at FROM regiworks_workspaces WHERE user_id = ?").bind(user.id).first();
  } catch {
    row = null;
  }
  let data: any = null;
  try { data = row?.data ? JSON.parse(row.data) : null; } catch { data = null; }
  return privateJson({ ok: true, data, revision: Number(row?.revision || 0), updatedAt: row?.updated_at || null });
}
