import { bad, getSessionUser, json } from "../../../apilib/http";
import { hashContractSnapshot } from "../../../lib/legal/hashContract";
import { sendEmail, verificationEmailMessage } from "../../../lib/notifications/email";
import { configuredLimit, consumePersistentQuota } from "../../../packages/cost-guards";

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  if (Number(user.email_verified || 0)) return json({ ok: true, alreadyVerified: true });
  const userQuota = await consumePersistentQuota(env, `verification-email:user:${user.id}`, configuredLimit(env, "MAX_EMAILS_PER_USER_DAY"), "day");
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const ipQuota = await consumePersistentQuota(env, `verification-email:ip:${ip}`, configuredLimit(env, "MAX_EMAILS_PER_IP_DAY"), "day");
  if (!userQuota.allowed || !ipQuota.allowed) return bad("Has alcanzado el límite diario de envíos", 429);

  const rawToken = `${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g, "")}`;
  const tokenHash = await hashContractSnapshot({ token: rawToken });
  await env.DB.prepare("UPDATE users SET verify_token = ? WHERE id = ?").bind(tokenHash, user.id).run();
  const origin = String(env.NEXT_PUBLIC_SITE_URL || request.headers.get("Origin") || new URL(request.url).origin).replace(/\/$/, "");
  const verifyUrl = `${origin}/verificar-email?token=${encodeURIComponent(rawToken)}`;
  const result = await sendEmail(env, verificationEmailMessage({ email: user.email, verifyUrl }));
  if (!result.ok) return bad("No se pudo enviar el email de verificación", 502);
  return json({ ok: true, provider: result.provider });
}
