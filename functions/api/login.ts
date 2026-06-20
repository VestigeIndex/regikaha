import { privateJson, bad, isEmail, sessionCookieHeaders } from "../../apilib/http";
import { verifyPassword, createSession } from "../../apilib/auth";
import { panelPathForRole } from "../../lib/accounts";

// POST /api/login
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (!isEmail(email) || !password) return bad("Credenciales incompletas");

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return bad("Email o contraseña incorrectos", 401);
  }
  const requestedRole = String(b.role || "");
  if (requestedRole === "admin" && user.role !== "admin") return bad("No autorizado", 403);
  const { token, maxAge } = await createSession(env, user.id);
  return privateJson(
    { ok: true, user: { id: user.id, email: user.email, role: user.role }, redirectTo: panelPathForRole(user.role) },
    200,
    sessionCookieHeaders(token, maxAge, request),
  );
}
