import { privateJson, bad, getSessionUser } from "../../../apilib/http";
import { getSubscriptionAccess } from "../../../apilib/professional";
import { planTier, limitsForPlan } from "../../../lib/regiworks/storage/limits";
import { stripWorkspaceForCloud, workspaceCounts } from "../../../lib/regiworks/storage/compression";
import { logError } from "../../../lib/observability";

// POST /api/regiworks/import — importa un workspace JSON validado a la nube.
export async function onRequestPost(context: any) {
  const { env, request } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  const workspace = body?.data ?? body;
  if (!workspace || typeof workspace !== "object" || Array.isArray(workspace)) return bad("Workspace no válido");
  if (Number(workspace.version) !== 1) return bad("Formato de workspace no compatible");

  const { subscription } = await getSubscriptionAccess(env, user.id);
  const limits = limitsForPlan(planTier(subscription));
  const stripped = stripWorkspaceForCloud(workspace);
  if (stripped.bytes > limits.maxWorkspaceBytes) return bad("El archivo supera el almacenamiento de tu plan.", 413);
  const counts = workspaceCounts(stripped.data);
  if (counts.clients > limits.maxClients || counts.projects > limits.maxProjects || counts.quotes > limits.maxQuotes) {
    return bad("El archivo supera el límite de registros de tu plan.", 409);
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
    logError("regiworks.import", error, { userId: user.id });
    return bad("No se pudo importar el workspace", 500);
  }
  return privateJson({ ok: true, imported: counts });
}
