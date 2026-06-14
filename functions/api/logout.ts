import { json, getCookie, clearSessionCookie, SESSION_COOKIE } from "../../apilib/http";

// POST /api/logout
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const token = getCookie(request, SESSION_COOKIE);
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(token).run();
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
