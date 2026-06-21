import { bad, privateJson, requireUser } from "../../apilib/http";
import { newId } from "../../apilib/auth";

const targetTypes = new Set(["professional", "review", "message", "project", "user"]);
const reasons = new Set(["fraud", "impersonation", "spam", "harassment", "unsafe", "privacy", "other"]);

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const targetType = String(body.targetType || "").trim();
  const targetId = String(body.targetId || "").trim().slice(0, 100);
  const reason = String(body.reason || "").trim();
  const details = String(body.details || "").trim().slice(0, 2000);
  if (!targetTypes.has(targetType) || !targetId || !reasons.has(reason)) return bad("Denuncia inválida");
  const id = newId("rpt_");
  await env.DB.prepare(
    "INSERT INTO reports (id,reporter_user_id,target_type,target_id,reason,details) VALUES (?,?,?,?,?,?)",
  ).bind(id, user.id, targetType, targetId, reason, details || null).run();
  return privateJson({ ok: true, reportId: id }, 201);
}
