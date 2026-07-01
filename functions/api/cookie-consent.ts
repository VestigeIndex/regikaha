import { bad, getSessionUser, privateJson } from "../../apilib/http";

const allowedLocales = new Set(["es", "fr", "it", "pt", "de", "nl", "en"]);

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }

  const consentId = String(body.id || "").trim();
  const policyVersion = String(body.policyVersion || "").trim();
  const locale = String(body.locale || "es").trim();
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(consentId) || !/^\d{4}-\d{2}-\d{2}$/.test(policyVersion) || !allowedLocales.has(locale)) {
    return bad("Preferencias inválidas");
  }

  let user: any = null;
  try {
    user = await getSessionUser(env, request);
  } catch {
    user = null;
  }
  try {
    await env.DB.prepare(
      `INSERT INTO cookie_consents
        (id, consent_id, user_id, necessary, analytics, maps, marketing, locale, policy_version, decided_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(consent_id) DO UPDATE SET
        user_id = COALESCE(excluded.user_id, cookie_consents.user_id),
        analytics = excluded.analytics,
        maps = excluded.maps,
        marketing = excluded.marketing,
        locale = excluded.locale,
        policy_version = excluded.policy_version,
        decided_at = datetime('now'),
        updated_at = datetime('now')`,
    ).bind(
      crypto.randomUUID(), consentId, user?.id || null,
      body.analytics === true ? 1 : 0,
      body.maps === true ? 1 : 0,
      body.marketing === true ? 1 : 0,
      locale, policyVersion,
    ).run();
  } catch {
    return privateJson({ ok: true, stored: false });
  }

  return privateJson({ ok: true });
}
