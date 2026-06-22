import { json, bad, getSessionUser } from "../../../../apilib/http";

// DELETE /api/regiworks/media/:id — borra media solo si pertenece al usuario.
export async function onRequestDelete(context: any) {
  const { env, request, params } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  const id = String(params?.id || "");
  if (!id) return bad("Falta el identificador");

  let row: any = null;
  try {
    row = await env.DB.prepare("SELECT id, user_id, r2_key, thumb_key FROM regiworks_media WHERE id = ?").bind(id).first();
  } catch { row = null; }
  if (!row) return bad("No encontrado", 404);
  if (String(row.user_id) !== String(user.id)) return bad("No autorizado", 403);

  try {
    if (env.MEDIA) {
      await env.MEDIA.delete(row.r2_key);
      if (row.thumb_key) await env.MEDIA.delete(row.thumb_key);
    }
    await env.DB.prepare("DELETE FROM regiworks_media WHERE id = ?").bind(id).run();
  } catch {
    return bad("No se pudo borrar la imagen", 500);
  }
  return json({ ok: true });
}
