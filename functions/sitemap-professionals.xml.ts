// Sitemap dinámico de fichas públicas de profesionales reales (leído de D1).
// El sitemap estático de Next (/sitemap.xml) cubre páginas y SEO local; este
// añade las fichas /profesionales/[slug] que viven en la base de datos.

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const origin = new URL(request.url).origin;
  let rows: any = { results: [] };
  try {
    rows = await env.DB.prepare(
      "SELECT slug, created_at FROM professionals WHERE active_status = 1 AND slug IS NOT NULL AND slug != '' ORDER BY created_at DESC LIMIT 45000",
    ).all();
  } catch {
    rows = { results: [] };
  }
  const today = new Date().toISOString().slice(0, 10);
  const urls = (rows.results || [])
    .map((row: any) => {
      const lastmod = String(row.created_at || "").slice(0, 10) || today;
      return `<url><loc>${esc(`${origin}/profesionales/${row.slug}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
