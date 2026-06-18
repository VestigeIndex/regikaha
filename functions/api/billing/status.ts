import { bad, getSessionUser, json } from "../../../apilib/http";

// GET /api/billing/status
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  try {
    const subscription = await env.DB.prepare(
      `SELECT id, role, plan, interval, status, current_period_end, trial_ends_at, stripe_customer_id, stripe_subscription_id, updated_at
       FROM subscriptions
       WHERE user_id = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
    ).bind(user.id).first();

    const founderSlot = await env.DB.prepare(
      `SELECT status, selected_plan, trial_months, trial_ends_at, activated_at
       FROM founder_slots
       WHERE user_id = ?
       ORDER BY reserved_at DESC
       LIMIT 1`,
    ).bind(user.id).first();

    return json({
      subscription: subscription || { status: "no_subscription" },
      founderSlot: founderSlot || null,
    });
  } catch {
    return json({
      subscription: { status: "no_subscription" },
      founderSlot: null,
      migrationPending: true,
    });
  }
}
