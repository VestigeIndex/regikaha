import { bad, getSessionUser, json } from "../../../apilib/http";

function encodeForm(data: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value) params.set(key, value);
  }
  return params.toString();
}

// POST /api/billing/portal — crea una sesión de Stripe Billing Portal.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("No autenticado", 401);

  const secret = String(env.STRIPE_SECRET_KEY || "");
  if (!secret) return bad("Stripe no está configurado", 500);

  const subscription = await env.DB.prepare(
    `SELECT stripe_customer_id FROM subscriptions
     WHERE user_id = ? AND stripe_customer_id IS NOT NULL
     ORDER BY updated_at DESC
     LIMIT 1`,
  ).bind(user.id).first();
  if (!subscription?.stripe_customer_id) return bad("No hay cliente Stripe asociado todavía", 404);

  const origin = request.headers.get("Origin") || new URL(request.url).origin;
  const stripeRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: encodeForm({
      customer: String(subscription.stripe_customer_id),
      return_url: `${origin}/panel/profesional/facturacion`,
    }),
  });

  const data: any = await stripeRes.json().catch(() => ({}));
  if (!stripeRes.ok) return bad(data?.error?.message || "No se pudo abrir el portal de facturación", stripeRes.status);
  return json({ ok: true, url: data.url });
}
