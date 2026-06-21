import { json, bad, getSessionUser, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { isActiveCountryCode } from "../../lib/market";
import { requireTurnstile } from "../../packages/cost-guards";

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

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const user = await getSessionUser(env, request);
  if (!user) return bad("Debes iniciar sesión para publicar una subcontrata", 401);
  if (Number(user.email_verified || 0) !== 1) return bad("Verifica tu email antes de publicar", 403);

  const email = clean(b.email, 160).toLowerCase();
  const country = clean(b.country, 4).toUpperCase();
  const city = clean(b.city, 120);
  const requiredSpecialty = clean(b.requiredSpecialty || b.categoryId, 120);
  const description = clean(b.description, 2400);
  const latitude = coordinate(b.latitude ?? b.placeLatitude, -90, 90);
  const longitude = coordinate(b.longitude ?? b.placeLongitude, -180, 180);
  const radiusKm = Math.max(10, Math.min(500, Number(b.radiusKm || 50) || 50));
  if (clean(b.website, 200)) return bad("Solicitud no válida");
  const challenge = await requireTurnstile(env, request, b.turnstileToken, "publish_b2b");
  if (challenge) return challenge;
  if (!isEmail(email)) return bad("Email de empresa no válido");
  if (!country || !city || !requiredSpecialty) return bad("Faltan país, ciudad o especialidad");
  if (!isActiveCountryCode(country)) return bad("País no disponible todavía en Regi Kaha");
  if (description.length < 20) return bad("Describe un poco más la necesidad de subcontrata");

  const requestId = newId("b2b_");
  const companyProfile = user
    ? await env.DB.prepare("SELECT id FROM profiles WHERE user_id = ? AND role = 'company'").bind(user.id).first()
    : null;
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO b2b_project_requests
        (id,company_id,company_type,country,city,latitude,longitude,radius_km,contact_name,contact_email,contact_phone,required_specialty,project_type,start_date,duration,team_size,required_documents,description,budget_range,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'published')`,
    ).bind(
      requestId,
      companyProfile?.id || null,
      clean(b.companyType, 120),
      country,
      city,
      latitude,
      longitude,
      radiusKm,
      clean(b.name, 120),
      email,
      clean(b.phone, 80),
      requiredSpecialty,
      clean(b.projectType, 120),
      clean(b.startDate, 40),
      clean(b.duration, 80),
      clean(b.teamSize, 80),
      JSON.stringify(Array.isArray(b.requiredDocuments) ? b.requiredDocuments.slice(0, 20).map(String) : []),
      description,
      clean(b.budgetRange, 80),
    ),
    env.DB.prepare(
      `INSERT INTO growth_tasks (id,type,country,city,category_id,priority,status,prompt)
       VALUES (?,?,?,?,?,1,'open',?)`,
    ).bind(
      newId("gt_"),
      "captar_subcontratas",
      country,
      city,
      requiredSpecialty,
      `Buscar subcontratas de ${requiredSpecialty} en ${city}, ${country}. Hay una necesidad B2B real y conviene contactar empresas fundadoras con documentación verificable.`,
    ),
  ]);

  const candidates = await env.DB.prepare(
    "SELECT profile.id, profile.latitude, profile.longitude"
    + " FROM profiles profile JOIN subscriptions subscription ON subscription.user_id = profile.user_id"
    + " AND subscription.status IN ('founder_trial_0_eur','trialing','active')"
    + " WHERE profile.role = 'subcontractor' AND profile.country = ? AND profile.status != 'suspended' LIMIT 100",
  ).bind(country).all();
  const matches = (candidates.results || []).map((profile: any) => {
    if (latitude === null || longitude === null) return { ...profile, score: 30, distance: null };
    const candidateLatitude = Number(profile.latitude);
    const candidateLongitude = Number(profile.longitude);
    if (!Number.isFinite(candidateLatitude) || !Number.isFinite(candidateLongitude)) return null;
    const distance = distanceKm(
      { latitude, longitude },
      { latitude: candidateLatitude, longitude: candidateLongitude },
    );
    return distance <= radiusKm ? { ...profile, distance, score: Math.max(10, 60 - distance / 5) } : null;
  }).filter(Boolean).sort((a: any, b: any) => b.score - a.score).slice(0, 20);
  if (matches.length) {
    await env.DB.batch(matches.map((match: any) => env.DB.prepare(
      "INSERT OR IGNORE INTO b2b_match_candidates (id,b2b_project_id,profile_id,country,city,specialty,score,reasons,status) VALUES (?,?,?,?,?,?,?,?,?)",
    ).bind(
      newId("b2bm_"), requestId, match.id, country, city, requiredSpecialty, Math.round(match.score * 10) / 10,
      JSON.stringify(match.distance == null ? ["country"] : ["country", "radius"]), "candidate",
    )));
  }

  return json({ ok: true, requestId, matchedSubcontractors: matches.length }, 201);
}
