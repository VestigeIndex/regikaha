import { privateJson, clearSessionCookies, getSessionTokens, getSessionUser } from "../../apilib/http";
import { logAudit } from "../../apilib/audit";

// POST /api/logout
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request).catch(() => null);
  const tokens = getSessionTokens(request);
  if (tokens.length) {
    await env.DB.batch(tokens.map((token) => env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(token)));
  }
  await logAudit(env, { userId: user?.id || null, action: "logout", request });
  const headers = new Headers();
  for (const cookie of clearSessionCookies(request)) headers.append("Set-Cookie", cookie);
  return privateJson({ ok: true }, 200, headers);
}
