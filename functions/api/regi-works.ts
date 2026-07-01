import { bad, getSessionUser, privateJson, requireRole } from "../../apilib/http";

const offeringRoles = ["professional", "company", "subcontractor", "admin", "superadmin"];
const MAX_SNAPSHOT_BYTES = 900_000;

function isSnapshot(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const data = value as { version?: unknown; clients?: unknown; projects?: unknown; quotes?: unknown };
  return data.version === 1 && Array.isArray(data.clients) && Array.isArray(data.projects) && Array.isArray(data.quotes);
}

export async function onRequestGet(context: any) {
  const user = await getSessionUser(context.env, context.request);
  if (!user) return privateJson({ ok: true, authenticated: false, canSync: false, data: null, updatedAt: null });
  if (!offeringRoles.includes(user.role)) {
    return privateJson({ ok: true, authenticated: true, canSync: false, data: null, updatedAt: null });
  }

  const row = await context.env.DB.prepare("SELECT data_json, updated_at FROM regi_works_snapshots WHERE user_id = ?")
    .bind(user.id)
    .first();

  if (!row?.data_json) return privateJson({ ok: true, authenticated: true, canSync: true, data: null, updatedAt: null });
  return privateJson({
    ok: true,
    authenticated: true,
    canSync: true,
    data: JSON.parse(String(row.data_json)),
    updatedAt: row.updated_at || null,
  });
}

export async function onRequestPost(context: any) {
  const user = await requireRole(context.env, context.request, offeringRoles);
  if (user instanceof Response) return user;

  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return bad("JSON inválido");
  }

  if (!isSnapshot(body?.data)) return bad("Snapshot de Regi Works no válido");
  const dataJson = JSON.stringify(body.data);
  if (new TextEncoder().encode(dataJson).byteLength > MAX_SNAPSHOT_BYTES) {
    return bad("El espacio sincronizado de Regi Works supera el límite actual", 413);
  }

  await context.env.DB.prepare(
    `INSERT INTO regi_works_snapshots (user_id,data_json,updated_at)
     VALUES (?,?,datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET data_json = excluded.data_json, updated_at = datetime('now')`,
  )
    .bind(user.id, dataJson)
    .run();

  return privateJson({ ok: true });
}
