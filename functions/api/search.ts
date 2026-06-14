import { json } from "../../apilib/http";

// GET /api/search?cat=&country=&region=&q= — cruza servicio (categoría) + zona.
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const u = new URL(request.url);
  const cat = u.searchParams.get("cat") || "";
  const country = (u.searchParams.get("country") || "").toUpperCase();
  const region = u.searchParams.get("region") || "";
  const q = u.searchParams.get("q") || "";

  const where: string[] = ["p.active_status = 1", "p.verification_status IN ('verified','limited')"];
  const binds: any[] = [];
  let joins = "";

  if (cat) {
    joins += " JOIN professional_categories pc ON pc.professional_id = p.id";
    where.push("pc.category_id = ?");
    binds.push(cat);
  }
  if (country) {
    joins += " JOIN service_areas sa ON sa.professional_id = p.id";
    where.push("sa.country = ?");
    binds.push(country);
    if (region) {
      where.push("(sa.region = ? OR sa.region = '' OR sa.region IS NULL)");
      binds.push(region);
    }
  }
  if (q) {
    where.push("(p.public_name LIKE ? OR p.description LIKE ? OR p.short_tagline LIKE ?)");
    const like = `%${q}%`;
    binds.push(like, like, like);
  }

  const sql = `SELECT DISTINCT p.* FROM professionals p ${joins}
    WHERE ${where.join(" AND ")}
    ORDER BY (p.verification_status = 'verified') DESC, p.average_rating DESC, p.completed_projects DESC, p.response_time_hours ASC
    LIMIT 60`;

  const rows = await env.DB.prepare(sql).bind(...binds).all();
  return json({ total: (rows.results || []).length, results: rows.results || [] });
}
