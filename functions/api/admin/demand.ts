import { json, requireAdmin } from "../../../apilib/http";

async function all(env: any, sql: string, ...binds: any[]) {
  const rows = await env.DB.prepare(sql).bind(...binds).all();
  return rows.results || [];
}

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const admin = await requireAdmin(env, request);
  if (admin instanceof Response) return admin;

  const [
    byCountry,
    byCity,
    byCategory,
    coverage,
    tasks,
    b2b,
    pendingProfessionals,
  ] = await Promise.all([
    all(env, "SELECT country, COUNT(*) AS total FROM project_requests GROUP BY country ORDER BY total DESC LIMIT 20"),
    all(env, "SELECT country, city, COUNT(*) AS total FROM project_requests GROUP BY country, city ORDER BY total DESC LIMIT 30"),
    all(env, "SELECT category_id, COUNT(*) AS total FROM project_requests GROUP BY category_id ORDER BY total DESC LIMIT 30"),
    all(env, "SELECT * FROM coverage_status ORDER BY demand_count DESC, professionals_count ASC LIMIT 50"),
    all(env, "SELECT * FROM growth_tasks WHERE status != 'done' ORDER BY priority ASC, created_at DESC LIMIT 50"),
    all(env, "SELECT country, city, required_specialty, COUNT(*) AS total FROM b2b_project_requests GROUP BY country, city, required_specialty ORDER BY total DESC LIMIT 20"),
    all(env, "SELECT id, public_name, city, country, verification_status FROM professionals WHERE verification_status = 'pending' ORDER BY created_at DESC LIMIT 30"),
  ]);

  return json({ byCountry, byCity, byCategory, coverage, tasks, b2b, pendingProfessionals });
}
