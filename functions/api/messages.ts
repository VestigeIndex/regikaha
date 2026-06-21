import { bad, privateJson, requireUser } from "../../apilib/http";
import { newId } from "../../apilib/auth";

async function participant(env: any, conversationId: string, userId: string) {
  return env.DB.prepare(
    "SELECT conversation_id FROM conversation_participants WHERE conversation_id = ? AND user_id = ? AND blocked_at IS NULL",
  ).bind(conversationId, userId).first();
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  const conversationId = new URL(request.url).searchParams.get("conversationId") || "";
  if (!await participant(env, conversationId, user.id)) return bad("Conversación no disponible", 404);
  const rows = await env.DB.prepare(
    "SELECT id, sender_user_id, body, status, created_at, edited_at FROM messages WHERE conversation_id = ? AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 200",
  ).bind(conversationId).all();
  await env.DB.prepare(
    "UPDATE conversation_participants SET last_read_at = datetime('now') WHERE conversation_id = ? AND user_id = ?",
  ).bind(conversationId, user.id).run();
  return privateJson({ messages: rows.results || [], currentUserId: user.id });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const conversationId = String(body.conversationId || "").trim();
  const message = String(body.message || "").trim().slice(0, 4000);
  if (!message) return bad("Escribe un mensaje");
  if (!await participant(env, conversationId, user.id)) return bad("Conversación no disponible", 404);
  const messageId = newId("msg_");
  await env.DB.batch([
    env.DB.prepare("INSERT INTO messages (id,conversation_id,sender_user_id,body) VALUES (?,?,?,?)").bind(messageId, conversationId, user.id, message),
    env.DB.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").bind(conversationId),
    env.DB.prepare("UPDATE conversation_participants SET last_read_at = datetime('now') WHERE conversation_id = ? AND user_id = ?").bind(conversationId, user.id),
  ]);
  return privateJson({ ok: true, messageId }, 201);
}
