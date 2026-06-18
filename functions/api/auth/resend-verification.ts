import { bad, getSessionUser, json } from "../../../apilib/http";
import { hashContractSnapshot } from "../../../lib/legal/hashContract";
import { sendEmail, verificationEmailMessage } from "../../../lib/notifications/email";

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  if (Number(user.email_verified || 0)) return json({ ok: true, alreadyVerified: true });

  const rawToken = `${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g, "")}`;
  const tokenHash = await hashContractSnapshot({ token: rawToken });
  await env.DB.prepare("UPDATE users SET verify_token = ? WHERE id = ?").bind(tokenHash, user.id).run();
  const origin = String(env.NEXT_PUBLIC_SITE_URL || request.headers.get("Origin") || new URL(request.url).origin).replace(/\/$/, "");
  const verifyUrl = `${origin}/verificar-email?token=${encodeURIComponent(rawToken)}`;
  const result = await sendEmail(env, verificationEmailMessage({ email: user.email, verifyUrl }));
  return json({ ok: true, provider: result.provider });
}
