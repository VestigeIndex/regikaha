import { privateJson, bad, getSessionUser } from "../../../apilib/http";
import { getSubscriptionAccess } from "../../../apilib/professional";
import { planTier, limitsForPlan } from "../../../lib/regiworks/storage/limits";

// GET /api/regiworks/usage — cuotas usadas del plan.
export async function onRequestGet(context: any) {
  const { env, request } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);
  const { subscription } = await getSubscriptionAccess(env, user.id);
  const plan = planTier(subscription);
  const limits = limitsForPlan(plan);
  let workspaceBytes = 0;
  let images = 0;
  let imageBytes = 0;
  try {
    const ws = await env.DB.prepare("SELECT size_bytes FROM regiworks_workspaces WHERE user_id = ?").bind(user.id).first();
    workspaceBytes = Number(ws?.size_bytes || 0);
    const media = await env.DB.prepare("SELECT COUNT(*) AS total, COALESCE(SUM(size_bytes),0) AS bytes FROM regiworks_media WHERE user_id = ?").bind(user.id).first();
    images = Number(media?.total || 0);
    imageBytes = Number(media?.bytes || 0);
  } catch {
    // tablas aún no migradas: cuotas a cero
  }
  return privateJson({ ok: true, plan, limits, usage: { workspaceBytes, images, imageBytes } });
}
