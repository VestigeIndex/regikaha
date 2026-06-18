import { bad, json } from "../../../apilib/http";
import { isActiveCountryCode } from "../../../lib/market";
import { searchPlacesD1 } from "../../../lib/geo/adapters";
import { searchPlaces } from "../../../lib/geo/search";

function clampLimit(value: string | null): number {
  const parsed = Number(value || 8);
  if (!Number.isFinite(parsed)) return 8;
  return Math.max(1, Math.min(20, Math.round(parsed)));
}

// GET /api/geo/search?q=&country=&limit=
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const country = (url.searchParams.get("country") || "").trim().toUpperCase();
  const limit = clampLimit(url.searchParams.get("limit"));

  if (q.length < 2) return json({ total: 0, results: [] });
  if (country && !isActiveCountryCode(country)) return bad("País no disponible en RegiKaha", 400);

  try {
    if (env.DB) {
      const results = await searchPlacesD1(env, { q, country: country || undefined, limit });
      if (results.length) return json({ total: results.length, results });
    }
  } catch {
    // Si D1 aún no tiene geodata importada, el seed mantiene el alta y la búsqueda operativas.
  }

  const results = searchPlaces({ q, country: country || undefined, limit });
  return json({ total: results.length, results });
}
