import { bad, privateJson } from "../../../apilib/http";
import { newId } from "../../../apilib/auth";
import { getCurrentProfessional } from "../../../apilib/professional";
import { leadCurrency } from "../../../lib/leads";

const STRIPE_VERSION = "2026-02-25.clover";
const ALLOWED_TOPUPS = new Set([2500, 5000, 10000, 20000]);

function encodeForm(data: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const currency = leadCurrency(current.professional.country || "ES");
  const [balance, transactions] = await Promise.all([
    context.env.DB.prepare(
      "SELECT * FROM lead_balances WHERE user_id = ? AND currency = ?",
    ).bind(current.user.id, currency).first(),
    context.env.DB.prepare(
      `SELECT id,amount,balance_type,transaction_type,reference_type,reference_id,description,created_at
       FROM lead_balance_transactions
       WHERE user_id = ? AND currency = ?
       ORDER BY created_at DESC LIMIT 50`,
    ).bind(current.user.id, currency).all(),
  ]);
  return privateJson({
    balance: {
      currency,
      promotional: Number(balance?.promotional_balance || 0),
      paid: Number(balance?.paid_balance || 0),
      reserved: Number(balance?.reserved_balance || 0),
      available: Number(balance?.promotional_balance || 0) + Number(balance?.paid_balance || 0)
        - Number(balance?.reserved_balance || 0),
    },
    transactions: transactions.results || [],
  });
}

export async function onRequestPost(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  let body: any;
  try { body = await context.request.json(); } catch { return bad("invalid_json"); }
  const amount = Math.round(Number(body.amount || 0));
  if (!ALLOWED_TOPUPS.has(amount)) return bad("invalid_topup");
  const secret = String(context.env.STRIPE_SECRET_KEY || "");
  if (!secret) return bad("stripe_not_configured", 500);

  const currency = leadCurrency(current.professional.country || "ES");
  const orderId = newId("topup_");
  await context.env.DB.prepare(
    "INSERT INTO lead_topup_orders (id,user_id,amount,currency,status) VALUES (?,?,?,?,'pending')",
  ).bind(orderId, current.user.id, amount, currency).run();

  const customer = await context.env.DB.prepare(
    `SELECT stripe_customer_id FROM subscriptions
     WHERE user_id = ? AND stripe_customer_id IS NOT NULL
     ORDER BY updated_at DESC LIMIT 1`,
  ).bind(current.user.id).first();
  const origin = context.request.headers.get("Origin") || new URL(context.request.url).origin;
  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded",
      "stripe-version": STRIPE_VERSION,
      "idempotency-key": `rk_lead_topup_${orderId}`,
    },
    body: encodeForm({
      mode: "payment",
      "line_items[0][price_data][currency]": currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": amount,
      "line_items[0][price_data][product_data][name]": "RegiKaha contact balance",
      "line_items[0][quantity]": 1,
      success_url: `${origin}/panel/saldo?topup=success`,
      cancel_url: `${origin}/panel/saldo?topup=cancelled`,
      billing_address_collection: "required",
      "automatic_tax[enabled]": true,
      "invoice_creation[enabled]": true,
      customer: customer?.stripe_customer_id || undefined,
      customer_email: customer?.stripe_customer_id ? undefined : current.user.email,
      "metadata[regikaha_type]": "lead_topup",
      "metadata[regikaha_order_id]": orderId,
      "metadata[regikaha_user_id]": current.user.id,
      "metadata[regikaha_currency]": currency,
      "metadata[regikaha_amount]": amount,
    }),
  });
  const session: any = await stripeResponse.json().catch(() => ({}));
  if (!stripeResponse.ok) {
    await context.env.DB.prepare("UPDATE lead_topup_orders SET status = 'failed' WHERE id = ?").bind(orderId).run();
    return bad(session?.error?.message || "stripe_checkout_failed", stripeResponse.status);
  }
  await context.env.DB.prepare(
    "UPDATE lead_topup_orders SET stripe_checkout_session_id = ? WHERE id = ?",
  ).bind(String(session.id || ""), orderId).run();
  return privateJson({ ok: true, url: session.url });
}
