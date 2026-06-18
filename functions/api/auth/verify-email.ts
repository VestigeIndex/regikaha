import { bad, json } from "../../../apilib/http";
import { hashContractSnapshot } from "../../../lib/legal/hashContract";

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const token = new URL(request.url).searchParams.get("token") || "";
  if (token.length < 32) return bad("Enlace de verificación no válido", 400);
  const tokenHash = await hashContractSnapshot({ token });
  const user = await env.DB.prepare(
    "SELECT id FROM users WHERE verify_token = ? AND email_verified = 0",
  ).bind(tokenHash).first();
  if (!user) return bad("El enlace ha caducado o ya se ha utilizado", 400);

  await env.DB.batch([
    env.DB.prepare("UPDATE users SET email_verified = 1, verify_token = NULL WHERE id = ?").bind(user.id),
    env.DB.prepare("UPDATE profiles SET email_verified = 1, updated_at = datetime('now') WHERE user_id = ?").bind(user.id),
  ]);
  return json({ ok: true, redirectTo: "/suscripcion" });
}
