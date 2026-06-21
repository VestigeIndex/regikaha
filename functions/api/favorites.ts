import { bad, privateJson, requireUser } from "../../apilib/http";
import { newId } from "../../apilib/auth";

const targetTypes = new Set(["professional", "project", "b2b_project"]);

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  const rows = await env.DB.prepare(
    `SELECT f.id, f.target_type, f.target_id, f.created_at,
      CASE WHEN f.target_type = 'professional' THEN p.public_name ELSE NULL END AS title,
      CASE WHEN f.target_type = 'professional' THEN p.slug ELSE NULL END AS slug,
      CASE WHEN f.target_type = 'professional' THEN p.city ELSE NULL END AS city
     FROM favorites f
     LEFT JOIN professionals p ON f.target_type = 'professional' AND p.id = f.target_id
     WHERE f.user_id = ? ORDER BY f.created_at DESC LIMIT 100`,
  ).bind(user.id).all();
  return privateJson({ favorites: rows.results || [] });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const targetType = String(body.targetType || "").trim();
  const targetId = String(body.targetId || "").trim();
  if (!targetTypes.has(targetType) || !/^[a-zA-Z0-9_-]{3,100}$/.test(targetId)) return bad("Favorito inválido");
  await env.DB.prepare(
    "INSERT OR IGNORE INTO favorites (id,user_id,target_type,target_id) VALUES (?,?,?,?)",
  ).bind(newId("fav_"), user.id, targetType, targetId).run();
  return privateJson({ ok: true }, 201);
}

export async function onRequestDelete(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^fav_[a-zA-Z0-9-]{8,100}$/.test(id)) return bad("Favorito inválido");
  await env.DB.prepare("DELETE FROM favorites WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  return privateJson({ ok: true });
}
