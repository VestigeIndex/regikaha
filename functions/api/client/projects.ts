import { privateJson, bad, getSessionUser } from "../../../apilib/http";

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  const rows = await env.DB.prepare(
    `SELECT id,title,description,country,region,city,category_id,subcategory,urgency,budget_range,status,created_at,contact_email,client_id
     FROM project_requests
     WHERE client_id = ? OR (contact_email = ? AND ? = 1)
     ORDER BY created_at DESC
     LIMIT 100`,
  ).bind(user.id, user.email, Number(user.email_verified || 0)).all();

  return privateJson({
    ok: true,
    projects: rows.results || [],
  });
}
