import { bad, json, isEmail, getSessionUser } from "../../apilib/http";
import { panelPathForRole } from "../../lib/accounts";
import { priceSecretName, type BillingInterval, type ProfessionalPlanId } from "../../lib/pricing";

const STRIPE_VERSION = "2026-02-25.clover";

function isPlan(value: string): value is ProfessionalPlanId {
  return value === "autonomo_nacional" || value === "europa_pro";
}

function isInterval(value: string): value is BillingInterval {
  return value === "monthly" || value === "yearly";
}

function encodeForm(data: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

// POST /api/checkout — crea una Stripe Checkout Session de suscripción.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return bad("JSON inválido");
  }

  const plan = String(body.plan || "");
  const interval = String(body.interval || "");
  if (!isPlan(plan) || !isInterval(interval)) return bad("Plan no válido");

  const user = await getSessionUser(env, request);
  if (!user) {
    return json(
      {
        error: "Necesitas crear cuenta o iniciar sesión antes de activar una suscripción",
        redirectTo: `/registro/profesional?plan=${plan}&interval=${interval}`,
      },
      401,
    );
  }
  if (!["professional", "company", "subcontractor", "admin"].includes(String(user.role))) {
    return bad("Este plan es para cuentas que ofrecen servicios", 403);
  }

  const secret = String(env.STRIPE_SECRET_KEY || "");
  if (!secret) return bad("Stripe no está configurado", 500);

  const priceEnv = priceSecretName(plan, interval);
  const price = String(env[priceEnv] || "");
  if (!price) return bad(`Falta configurar ${priceEnv}`, 500);

  const origin = request.headers.get("Origin") || new URL(request.url).origin;
  const email = String(user.email || body.email || "").trim().toLowerCase();
  const role = String(user.role || "professional");
  const successPath = panelPathForRole(role as any);
  const payload = encodeForm({
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": 1,
    success_url: `${origin}${successPath}?checkout=success&plan=${plan}&interval=${interval}`,
    cancel_url: `${origin}/precios?checkout=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    "automatic_tax[enabled]": true,
    "tax_id_collection[enabled]": true,
    "customer_email": isEmail(email) ? email : undefined,
    "metadata[regikaha_plan]": plan,
    "metadata[regikaha_interval]": interval,
    "metadata[regikaha_user_id]": user.id,
    "metadata[regikaha_role]": role,
    "subscription_data[metadata][regikaha_plan]": plan,
    "subscription_data[metadata][regikaha_interval]": interval,
    "subscription_data[metadata][regikaha_user_id]": user.id,
    "subscription_data[metadata][regikaha_role]": role,
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded",
      "stripe-version": STRIPE_VERSION,
    },
    body: payload,
  });

  const stripeData: any = await stripeRes.json().catch(() => ({}));
  if (!stripeRes.ok) {
    return bad(stripeData?.error?.message || "Stripe rechazó la sesión", stripeRes.status);
  }

  return json({ ok: true, id: stripeData.id, url: stripeData.url });
}
