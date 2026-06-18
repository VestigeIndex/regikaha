import { json } from "../../apilib/http";

const countryLocales: Record<string, string[]> = {
  ES: ["es"],
  FR: ["fr"],
  IT: ["it"],
  PT: ["pt"],
  DE: ["de"],
  NL: ["nl"],
  BE: ["nl", "fr", "de"],
  CH: ["de", "fr", "it"],
  IE: ["en"],
  GB: ["en"],
};

const supported = new Set(["es", "fr", "it", "pt", "de", "nl", "en"]);

function acceptedLanguages(request: Request): string[] {
  return String(request.headers.get("Accept-Language") || "")
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .filter((locale, index, list) => supported.has(locale) && list.indexOf(locale) === index);
}

// GET /api/locale — combina país de Cloudflare e idioma preferido del navegador.
export async function onRequestGet(context: any) {
  const { request } = context;
  const country = String(request.cf?.country || request.headers.get("CF-IPCountry") || "").toUpperCase();
  const preferred = acceptedLanguages(request);
  const allowed = countryLocales[country] || [];
  const locale = preferred.find((candidate) => allowed.includes(candidate))
    || allowed[0]
    || preferred[0]
    || "en";

  return json({ locale, country: country || null, source: allowed.length ? "country_and_language" : "language" }, 200, {
    "Cache-Control": "private, max-age=3600",
    Vary: "Accept-Language, CF-IPCountry",
  });
}
