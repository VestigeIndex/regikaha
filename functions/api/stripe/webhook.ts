import { bad, json } from "../../../apilib/http";
import { commercialAccessStatus } from "../../../lib/billing/subscription";
import { newId } from "../../../apilib/auth";

const STRIPE_TOLERANCE_SECONDS = 300;

function hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );
  const timestamp = Number(parts.t || 0);
  const signature = parts.v1 || "";
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > STRIPE_TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signedPayload = `${timestamp}.${rawBody}`;
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  return timingSafeEqual(hex(digest), signature);
}

function secondsToDate(value: unknown): string | null {
  const n = Number(value || 0);
  if (!n) return null;
  return new Date(n * 1000).toISOString();
}

function subscriptionStatus(value: string): string {
  switch (value) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "unpaid";
    case "canceled":
      return "cancelled";
    case "incomplete_expired":
      return "expired";
    default:
      return value || "no_subscription";
  }
}

async function upsertSubscription(env: any, data: {
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  userId?: string;
  role?: string;
  plan?: string;
  interval?: string;
  status?: string;
  currentPeriodEnd?: string | null;
  trialEnd?: string | null;
  contractAcceptanceId?: string;
  founderSlotId?: string;
  checkoutSessionId?: string;
}) {
  if (!data.stripeSubscriptionId) return;
  await env.DB.prepare(
    `INSERT INTO subscriptions
      (id,user_id,role,plan,interval,status,stripe_customer_id,stripe_subscription_id,current_period_end,trial_ends_at,
       contract_acceptance_id,founder_slot_id,checkout_session_id,payment_method_status,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'attached',datetime('now'))
     ON CONFLICT(stripe_subscription_id) DO UPDATE SET
       user_id = COALESCE(excluded.user_id, subscriptions.user_id),
       role = COALESCE(excluded.role, subscriptions.role),
       plan = COALESCE(excluded.plan, subscriptions.plan),
       interval = COALESCE(excluded.interval, subscriptions.interval),
       status = excluded.status,
       stripe_customer_id = COALESCE(excluded.stripe_customer_id, subscriptions.stripe_customer_id),
       current_period_end = COALESCE(excluded.current_period_end, subscriptions.current_period_end),
       trial_ends_at = COALESCE(excluded.trial_ends_at, subscriptions.trial_ends_at),
       contract_acceptance_id = COALESCE(excluded.contract_acceptance_id, subscriptions.contract_acceptance_id),
       founder_slot_id = COALESCE(excluded.founder_slot_id, subscriptions.founder_slot_id),
       checkout_session_id = COALESCE(excluded.checkout_session_id, subscriptions.checkout_session_id),
       payment_method_status = COALESCE(excluded.payment_method_status, subscriptions.payment_method_status),
       updated_at = datetime('now')`,
  )
    .bind(
      data.stripeSubscriptionId,
      data.userId || null,
      data.role || null,
      data.plan || null,
      data.interval || null,
      data.status || "active",
      data.stripeCustomerId || null,
      data.stripeSubscriptionId,
      data.currentPeriodEnd || null,
      data.trialEnd || null,
      data.contractAcceptanceId || null,
      data.founderSlotId || null,
      data.checkoutSessionId || null,
    )
    .run();

  if (data.userId && data.role && ["professional", "company", "subcontractor"].includes(data.role)) {
    const access = commercialAccessStatus(data.status);
    try {
      await env.DB.batch([
        env.DB.prepare(
          `UPDATE profiles
           SET subscription_status = ?, commercial_access_status = ?, updated_at = datetime('now')
           WHERE user_id = ?`,
        ).bind(data.status || "no_subscription", access, data.userId),
        env.DB.prepare(
          "UPDATE professionals SET active_status = ? WHERE user_id = ?",
        ).bind(access === "active" ? 1 : 0, data.userId),
      ]);
    } catch {
      // La tabla profiles llega por migración incremental; no debe bloquear la sincronización Stripe.
    }
  }

  if (data.contractAcceptanceId) {
    await env.DB.prepare(
      "UPDATE subscription_contract_acceptances SET subscription_id = ? WHERE id = ?",
    ).bind(data.stripeSubscriptionId, data.contractAcceptanceId).run();
  }
}

async function scheduleTrialNotifications(env: any, userId: string, subscriptionId: string, trialEnd?: string | null) {
  if (!userId || !trialEnd) return;
  const end = new Date(trialEnd);
  if (Number.isNaN(end.getTime())) return;
  const offsets = [30, 14, 7, 3, 1, 0];
  const statements = offsets.map((days) => {
    const scheduled = new Date(end.getTime() - days * 86_400_000).toISOString();
    return env.DB.prepare(
      `INSERT OR IGNORE INTO billing_notifications
        (id,user_id,subscription_id,type,scheduled_for)
       VALUES (?,?,?,?,?)`,
    ).bind(newId("bill_notice_"), userId, subscriptionId, days === 0 ? "trial_ends_today" : `trial_ends_${days}d`, scheduled);
  });
  await env.DB.batch(statements);
}

async function handleCheckoutCompleted(env: any, session: any) {
  const founder = session.metadata?.regikaha_founder === "true";
  const status = founder ? "founder_trial_0_eur" : "active";
  await upsertSubscription(env, {
    stripeSubscriptionId: String(session.subscription || ""),
    stripeCustomerId: String(session.customer || ""),
    userId: session.metadata?.regikaha_user_id,
    role: session.metadata?.regikaha_role,
    plan: session.metadata?.regikaha_plan,
    interval: session.metadata?.regikaha_interval,
    status,
    contractAcceptanceId: session.metadata?.regikaha_contract_acceptance_id,
    founderSlotId: session.metadata?.regikaha_founder_slot_id,
    checkoutSessionId: String(session.id || ""),
  });
  if (founder && session.metadata?.regikaha_founder_slot_id) {
    await env.DB.prepare(
      `UPDATE founder_slots
       SET status = 'active', activated_at = datetime('now'), stripe_customer_id = ?, stripe_subscription_id = ?
       WHERE id = ? AND user_id = ?`,
    ).bind(
      String(session.customer || ""),
      String(session.subscription || ""),
      session.metadata.regikaha_founder_slot_id,
      session.metadata.regikaha_user_id,
    ).run();
  }
}

async function handleSubscription(env: any, subscription: any) {
  const founder = subscription.metadata?.regikaha_founder === "true";
  const normalizedStatus = subscriptionStatus(String(subscription.status || ""));
  const status = founder && normalizedStatus === "trialing" ? "founder_trial_0_eur" : normalizedStatus;
  const trialEnd = secondsToDate(subscription.trial_end);
  await upsertSubscription(env, {
    stripeSubscriptionId: String(subscription.id || ""),
    stripeCustomerId: String(subscription.customer || ""),
    userId: subscription.metadata?.regikaha_user_id,
    role: subscription.metadata?.regikaha_role,
    plan: subscription.metadata?.regikaha_plan,
    interval: subscription.metadata?.regikaha_interval,
    status,
    currentPeriodEnd: secondsToDate(subscription.current_period_end),
    trialEnd,
    contractAcceptanceId: subscription.metadata?.regikaha_contract_acceptance_id,
    founderSlotId: subscription.metadata?.regikaha_founder_slot_id,
  });
  if (founder && subscription.metadata?.regikaha_founder_slot_id) {
    const founderStatus = status === "founder_trial_0_eur" ? "active" : status === "active" ? "converted" : status;
    await env.DB.prepare(
      `UPDATE founder_slots
       SET status = ?, stripe_customer_id = ?, stripe_subscription_id = ?, trial_ends_at = COALESCE(?, trial_ends_at),
           converted_at = CASE WHEN ? = 'converted' THEN datetime('now') ELSE converted_at END,
           cancelled_at = CASE WHEN ? IN ('cancelled','expired','unpaid') THEN datetime('now') ELSE cancelled_at END
       WHERE id = ?`,
    ).bind(
      founderStatus,
      String(subscription.customer || ""),
      String(subscription.id || ""),
      trialEnd,
      founderStatus,
      founderStatus,
      subscription.metadata.regikaha_founder_slot_id,
    ).run();
  }
  await scheduleTrialNotifications(env, subscription.metadata?.regikaha_user_id, String(subscription.id || ""), trialEnd);
}

async function updateInvoiceStatus(env: any, invoice: any, status: string) {
  const subscriptionId = String(invoice.subscription || "");
  if (!subscriptionId) return;
  await env.DB.prepare(
    `UPDATE subscriptions
     SET status = ?, updated_at = datetime('now')
     WHERE stripe_subscription_id = ?`,
  ).bind(status, subscriptionId).run();
  const row = await env.DB.prepare(
    "SELECT user_id, role FROM subscriptions WHERE stripe_subscription_id = ? LIMIT 1",
  ).bind(subscriptionId).first();
  if (row?.user_id) {
    await upsertSubscription(env, {
      stripeSubscriptionId: subscriptionId,
      userId: row.user_id,
      role: row.role,
      status,
    });
  }
}

// POST /api/stripe/webhook
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const secret = String(env.STRIPE_WEBHOOK_SECRET || "");
  if (!secret) return bad("Stripe webhook no configurado", 500);

  const rawBody = await request.text();
  const signature = request.headers.get("Stripe-Signature") || "";
  const verified = await verifyStripeSignature(rawBody, signature, secret);
  if (!verified) return bad("Firma Stripe no válida", 400);

  const event = JSON.parse(rawBody);
  if (!event?.id || !event?.type) return bad("Evento Stripe incompleto", 400);
  const processed = await env.DB.prepare(
    "SELECT event_id FROM stripe_webhook_events WHERE event_id = ?",
  ).bind(event.id).first();
  if (processed) return json({ received: true, duplicate: true });
  const object = event?.data?.object || {};

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(env, object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscription(env, object);
      break;
    case "invoice.payment_succeeded":
      await updateInvoiceStatus(env, object, "active");
      break;
    case "invoice.payment_failed":
      await updateInvoiceStatus(env, object, "past_due");
      break;
    case "customer.subscription.trial_will_end":
      await handleSubscription(env, object);
      break;
    case "payment_method.attached":
      if (object.customer) {
        await env.DB.prepare(
          "UPDATE subscriptions SET payment_method_status = 'attached', updated_at = datetime('now') WHERE stripe_customer_id = ?",
        ).bind(String(object.customer)).run();
      }
      break;
    default:
      break;
  }

  await env.DB.prepare(
    "INSERT INTO stripe_webhook_events (event_id,event_type) VALUES (?,?)",
  ).bind(event.id, event.type).run();

  return json({ received: true });
}
