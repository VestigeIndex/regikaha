import { json, bad, getSessionUser, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { isActiveCountryCode } from "../../lib/market";

function clean(value: unknown, max = 600): string {
  return String(value || "").trim().slice(0, max);
}

function coordinate(value: unknown, min: number, max: number): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
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

async function matchProfessionals(env: any, input: {
  categoryId: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
}) {
  const rows = await env.DB.prepare(
    "SELECT DISTINCT p.id, p.verification_status, p.average_rating, p.service_radius_km,"
    + " COALESCE(p.latitude, profile.latitude, gp.latitude) AS latitude,"
    + " COALESCE(p.longitude, profile.longitude, gp.longitude) AS longitude"
    + " FROM professionals p"
    + " JOIN professional_categories pc ON pc.professional_id = p.id AND pc.category_id = ?"
    + " JOIN subscriptions subscription ON subscription.user_id = p.user_id"
    + " AND subscription.status IN ('founder_trial_0_eur','trialing','active')"
    + " LEFT JOIN profiles profile ON profile.user_id = p.user_id"
    + " LEFT JOIN geo_places gp ON gp.country_code = p.country AND gp.active = 1"
    + " AND (lower(gp.locality_name) = lower(p.city) OR lower(gp.name) = lower(p.city))"
    + " WHERE p.active_status = 1 AND p.verification_status != 'suspended' AND p.country = ?"
    + " ORDER BY (p.verification_status = 'verified') DESC, p.average_rating DESC LIMIT 100",
  ).bind(input.categoryId, input.country).all();

  return (rows.results || [])
    .map((professional: any) => {
      let distance: number | null = null;
      if (input.latitude !== null && input.longitude !== null) {
        const professionalLatitude = Number(professional.latitude);
        const professionalLongitude = Number(professional.longitude);
        if (!Number.isFinite(professionalLatitude) || !Number.isFinite(professionalLongitude)) return null;
        distance = distanceKm(
          { latitude: input.latitude, longitude: input.longitude },
          { latitude: professionalLatitude, longitude: professionalLongitude },
        );
        if (distance > input.radiusKm + Math.max(0, Number(professional.service_radius_km || 0))) return null;
      }
      const score = (professional.verification_status === "verified" ? 40 : 10)
        + Number(professional.average_rating || 0) * 8
        + (distance === null ? 0 : Math.max(0, 20 - distance / 5));
      return { ...professional, distance, score: Math.round(score * 10) / 10 };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 12);
}

async function upsertCoverage(env: any, country: string, city: string, categoryId: string) {
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM professionals p JOIN professional_categories pc ON pc.professional_id = p.id WHERE p.active_status = 1 AND p.country = ? AND lower(p.city) = lower(?) AND pc.category_id = ?",
  ).bind(country, city, categoryId).first();
  const professionalsCount = Number(row?.total || 0);
  const status = professionalsCount >= 4 ? "activa" : professionalsCount >= 1 ? "inicial" : "verificando";
  const id = `${country}:${city}:${categoryId}`.toLowerCase();
  await env.DB.prepare(
    `INSERT INTO coverage_status (id,country,city,category_id,status,professionals_count,demand_count,last_updated)
     VALUES (?,?,?,?,?,?,1,datetime('now'))
     ON CONFLICT(country, city, category_id) DO UPDATE SET
       status = excluded.status,
       professionals_count = excluded.professionals_count,
       demand_count = demand_count + 1,
       last_updated = datetime('now')`,
  ).bind(id, country, city, categoryId, status, professionalsCount).run();
  if (professionalsCount === 0) {
    await env.DB.prepare(
      `INSERT INTO growth_tasks (id,type,country,city,category_id,priority,status,prompt)
       VALUES (?,?,?,?,?,1,'open',?)`,
    ).bind(
      newId("gt_"),
      "captar_profesionales",
      country,
      city,
      categoryId,
      `Buscar profesionales verificados de ${categoryId} en ${city}, ${country}. Hay demanda real pendiente y se debe preparar outreach fundador.`,
    ).run();
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const email = clean(b.email, 160).toLowerCase();
  const description = clean(b.description, 2000);
  const country = clean(b.country, 4).toUpperCase();
  const city = clean(b.city, 120);
  const categoryId = clean(b.categoryId || b.category, 120);
  const latitude = coordinate(b.latitude ?? b.placeLatitude, -90, 90);
  const longitude = coordinate(b.longitude ?? b.placeLongitude, -180, 180);
  const radiusKm = Math.max(10, Math.min(250, Number(b.radiusKm || 25) || 25));
  if (clean(b.website, 200)) return bad("Solicitud no válida");
  if (!isEmail(email)) return bad("Email no válido");
  if (description.length < 20) return bad("Describe un poco más el proyecto");
  if (!country || !city || !categoryId) return bad("Faltan país, ciudad o categoría");
  if (!isActiveCountryCode(country)) return bad("País no disponible todavía en RegiKaha");
  if (String(b.acceptsPreEstimate) !== "true" && b.acceptsPreEstimate !== true) {
    return bad("Debes aceptar recibir pre-presupuestos no vinculantes");
  }

  const projectId = newId("prj_");
  const sessionUser = await getSessionUser(env, request);
  await env.DB.prepare(
      `INSERT INTO project_requests
        (id,client_id,client_type,country,city,postal_code,latitude,longitude,radius_km,category_id,subcategory,description,urgency,budget_range,property_type,approximate_measures,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'published')`,
    ).bind(
      projectId,
      sessionUser?.id || null,
      clean(b.clientType || "particular", 80),
      country,
      city,
      clean(b.postalCode, 20),
      latitude,
      longitude,
      radiusKm,
      categoryId,
      clean(b.subcategory, 120),
      description,
      clean(b.urgency || "flexible", 40),
      clean(b.budgetRange, 80),
      clean(b.propertyType, 80),
      clean(b.approximateMeasures, 120),
    ).run();

  const matches = await matchProfessionals(env, { categoryId, country, city, latitude, longitude, radiusKm });
  const quoteIds: string[] = [];
  const quoteTargets = matches.length ? matches : [{ id: null, score: 0, distance: null }];
  const statements = quoteTargets.flatMap((match: any) => {
    const quoteId = newId("qr_");
    quoteIds.push(quoteId);
    const quote = env.DB.prepare(
      `INSERT INTO quote_requests
        (id,professional_id,category_id,service_id,client_name,client_email,client_phone,country,region,city,latitude,longitude,radius_km,description,budget_range,urgency,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'new')`,
    ).bind(
      quoteId, match.id, categoryId, null, clean(b.name || "Cliente", 120), email, clean(b.phone, 80),
      country, clean(b.region, 120), city, latitude, longitude, radiusKm, description,
      clean(b.budgetRange, 80), clean(b.urgency || "flexible", 40),
    );
    if (!match.id) return [quote];
    const candidate = env.DB.prepare(
      "INSERT OR IGNORE INTO match_candidates (id,project_id,professional_id,country,city,category_id,score,reasons,status) VALUES (?,?,?,?,?,?,?,?,?)",
    ).bind(
      newId("match_"), projectId, match.id, country, city, categoryId, match.score,
      JSON.stringify(match.distance == null ? ["category", "country"] : ["category", "country", "radius"]),
      "candidate",
    );
    return [quote, candidate];
  });
  await env.DB.batch(statements);

  await upsertCoverage(env, country, city, categoryId);

  return json({ ok: true, projectId, quoteIds, matchedProfessionals: matches.length }, 201);
}
