import { privateJson, clearSessionCookies, getSessionTokens } from "../../apilib/http";

// POST /api/logout
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const tokens = getSessionTokens(request);
  if (tokens.length) {
    await env.DB.batch(tokens.map((token) => env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(token)));
  }
  const headers = new Headers();
  for (const cookie of clearSessionCookies(request)) headers.append("Set-Cookie", cookie);
  return privateJson({ ok: true }, 200, headers);
}
