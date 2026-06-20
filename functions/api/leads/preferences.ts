import { bad, privateJson } from "../../../apilib/http";
import { getCurrentProfessional, safeJsonArray } from "../../../apilib/professional";
import { isActiveCountryCode } from "../../../lib/market";

function stringList(value: unknown, max: number): string[] {
  return (Array.isArray(value) ? value : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function mapPreferences(row: any, professional: any) {
  return {
    countries: row ? safeJsonArray(row.countries) : [professional.country].filter(Boolean),
    regions: row ? safeJsonArray(row.regions) : [professional.region].filter(Boolean),
    cities: row ? safeJsonArray(row.cities) : [professional.city].filter(Boolean),
    categories: row ? safeJsonArray(row.categories) : [],
    maxDistanceKm: Number(row?.max_distance_km || professional.service_radius_km || 50),
    minBudget: Number(row?.min_budget || 0),
    weeklyBudget: Number(row?.weekly_budget || 0),
    autoUnlockEnabled: Boolean(row?.auto_unlock_enabled),
    instantNotifications: row ? Boolean(row.instant_notifications) : true,
    languages: row ? safeJsonArray(row.languages) : safeJsonArray(professional.languages),
    excludedCategories: row ? safeJsonArray(row.excluded_categories) : [],
  };
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const row = await context.env.DB.prepare(
    "SELECT * FROM professional_lead_preferences WHERE professional_id = ?",
  ).bind(current.professional.id).first();
  return privateJson({ preferences: mapPreferences(row, current.professional) });
}

export async function onRequestPut(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  let body: any;
  try { body = await context.request.json(); } catch { return bad("invalid_json"); }

  const countries = stringList(body.countries, 10).map((value) => value.toUpperCase());
  if (!countries.length || countries.some((code) => !isActiveCountryCode(code))) return bad("invalid_countries");
  const maxDistanceKm = Math.max(5, Math.min(500, Number(body.maxDistanceKm || 50)));
  const minBudget = Math.max(0, Math.round(Number(body.minBudget || 0)));
  const weeklyBudget = Math.max(0, Math.round(Number(body.weeklyBudget || 0)));

  await context.env.DB.prepare(
    `INSERT INTO professional_lead_preferences
      (professional_id,countries,regions,cities,categories,max_distance_km,min_budget,weekly_budget,
       auto_unlock_enabled,instant_notifications,languages,excluded_categories,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
     ON CONFLICT(professional_id) DO UPDATE SET
       countries=excluded.countries,regions=excluded.regions,cities=excluded.cities,categories=excluded.categories,
       max_distance_km=excluded.max_distance_km,min_budget=excluded.min_budget,weekly_budget=excluded.weekly_budget,
       auto_unlock_enabled=excluded.auto_unlock_enabled,instant_notifications=excluded.instant_notifications,
       languages=excluded.languages,excluded_categories=excluded.excluded_categories,updated_at=datetime('now')`,
  ).bind(
    current.professional.id,
    JSON.stringify(countries),
    JSON.stringify(stringList(body.regions, 80)),
    JSON.stringify(stringList(body.cities, 120)),
    JSON.stringify(stringList(body.categories, 80)),
    maxDistanceKm,
    minBudget,
    weeklyBudget,
    body.autoUnlockEnabled === true ? 1 : 0,
    body.instantNotifications === false ? 0 : 1,
    JSON.stringify(stringList(body.languages, 20)),
    JSON.stringify(stringList(body.excludedCategories, 80)),
  ).run();

  return privateJson({ ok: true });
}
