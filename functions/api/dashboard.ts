import { privateJson, requireUser } from "../../apilib/http";

async function count(env: any, sql: string, ...bindings: unknown[]) {
  const row = await env.DB.prepare(sql).bind(...bindings).first();
  return Number(row?.total || 0);
}

async function subscriptionStatus(env: any, userId: string) {
  const row = await env.DB.prepare(
    "SELECT status FROM subscriptions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
  ).bind(userId).first();
  return String(row?.status || "no_subscription");
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await requireUser(env, request);
  if (user instanceof Response) return user;

  if (user.role === "client") {
    const [projects, favorites, messages] = await Promise.all([
      count(env, "SELECT COUNT(*) AS total FROM project_requests WHERE client_id = ? OR lower(contact_email) = lower(?)", user.id, user.email),
      count(env, "SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?", user.id),
      count(env, "SELECT COUNT(*) AS total FROM conversation_participants cp JOIN messages m ON m.conversation_id = cp.conversation_id WHERE cp.user_id = ? AND m.sender_user_id != ? AND (cp.last_read_at IS NULL OR m.created_at > cp.last_read_at)", user.id, user.id),
    ]);
    return privateJson({ role: user.role, metrics: { projects, favorites, messages, pendingReviews: 0 } });
  }

  if (user.role === "professional") {
    const professional = await env.DB.prepare("SELECT id FROM professionals WHERE user_id = ?").bind(user.id).first();
    const professionalId = String(professional?.id || "");
    const [requests, services, areas, plan] = await Promise.all([
      professionalId ? count(env, "SELECT COUNT(*) AS total FROM quote_requests WHERE professional_id = ?", professionalId) : 0,
      professionalId ? count(env, "SELECT COUNT(*) AS total FROM services WHERE professional_id = ? AND is_active = 1", professionalId) : 0,
      professionalId ? count(env, "SELECT COUNT(*) AS total FROM service_areas WHERE professional_id = ?", professionalId) : 0,
      subscriptionStatus(env, user.id),
    ]);
    return privateJson({ role: user.role, metrics: { requests, services, areas, plan } });
  }

  if (user.role === "company") {
    const profile = await env.DB.prepare("SELECT id FROM profiles WHERE user_id = ? AND role = 'company'").bind(user.id).first();
    const profileId = String(profile?.id || "");
    const [projects, candidates, messages, plan] = await Promise.all([
      profileId ? count(env, "SELECT COUNT(*) AS total FROM b2b_project_requests WHERE company_id = ?", profileId) : 0,
      profileId ? count(env, "SELECT COUNT(*) AS total FROM b2b_match_candidates mc JOIN b2b_project_requests pr ON pr.id = mc.b2b_project_id WHERE pr.company_id = ?", profileId) : 0,
      count(env, "SELECT COUNT(*) AS total FROM conversation_participants cp JOIN messages m ON m.conversation_id = cp.conversation_id WHERE cp.user_id = ? AND m.sender_user_id != ? AND (cp.last_read_at IS NULL OR m.created_at > cp.last_read_at)", user.id, user.id),
      subscriptionStatus(env, user.id),
    ]);
    return privateJson({ role: user.role, metrics: { projects, candidates, messages, plan } });
  }

  if (user.role === "subcontractor") {
    const profile = await env.DB.prepare("SELECT id, status FROM profiles WHERE user_id = ? AND role = 'subcontractor'").bind(user.id).first();
    const profileId = String(profile?.id || "");
    const [opportunities, messages] = await Promise.all([
      profileId ? count(env, "SELECT COUNT(*) AS total FROM b2b_match_candidates WHERE profile_id = ? AND status = 'candidate'", profileId) : 0,
      count(env, "SELECT COUNT(*) AS total FROM conversation_participants cp JOIN messages m ON m.conversation_id = cp.conversation_id WHERE cp.user_id = ? AND m.sender_user_id != ? AND (cp.last_read_at IS NULL OR m.created_at > cp.last_read_at)", user.id, user.id),
    ]);
    return privateJson({ role: user.role, metrics: { opportunities, messages, areas: 0, verification: String(profile?.status || "incomplete") } });
  }

  const [users, professionals, projects, reports] = await Promise.all([
    count(env, "SELECT COUNT(*) AS total FROM users"),
    count(env, "SELECT COUNT(*) AS total FROM professionals WHERE active_status = 1"),
    count(env, "SELECT COUNT(*) AS total FROM project_requests"),
    count(env, "SELECT COUNT(*) AS total FROM reports WHERE status = 'open'"),
  ]);
  return privateJson({ role: user.role, metrics: { users, professionals, projects, reports } });
}
