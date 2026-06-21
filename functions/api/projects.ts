import { json, bad, getSessionUser, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { isActiveCountryCode } from "../../lib/market";
import { getLeadPrice, leadQualityScore } from "../../lib/leads";
import { isLocale } from "../../lib/i18n/config";
import {
  configuredLimit,
  enforcePlanLimits,
  enforceUploadLimits,
  requireTurnstile,
} from "../../packages/cost-guards";
import { uploadOptimizedImageToR2 } from "../../packages/image-optimizer";

async function parseInput(request: Request) {
  if (!String(request.headers.get("Content-Type") || "").includes("multipart/form-data")) {
    return { body: await request.json(), photos: [] as File[], thumbnails: [] as File[], dimensions: [] as any[] };
  }
  const form = await request.formData();
  let dimensions: any[] = [];
  try { dimensions = JSON.parse(String(form.get("imageDimensions") || "[]")); } catch { dimensions = []; }
  return {
    body: Object.fromEntries([...form.entries()].filter(([key, value]) => !(value instanceof File) && key !== "imageDimensions")),
    photos: form.getAll("photos").filter((value): value is File => value instanceof File),
    thumbnails: form.getAll("thumbnails").filter((value): value is File => value instanceof File),
    dimensions: Array.isArray(dimensions) ? dimensions : [],
  };
}

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
  let photos: File[] = [];
  let thumbnails: File[] = [];
  let dimensions: any[] = [];
  try {
    const parsed = await parseInput(request);
    b = parsed.body;
    photos = parsed.photos;
    thumbnails = parsed.thumbnails;
    dimensions = parsed.dimensions;
  } catch { return bad("Solicitud no válida"); }

  const email = clean(b.email, 160).toLowerCase();
  const description = clean(b.description, 2000);
  const country = clean(b.country, 4).toUpperCase();
  const city = clean(b.city, 120);
  const categoryId = clean(b.categoryId || b.category, 120);
  const latitude = coordinate(b.latitude ?? b.placeLatitude, -90, 90);
  const longitude = coordinate(b.longitude ?? b.placeLongitude, -180, 180);
  const radiusKm = Math.max(10, Math.min(250, Number(b.radiusKm || 25) || 25));
  const locale = isLocale(String(b.locale || "")) ? String(b.locale) : "es";
  if (clean(b.website, 200)) return bad("Solicitud no válida");
  const challenge = await requireTurnstile(env, request, b.turnstileToken, "publish_project");
  if (challenge) return challenge;
  if (!isEmail(email)) return bad("Email no válido");
  if (description.length < 20) return bad("Describe un poco más el proyecto");
  if (!country || !city || !categoryId) return bad("Faltan país, ciudad o categoría");
  if (!isActiveCountryCode(country)) return bad("País no disponible todavía en Regi Kaha");
  if (String(b.acceptsPreEstimate) !== "true" && b.acceptsPreEstimate !== true) {
    return bad("Debes aceptar recibir pre-presupuestos no vinculantes");
  }
  const photoLimit = enforcePlanLimits(env, "free").projectPhotos;
  if (photos.length > photoLimit || thumbnails.length !== photos.length) {
    return bad(`Puedes adjuntar hasta ${photoLimit} fotos optimizadas`);
  }
  if (photos.length && !env.MEDIA) return bad("El almacenamiento de fotos todavía no está activo", 503);
  for (const file of photos) {
    const uploadError = enforceUploadLimits(env, { file, plan: "free" });
    if (uploadError) return uploadError;
  }
  for (const file of thumbnails) {
    const uploadError = enforceUploadLimits(env, { file, plan: "free", thumbnail: true });
    if (uploadError) return uploadError;
  }

  const projectId = newId("prj_");
  const sessionUser = await getSessionUser(env, request);
  if (sessionUser?.role === "client") {
    const monthly = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM project_requests WHERE client_id = ? AND created_at >= date('now','start of month')",
    ).bind(sessionUser.id).first();
    if (Number(monthly?.total || 0) >= configuredLimit(env, "MAX_FREE_PROJECTS_PER_CLIENT_MONTH")) {
      return bad("Has alcanzado el límite mensual de solicitudes gratuitas", 429);
    }
  }
  const pricing = getLeadPrice({
    countryCode: country,
    categoryId,
    budgetRange: clean(b.budgetRange, 80),
    urgency: clean(b.urgency || "flexible", 40),
    clientType: clean(b.clientType || "particular", 80),
  });
  const qualityScore = leadQualityScore({
    description,
    hasPhone: Boolean(clean(b.phone, 80)),
    hasCoordinates: latitude !== null && longitude !== null,
    hasBudget: Boolean(clean(b.budgetRange, 80)),
    hasPostalCode: Boolean(clean(b.postalCode, 20)),
  });
  const uploadedKeys: string[] = [];
  const mediaFiles: any[] = [];
  try {
    for (let index = 0; index < photos.length; index += 1) {
      const key = `media/projects/${projectId}/${index + 1}.webp`;
      const thumbnailKey = `media/projects/${projectId}/${index + 1}-thumb.webp`;
      const metadata = { projectId, kind: "project", optimized: "true" };
      await uploadOptimizedImageToR2(env.MEDIA, photos[index], key, metadata);
      uploadedKeys.push(key);
      await uploadOptimizedImageToR2(env.MEDIA, thumbnails[index], thumbnailKey, { ...metadata, thumbnail: "true" });
      uploadedKeys.push(thumbnailKey);
      mediaFiles.push({
        key,
        url: `/api/media/${key}`,
        thumbnailKey,
        thumbnailUrl: `/api/media/${thumbnailKey}`,
        size: photos[index].size,
        width: Math.max(1, Math.min(1600, Number(dimensions[index]?.width || 1))),
        height: Math.max(1, Math.min(10000, Number(dimensions[index]?.height || 1))),
        mimeType: photos[index].type,
      });
    }
    await env.DB.prepare(
      `INSERT INTO project_requests
        (id,client_id,client_type,country,region,city,postal_code,latitude,longitude,radius_km,category_id,subcategory,title,
         description,urgency,budget_range,property_type,approximate_measures,files,status,locale,expires_at,max_professionals,
         unlocked_count,quality_score,source,contact_name,contact_email,contact_phone)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'published',?,datetime('now','+30 days'),?,0,?,'web',?,?,?)`,
    ).bind(
      projectId,
      sessionUser?.id || null,
      clean(b.clientType || "particular", 80),
      country,
      clean(b.region, 120),
      city,
      clean(b.postalCode, 20),
      latitude,
      longitude,
      radiusKm,
      categoryId,
      clean(b.subcategory, 120),
      clean(b.title || b.subcategory || categoryId, 160),
      description,
      clean(b.urgency || "flexible", 40),
      clean(b.budgetRange, 80),
      clean(b.propertyType, 80),
      clean(b.approximateMeasures, 120),
      JSON.stringify(mediaFiles),
      locale,
      pricing.maxProfessionals,
      qualityScore,
      clean(b.name || "Cliente", 120),
      email,
      clean(b.phone, 80),
    ).run();
  } catch (error) {
    if (env.MEDIA && uploadedKeys.length) await Promise.all(uploadedKeys.map((key) => env.MEDIA.delete(key)));
    throw error;
  }

  const matches = await matchProfessionals(env, { categoryId, country, city, latitude, longitude, radiusKm });
  if (matches.length) {
    await env.DB.batch(matches.map((match: any) => env.DB.prepare(
      "INSERT OR IGNORE INTO match_candidates (id,project_id,professional_id,country,city,category_id,score,reasons,status) VALUES (?,?,?,?,?,?,?,?,?)",
    ).bind(
      newId("match_"), projectId, match.id, country, city, categoryId, match.score,
      JSON.stringify(match.distance == null ? ["category", "country"] : ["category", "country", "radius"]),
      "candidate",
    )));
  }

  await upsertCoverage(env, country, city, categoryId);

  return json({
    ok: true,
    projectId,
    matchedProfessionals: matches.length,
    maxProfessionals: pricing.maxProfessionals,
  }, 201);
}
