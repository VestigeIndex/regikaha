import { bad, getSessionUser } from "../../../apilib/http";

// POST /api/regiworks/export — descarga el workspace del usuario en JSON.
export async function onRequestPost(context: any) {
  const { env, request } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  let payload = "{}";
  try {
    const row = await env.DB.prepare("SELECT data FROM regiworks_workspaces WHERE user_id = ?").bind(user.id).first();
    payload = String(row?.data || "{}");
  } catch {
    payload = "{}";
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(payload, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="regiworks-${stamp}.json"`,
      "cache-control": "no-store",
    },
  });
}
