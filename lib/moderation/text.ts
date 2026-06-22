// Moderación de texto multilingüe (ES/EN/FR/IT/PT/DE/NL). Puro, sin coste ni API.
// Bloquea contenido sexual explícito, insultos graves y odio en los textos que el
// usuario sube a zonas públicas (perfiles, proyectos, portfolio, reseñas...).
// Usa límites de palabra para minimizar falsos positivos.

// Lista deliberadamente acotada a términos claramente obscenos / ofensivos.
const BLOCKLIST: string[] = [
  // sexual explícito (multi-idioma)
  "porn", "porno", "pornografia", "pornografía", "xxx", "nude", "nudes", "desnudo", "desnuda", "desnudos",
  "sexo", "sexual explicito", "blowjob", "handjob", "masturba", "masturbacion", "masturbación",
  "anal", "creampie", "cumshot", "dildo", "vibrador", "escort", "prostitut", "prostituta", "prostituto",
  "puta", "putas", "puton", "putón", "zorra", "golfa", "coño", "polla", "pene", "verga", "pija", "concha",
  "tetas", "culo gordo", "follar", "follando", "cojer", "cogerte", "chupar polla", "mamada", "corrida",
  "fuck", "fucking", "motherfucker", "cunt", "pussy", "dick", "cock", "boobs", "tits", "whore", "slut",
  "bitch", "bastard", "wanker",
  "pute", "putain", "salope", "enculé", "encule", "bite", "chatte", "baiser", "nichon",
  "cazzo", "stronzo", "troia", "puttana", "vaffanculo", "figa", "minchia", "pompino",
  "caralho", "buceta", "puta que pariu", "foder", "piru", "cona", "punheta",
  "fick", "ficken", "fotze", "schwanz", "hure", "wichser", "arschloch", "nutte",
  "kut", "lul", "kanker", "hoer", "neuken", "slet", "pik",
  // odio / amenazas claras
  "nazi", "heil hitler", "negro de mierda", "maricon de mierda", "kill yourself", "kys", "matate",
];

// Caracteres con los que se intenta esquivar el filtro -> normalización.
const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };

function normalize(value: string): string {
  let text = String(value || "").toLowerCase();
  text = text.normalize("NFD").replace(/[̀-ͯ]/g, ""); // quita acentos
  text = text.replace(/[013457@$]/g, (c) => LEET[c] || c);
  text = text.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  return text;
}

export interface ModerationResult {
  ok: boolean;
  matched?: string;
}

/** Revisa un texto. Devuelve ok:false y el término detectado si hay contenido prohibido. */
export function screenText(value: unknown): ModerationResult {
  const text = normalize(String(value || ""));
  if (!text) return { ok: true };
  const padded = ` ${text} `;
  for (const term of BLOCKLIST) {
    const t = normalize(term);
    if (!t) continue;
    if (t.includes(" ")) {
      if (padded.includes(` ${t} `) || text.includes(t)) return { ok: false, matched: term };
    } else if (padded.includes(` ${t} `)) {
      return { ok: false, matched: term };
    }
  }
  return { ok: true };
}

/** Revisa varios campos a la vez. */
export function screenFields(...values: unknown[]): ModerationResult {
  for (const value of values) {
    const result = screenText(value);
    if (!result.ok) return result;
  }
  return { ok: true };
}
