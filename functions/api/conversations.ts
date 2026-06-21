import { bad, privateJson, requireUser } from "../../apilib/http";
import { newId } from "../../apilib/auth";

const contextTypes = new Set(["project", "quote", "b2b_project", "support"]);

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  const rows = await env.DB.prepare(
    `SELECT c.id, c.context_type, c.context_id, c.status, c.updated_at,
      (SELECT m.body FROM messages m WHERE m.conversation_id = c.id AND m.deleted_at IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message,
      (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_user_id != ? AND (cp.last_read_at IS NULL OR m.created_at > cp.last_read_at)) AS unread_count
     FROM conversation_participants cp JOIN conversations c ON c.id = cp.conversation_id
     WHERE cp.user_id = ? AND cp.blocked_at IS NULL ORDER BY c.updated_at DESC LIMIT 100`,
  ).bind(user.id, user.id).all();
  return privateJson({ conversations: rows.results || [] });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const recipientUserId = String(body.recipientUserId || "").trim();
  const contextType = String(body.contextType || "project").trim();
  const contextId = String(body.contextId || "").trim().slice(0, 100) || null;
  if (!contextTypes.has(contextType) || !recipientUserId || recipientUserId === user.id) return bad("Conversación inválida");
  const recipient = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(recipientUserId).first();
  if (!recipient) return bad("Destinatario no disponible", 404);

  const existing = await env.DB.prepare(
    `SELECT c.id FROM conversations c
     JOIN conversation_participants a ON a.conversation_id = c.id AND a.user_id = ?
     JOIN conversation_participants b ON b.conversation_id = c.id AND b.user_id = ?
     WHERE c.context_type = ? AND COALESCE(c.context_id, '') = COALESCE(?, '') LIMIT 1`,
  ).bind(user.id, recipientUserId, contextType, contextId).first();
  if (existing) return privateJson({ ok: true, conversationId: existing.id });

  const conversationId = newId("cnv_");
  await env.DB.batch([
    env.DB.prepare("INSERT INTO conversations (id,context_type,context_id,created_by) VALUES (?,?,?,?)").bind(conversationId, contextType, contextId, user.id),
    env.DB.prepare("INSERT INTO conversation_participants (conversation_id,user_id) VALUES (?,?)").bind(conversationId, user.id),
    env.DB.prepare("INSERT INTO conversation_participants (conversation_id,user_id) VALUES (?,?)").bind(conversationId, recipientUserId),
  ]);
  return privateJson({ ok: true, conversationId }, 201);
}
