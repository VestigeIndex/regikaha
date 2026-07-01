import { json } from "../../apilib/http";
import { isActiveCountryCode } from "../../lib/market";
import { cachePublicResponse, configuredLimit, rateLimitByIP } from "../../packages/cost-guards";

function numeric(value: string | null, min: number, max: number): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : null;
}

function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

const orderBy: Record<string, string> = {
  relevance: "(p.verification_status = 'verified') DESC, p.average_rating DESC, p.completed_projects DESC, p.response_time_hours ASC",
  rating: "p.average_rating DESC, p.review_count DESC",
  price: "p.price_from ASC, p.average_rating DESC",
  projects: "p.completed_projects DESC, p.average_rating DESC",
  response: "p.response_time_hours ASC, p.average_rating DESC",
  experience: "p.years_experience DESC, p.average_rating DESC",
};

// GET /api/search — category, geography, radius, trust and commercial filters.
async function searchResponse(context: any) {
  const { request, env } = context;
  const u = new URL(request.url);
  const cat = u.searchParams.get("cat") || "";
  const country = (u.searchParams.get("country") || "").toUpperCase();
  const region = u.searchParams.get("region") || "";
  const city = u.searchParams.get("city") || "";
  const query = u.searchParams.get("q") || "";
  const latitude = numeric(u.searchParams.get("lat"), -90, 90);
  const longitude = numeric(u.searchParams.get("lng"), -180, 180);
  const radiusKm = numeric(u.searchParams.get("radiusKm"), 1, 500);
  const hasOrigin = latitude !== null && longitude !== null && radiusKm !== null;

  if (country && !isActiveCountryCode(country)) return json({ total: 0, results: [] });

  const where: string[] = ["p.active_status = 1", "p.verification_status != 'suspended'"];
  const binds: any[] = [];
  let joins = " LEFT JOIN profiles profile ON profile.user_id = p.user_id"
    + " LEFT JOIN geo_places gp ON gp.country_code = p.country AND gp.active = 1"
    + " AND (lower(gp.locality_name) = lower(p.city) OR lower(gp.name) = lower(p.city))";

  if (cat) {
    joins += " JOIN professional_categories pc ON pc.professional_id = p.id";
    where.push("pc.category_id = ?");
    binds.push(cat);
  }
  if (country) {
    joins += " LEFT JOIN service_areas sa ON sa.professional_id = p.id";
    where.push("(p.country = ? OR sa.country = ?)");
    binds.push(country, country);
    if (!hasOrigin && region) {
      where.push("(lower(sa.region) = lower(?) OR lower(p.region) = lower(?) OR sa.region = '' OR sa.region IS NULL)");
      binds.push(region, region);
    }
    if (!hasOrigin && city) {
      where.push("(lower(sa.city) = lower(?) OR lower(p.city) = lower(?) OR sa.city = '' OR sa.city IS NULL)");
      binds.push(city, city);
    }
  } else if (!hasOrigin && city) {
    where.push("(lower(p.city) = lower(?) OR p.city LIKE ?)");
    binds.push(city, "%" + city + "%");
  }
  if (query) {
    where.push("(p.public_name LIKE ? OR p.description LIKE ? OR p.short_tagline LIKE ?)");
    const like = "%" + query + "%";
    binds.push(like, like, like);
  }
  if (u.searchParams.get("verified") === "1") where.push("p.verification_status = 'verified'");
  if (u.searchParams.get("invoice") === "1") where.push("p.invoice_declared = 1");
  if (u.searchParams.get("insurance") === "1") where.push("p.insurance_declared = 1");
  if (u.searchParams.get("urgent") === "1") where.push("p.offers_urgent = 1");
  if (u.searchParams.get("portfolio") === "1") where.push("EXISTS (SELECT 1 FROM portfolio_items pi WHERE pi.professional_id = p.id)");
  const type = u.searchParams.get("type") || "";
  if (type) { where.push("p.type = ?"); binds.push(type); }
  const language = u.searchParams.get("language") || "";
  if (language) { where.push("lower(p.languages) LIKE ?"); binds.push("%" + language.toLowerCase() + "%"); }
  const minRating = numeric(u.searchParams.get("minRating"), 0, 5);
  if (minRating !== null) { where.push("p.average_rating >= ?"); binds.push(minRating); }
  const maxPrice = numeric(u.searchParams.get("maxPrice"), 0, 10000000);
  if (maxPrice !== null) { where.push("p.price_from <= ?"); binds.push(maxPrice); }
  const minExperience = numeric(u.searchParams.get("minExperience"), 0, 100);
  if (minExperience !== null) { where.push("p.years_experience >= ?"); binds.push(minExperience); }

  const sort = u.searchParams.get("sort") || "relevance";
  const sql = "SELECT DISTINCT"
    + " p.id, p.slug, p.type, p.type_label, p.public_name, p.country, p.region, p.city, p.phone,"
    + " p.years_experience, p.languages, p.description, p.short_tagline, p.service_radius_km,"
    + " p.insurance_declared, p.invoice_declared, p.offers_urgent, p.verification_status,"
    + " p.average_rating, p.review_count, p.completed_projects, p.response_time_hours, p.price_from,"
    + " p.logo_color, p.logo_image, p.cover_image, p.active_status, p.created_at,"
    + " COALESCE(p.latitude, profile.latitude, gp.latitude) AS search_latitude,"
    + " COALESCE(p.longitude, profile.longitude, gp.longitude) AS search_longitude"
    + " FROM professionals p " + joins
    + " WHERE " + where.join(" AND ")
    + " ORDER BY " + (orderBy[sort] || orderBy.relevance)
    + " LIMIT 200";

  let rows: { results?: any[] };
  try {
    rows = await env.DB.prepare(sql).bind(...binds).all();
  } catch {
    return json({ total: 0, results: [], degraded: true }, 200, {
      "Cache-Control": "private, no-store, max-age=0",
    });
  }
  let candidates = rows.results || [];
  if (hasOrigin) {
    candidates = candidates
      .map((professional: any) => {
        const professionalLatitude = Number(professional.search_latitude);
        const professionalLongitude = Number(professional.search_longitude);
        if (!Number.isFinite(professionalLatitude) || !Number.isFinite(professionalLongitude)) return null;
        const distance = distanceKm(
          { latitude: latitude as number, longitude: longitude as number },
          { latitude: professionalLatitude, longitude: professionalLongitude },
        );
        const operatingReach = (radiusKm as number) + Math.max(0, Number(professional.service_radius_km || 0));
        return distance <= operatingReach ? { ...professional, distance_km: Math.round(distance * 10) / 10 } : null;
      })
      .filter(Boolean);
  }

  let enriched: any[];
  try {
    enriched = await Promise.all(candidates.slice(0, 60).map(async (professional: any) => {
      const [cats, portfolio] = await Promise.all([
        env.DB.prepare("SELECT category_id FROM professional_categories WHERE professional_id = ?").bind(professional.id).all(),
        env.DB.prepare("SELECT COUNT(*) AS total FROM portfolio_items WHERE professional_id = ?").bind(professional.id).first(),
      ]);
      return {
        ...professional,
        category_ids: (cats.results || []).map((row: any) => row.category_id),
        portfolio_count: Number(portfolio?.total || 0),
      };
    }));
  } catch {
    enriched = candidates.slice(0, 60).map((professional: any) => ({
      ...professional,
      category_ids: [],
      portfolio_count: 0,
    }));
  }

  if (hasOrigin && sort === "relevance") {
    enriched.sort((a: any, b: any) =>
      Number(b.verification_status === "verified") - Number(a.verification_status === "verified")
      || Number(a.distance_km) - Number(b.distance_km)
      || Number(b.average_rating || 0) - Number(a.average_rating || 0),
    );
  }
  return json({ total: enriched.length, results: enriched });
}

export async function onRequestGet(context: any) {
  const limited = await rateLimitByIP(
    context.env,
    context.request,
    "public-search-hour",
    configuredLimit(context.env, "MAX_PUBLIC_SEARCHES_PER_IP_HOUR"),
    3600,
  );
  if (limited) return limited;
  return cachePublicResponse(context.request, 600, () => searchResponse(context));
}
