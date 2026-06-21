import { privateJson, requireAdmin } from "../../../apilib/http";

async function count(env: any, sql: string) {
  const row = await env.DB.prepare(sql).first();
  return Number(row?.total || 0);
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const admin = await requireAdmin(env, request);
  if (admin instanceof Response) return admin;
  const [users, clients, professionals, companies, subcontractors, projects, b2bProjects, openReports, pendingVerifications, activeSubscriptions] = await Promise.all([
    count(env, "SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL"),
    count(env, "SELECT COUNT(*) AS total FROM users WHERE role = 'client' AND status = 'active' AND deleted_at IS NULL"),
    count(env, "SELECT COUNT(*) AS total FROM users WHERE role = 'professional' AND status = 'active' AND deleted_at IS NULL"),
    count(env, "SELECT COUNT(*) AS total FROM users WHERE role = 'company' AND status = 'active' AND deleted_at IS NULL"),
    count(env, "SELECT COUNT(*) AS total FROM users WHERE role = 'subcontractor' AND status = 'active' AND deleted_at IS NULL"),
    count(env, "SELECT COUNT(*) AS total FROM project_requests"),
    count(env, "SELECT COUNT(*) AS total FROM b2b_project_requests"),
    count(env, "SELECT COUNT(*) AS total FROM reports WHERE status = 'open'"),
    count(env, "SELECT COUNT(*) AS total FROM verification_requests WHERE status = 'pending'"),
    count(env, "SELECT COUNT(*) AS total FROM subscriptions WHERE status IN ('founder_trial_0_eur','trialing','active')"),
  ]);
  return privateJson({ metrics: { users, clients, professionals, companies, subcontractors, projects, b2bProjects, openReports, pendingVerifications, activeSubscriptions } });
}
