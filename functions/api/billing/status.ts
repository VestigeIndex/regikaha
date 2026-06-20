import { bad, getSessionUser, json } from "../../../apilib/http";

// GET /api/billing/status
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  try {
    const subscription = await env.DB.prepare(
      `SELECT id, role, plan, interval, status, current_period_end, trial_ends_at, first_charge_at,
              future_price_cents, currency, stripe_customer_id, stripe_subscription_id,
              cancel_at_period_end, payment_method_status, updated_at
       FROM subscriptions
       WHERE user_id = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
    ).bind(user.id).first();

    const [founderSlot, contract, profile, notifications] = await Promise.all([
      env.DB.prepare(
      `SELECT status, selected_plan, trial_months, trial_ends_at, activated_at
       FROM founder_slots
       WHERE user_id = ?
       ORDER BY reserved_at DESC
       LIMIT 1`,
      ).bind(user.id).first(),
      env.DB.prepare(
        `SELECT id,plan_id,role,contract_version,price_today,future_price,currency,trial_ends_at,
                first_charge_at,renewal_interval,contract_snapshot_hash,contract_snapshot_json,
                accepted_checkboxes_json,accepted_locale,accepted_at
         FROM subscription_contract_acceptances
         WHERE user_id = ?
         ORDER BY accepted_at DESC
         LIMIT 1`,
      ).bind(user.id).first(),
      env.DB.prepare(
        `SELECT subscription_status,commercial_access_status,email_verified
         FROM profiles WHERE user_id = ?`,
      ).bind(user.id).first(),
      env.DB.prepare(
        `SELECT id,type,scheduled_for,read_at
         FROM billing_notifications
         WHERE user_id = ? AND read_at IS NULL AND datetime(scheduled_for) <= datetime('now','+30 days')
         ORDER BY scheduled_for ASC
         LIMIT 12`,
      ).bind(user.id).all(),
    ]);

    return json({
      subscription: subscription || { status: "no_subscription" },
      founderSlot: founderSlot || null,
      contract: contract || null,
      commercialAccess: profile?.commercial_access_status || (["active", "trialing", "founder_trial_0_eur"].includes(String(subscription?.status || "")) ? "active" : "limited_visibility"),
      emailVerified: Number(user.email_verified || profile?.email_verified || 0) === 1,
      notifications: notifications.results || [],
    });
  } catch {
    return json({
      subscription: { status: "no_subscription" },
      founderSlot: null,
      contract: null,
      commercialAccess: "draft",
      emailVerified: Number(user.email_verified || 0) === 1,
      notifications: [],
      migrationPending: true,
    });
  }
}
