import { json } from "../../apilib/http";
import { isActiveCountryCode } from "../../lib/market";

// GET /api/search?cat=&country=&region=&q= — cruza servicio (categoría) + zona.
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const u = new URL(request.url);
  const cat = u.searchParams.get("cat") || "";
  const country = (u.searchParams.get("country") || "").toUpperCase();
  const region = u.searchParams.get("region") || "";
  const city = u.searchParams.get("city") || "";
  const q = u.searchParams.get("q") || "";

  if (country && !isActiveCountryCode(country)) {
    return json({ total: 0, results: [] });
  }

  const where: string[] = ["p.active_status = 1", "p.verification_status != 'suspended'"];
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
    if (city) {
      where.push("(lower(sa.city) = lower(?) OR lower(p.city) = lower(?) OR sa.city = '' OR sa.city IS NULL)");
      binds.push(city, city);
    }
  } else if (city) {
    where.push("(lower(p.city) = lower(?) OR p.city LIKE ?)");
    binds.push(city, `%${city}%`);
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
  const results = rows.results || [];
  const enriched: any[] = [];
  for (const p of results) {
    const [cats, portfolio] = await Promise.all([
      env.DB.prepare("SELECT category_id FROM professional_categories WHERE professional_id = ?").bind(p.id).all(),
      env.DB.prepare("SELECT COUNT(*) AS total FROM portfolio_items WHERE professional_id = ?").bind(p.id).first(),
    ]);
    enriched.push({
      ...p,
      category_ids: (cats.results || []).map((r: any) => r.category_id),
      portfolio_count: Number(portfolio?.total || 0),
    });
  }
  return json({ total: enriched.length, results: enriched });
}
