// Auditoría básica best-effort. Nunca debe romper el flujo principal.
// Reutiliza la tabla audit_logs (id, user_id, action, resource_type, resource_id, metadata_json).
export async function logAudit(
  env: any,
  params: {
    userId?: string | null;
    action: string;
    resourceType?: string;
    resourceId?: string;
    meta?: Record<string, unknown>;
    request?: Request;
  },
): Promise<void> {
  try {
    const meta: Record<string, unknown> = { ...(params.meta || {}) };
    if (params.request) {
      const ip = params.request.headers.get("CF-Connecting-IP") || "";
      if (ip) meta.ip = ip;
    }
    await env.DB.prepare(
      "INSERT INTO audit_logs (id,user_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,?,?,?,?)",
    )
      .bind(
        `aud_${crypto.randomUUID()}`,
        params.userId || null,
        params.action,
        params.resourceType || null,
        params.resourceId || null,
        JSON.stringify(meta),
      )
      .run();
  } catch {
    // best-effort
  }
}
