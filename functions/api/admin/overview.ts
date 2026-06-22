import { privateJson, requireAdmin } from "../../../apilib/http";
import { founderSlotLimit } from "../../../lib/billing/subscription";

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
  const founderLimit = founderSlotLimit(env);
  let foundersByCountry: any[] = [];
  try {
    const rows = await env.DB.prepare(
      `SELECT country_code AS country,
        COUNT(*) AS claimed,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS reserved,
        SUM(CASE WHEN status IN ('active','converted') THEN 1 ELSE 0 END) AS activated
       FROM founder_slots
       WHERE status IN ('reserved','active','converted') AND country_code IS NOT NULL AND country_code != ''
       GROUP BY country_code
       ORDER BY claimed DESC`,
    ).all();
    foundersByCountry = (rows.results || []).map((r: any) => ({
      country: r.country,
      limit: founderLimit,
      claimed: Number(r.claimed || 0),
      reserved: Number(r.reserved || 0),
      activated: Number(r.activated || 0),
      available: Math.max(0, founderLimit - Number(r.claimed || 0)),
    }));
  } catch {
    foundersByCountry = [];
  }
  return privateJson({
    metrics: { users, clients, professionals, companies, subcontractors, projects, b2bProjects, openReports, pendingVerifications, activeSubscriptions },
    founders: { limitPerCountry: founderLimit, byCountry: foundersByCountry },
  });
}
