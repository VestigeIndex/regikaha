// Pages Function de salud: comprueba que la API y el binding D1 funcionan.
// GET /api/health
export async function onRequestGet(context: any) {
  const { env } = context;
  try {
    const tables = await env.DB.prepare(
      "SELECT count(*) AS n FROM sqlite_master WHERE type='table'",
    ).first();
    const pros = await env.DB.prepare("SELECT count(*) AS n FROM professionals").first();
    return Response.json({
      ok: true,
      service: "regikaha-api",
      tables: tables?.n ?? 0,
      professionals: pros?.n ?? 0,
      r2: typeof env.DOCS !== "undefined",
      ts: new Date().toISOString(),
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
