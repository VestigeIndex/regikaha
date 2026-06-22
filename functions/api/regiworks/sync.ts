import { privateJson, bad, getSessionUser } from "../../../apilib/http";
import { getSubscriptionAccess } from "../../../apilib/professional";
import { planTier, limitsForPlan } from "../../../lib/regiworks/storage/limits";
import { stripWorkspaceForCloud, workspaceCounts } from "../../../lib/regiworks/storage/compression";
import { rateLimitByUser } from "../../../packages/cost-guards";
import { logError } from "../../../lib/observability";

// POST /api/regiworks/sync — guarda el workspace en la nube (last-write-wins).
// Valida sesión, tamaño, plan y límites. Nunca acepta imágenes base64 en D1.
export async function onRequestPost(context: any) {
  const { env, request } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  const limited = await rateLimitByUser(env, user.id, "regiworks:sync");
  if (limited) return limited;

  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const workspace = body?.data;
  if (!workspace || typeof workspace !== "object" || Array.isArray(workspace)) return bad("Workspace no válido");

  const { subscription } = await getSubscriptionAccess(env, user.id);
  const plan = planTier(subscription);
  const limits = limitsForPlan(plan);

  const stripped = stripWorkspaceForCloud(workspace);
  if (stripped.bytes > limits.maxWorkspaceBytes) {
    return bad(`Has superado el almacenamiento de tu plan (${Math.round(limits.maxWorkspaceBytes / 1000)} KB). Mejora a Pro o Business para sincronizar más.`, 413);
  }
  const counts = workspaceCounts(stripped.data);
  if (counts.clients > limits.maxClients || counts.projects > limits.maxProjects || counts.quotes > limits.maxQuotes) {
    return bad("Has superado el límite de registros de tu plan. Mejora tu plan para sincronizar más.", 409);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO regiworks_workspaces (user_id, data, revision, size_bytes, updated_at)
       VALUES (?, ?, 1, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET
         data = excluded.data,
         revision = regiworks_workspaces.revision + 1,
         size_bytes = excluded.size_bytes,
         updated_at = datetime('now')`,
    ).bind(user.id, JSON.stringify(stripped.data), stripped.bytes).run();
  } catch (error) {
    logError("regiworks.sync", error, { userId: user.id });
    return bad("No se pudo guardar en la nube", 500);
  }

  const row = await env.DB.prepare("SELECT revision, updated_at FROM regiworks_workspaces WHERE user_id = ?").bind(user.id).first();
  return privateJson({
    ok: true,
    revision: Number(row?.revision || 1),
    updatedAt: row?.updated_at || null,
    plan,
    usage: { ...counts, bytes: stripped.bytes },
    limits,
    strippedImages: stripped.strippedImages,
  });
}
