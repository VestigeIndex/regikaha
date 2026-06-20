import { bad, isEmail, privateJson, sessionCookieHeaders } from "../../../apilib/http";
import { createSession, newId } from "../../../apilib/auth";

interface GoogleTokenInfo {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
  error?: string;
}

function isVerified(value: unknown): boolean {
  return value === true || value === "true";
}

// POST /api/auth/google — inicia sesión o crea cuenta profesional base con Google.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return bad("JSON inválido");
  }

  const credential = String(body.credential || "").trim();
  const clientId = String(env.GOOGLE_CLIENT_ID || "").trim();
  if (!clientId) return bad("Google Connect no está configurado", 500);
  if (!credential) return bad("Falta el token de Google");

  const tokenRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );
  const info = (await tokenRes.json().catch(() => ({}))) as GoogleTokenInfo;
  if (!tokenRes.ok || info.error) return bad("Google no pudo validar la sesión", 401);
  if (info.aud !== clientId) return bad("Token de Google para otro cliente", 401);
  if (!info.sub) return bad("Token de Google sin identificador", 401);
  const email = String(info.email || "").trim().toLowerCase();
  if (!isEmail(email) || !isVerified(info.email_verified)) {
    return bad("Google no confirmó el email", 401);
  }

  const linked = await env.DB.prepare(
    `SELECT u.* FROM oauth_accounts oa
     JOIN users u ON u.id = oa.user_id
     WHERE oa.provider = 'google' AND oa.provider_user_id = ?`,
  )
    .bind(info.sub)
    .first();

  let user = linked;
  let created = false;
  if (!user) {
    user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (!user) {
      const userId = newId("usr_");
      await env.DB.prepare(
        "INSERT INTO users (id,email,password_hash,email_verified,role) VALUES (?,?,?,1,'professional')",
      )
        .bind(userId, email, "oauth:google")
        .run();
      user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
      created = true;
    } else if (!Number(user.email_verified || 0)) {
      await env.DB.prepare("UPDATE users SET email_verified = 1, verify_token = NULL WHERE id = ?")
        .bind(user.id)
        .run();
      user.email_verified = 1;
    }

    await env.DB.prepare(
      "INSERT OR IGNORE INTO oauth_accounts (provider,provider_user_id,user_id,email) VALUES ('google',?,?,?)",
    )
      .bind(info.sub, user.id, email)
      .run();
  }

  const professional = await env.DB.prepare("SELECT id,slug,public_name FROM professionals WHERE user_id = ?")
    .bind(user.id)
    .first();
  const { token, maxAge } = await createSession(env, user.id);
  return privateJson(
    {
      ok: true,
      created,
      user: { id: user.id, email: user.email, role: user.role },
      professional: professional || null,
    },
    200,
    sessionCookieHeaders(token, maxAge, request),
  );
}
