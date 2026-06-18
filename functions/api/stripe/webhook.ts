import { bad, json } from "../../../apilib/http";

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
}) {
  if (!data.stripeSubscriptionId) return;
  await env.DB.prepare(
    `INSERT INTO subscriptions
      (id,user_id,role,plan,interval,status,stripe_customer_id,stripe_subscription_id,current_period_end,trial_ends_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))
     ON CONFLICT(stripe_subscription_id) DO UPDATE SET
       user_id = COALESCE(excluded.user_id, subscriptions.user_id),
       role = COALESCE(excluded.role, subscriptions.role),
       plan = COALESCE(excluded.plan, subscriptions.plan),
       interval = COALESCE(excluded.interval, subscriptions.interval),
       status = excluded.status,
       stripe_customer_id = COALESCE(excluded.stripe_customer_id, subscriptions.stripe_customer_id),
       current_period_end = COALESCE(excluded.current_period_end, subscriptions.current_period_end),
       trial_ends_at = COALESCE(excluded.trial_ends_at, subscriptions.trial_ends_at),
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
    )
    .run();

  if (data.userId && data.role && ["professional", "company", "subcontractor"].includes(data.role)) {
    const profileStatus = ["active", "trialing", "founder_trial_0_eur"].includes(data.status || "")
      ? "subscription_active"
      : "limited_visibility";
    try {
      await env.DB.prepare(
        `UPDATE profiles
         SET subscription_status = ?, updated_at = datetime('now')
         WHERE user_id = ?`,
      ).bind(profileStatus, data.userId).run();
    } catch {
      // La tabla profiles llega por migración incremental; no debe bloquear la sincronización Stripe.
    }
  }
}

async function handleCheckoutCompleted(env: any, session: any) {
  await upsertSubscription(env, {
    stripeSubscriptionId: String(session.subscription || ""),
    stripeCustomerId: String(session.customer || ""),
    userId: session.metadata?.regikaha_user_id,
    role: session.metadata?.regikaha_role,
    plan: session.metadata?.regikaha_plan,
    interval: session.metadata?.regikaha_interval,
    status: "active",
  });
}

async function handleSubscription(env: any, subscription: any) {
  await upsertSubscription(env, {
    stripeSubscriptionId: String(subscription.id || ""),
    stripeCustomerId: String(subscription.customer || ""),
    userId: subscription.metadata?.regikaha_user_id,
    role: subscription.metadata?.regikaha_role,
    plan: subscription.metadata?.regikaha_plan,
    interval: subscription.metadata?.regikaha_interval,
    status: subscriptionStatus(String(subscription.status || "")),
    currentPeriodEnd: secondsToDate(subscription.current_period_end),
    trialEnd: secondsToDate(subscription.trial_end),
  });
}

async function updateInvoiceStatus(env: any, invoice: any, status: string) {
  const subscriptionId = String(invoice.subscription || "");
  if (!subscriptionId) return;
  await env.DB.prepare(
    `UPDATE subscriptions
     SET status = ?, updated_at = datetime('now')
     WHERE stripe_subscription_id = ?`,
  ).bind(status, subscriptionId).run();
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
    default:
      break;
  }

  return json({ received: true });
}
