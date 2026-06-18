import { bad, json, isEmail, getSessionUser } from "../../apilib/http";
import { panelPathForRole } from "../../lib/accounts";
import { priceSecretName, type BillingInterval, type ProfessionalPlanId } from "../../lib/pricing";
import { isBillingInterval, isOfferingRole, isProfessionalPlan } from "../../lib/billing/subscription";

const STRIPE_VERSION = "2026-02-25.clover";

function isPlan(value: string): value is ProfessionalPlanId {
  return isProfessionalPlan(value);
}

function isInterval(value: string): value is BillingInterval {
  return isBillingInterval(value);
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
  const acceptanceId = String(body.acceptanceId || "").trim();
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
  if (!isOfferingRole(String(user.role))) {
    return bad("Este plan es para cuentas que ofrecen servicios", 403);
  }
  if (!Number(user.email_verified || 0)) return bad("Verifica tu email antes de activar la suscripción", 403);

  const acceptance = await env.DB.prepare(
    `SELECT * FROM subscription_contract_acceptances
     WHERE id = ? AND user_id = ? AND plan_id = ? AND renewal_interval = ?
     LIMIT 1`,
  ).bind(acceptanceId, user.id, plan, interval).first();
  if (!acceptance) {
    return json({
      error: "Debes aceptar el contrato digital antes de abrir Stripe",
      redirectTo: `/suscripcion/confirmar?plan=${plan}&interval=${interval}`,
    }, 409);
  }

  const snapshot = JSON.parse(String(acceptance.contract_snapshot_json || "{}"));
  const founder = snapshot?.commercialTerms?.founderTrial === true;
  const founderSlot = founder
    ? await env.DB.prepare(
        "SELECT * FROM founder_slots WHERE user_id = ? AND status IN ('reserved','active') LIMIT 1",
      ).bind(user.id).first()
    : null;
  if (founder && !founderSlot) return bad("La plaza fundador ya no está disponible", 409);

  const secret = String(env.STRIPE_SECRET_KEY || "");
  if (!secret) return bad("Stripe no está configurado", 500);

  const priceEnv = priceSecretName(plan, interval);
  const price = String(env[priceEnv] || "");
  if (!price) return bad(`Falta configurar ${priceEnv}`, 500);

  const origin = request.headers.get("Origin") || new URL(request.url).origin;
  const email = String(user.email || body.email || "").trim().toLowerCase();
  const role = String(user.role || "professional");
  const successPath = panelPathForRole(role as any);
  const trialEnd = founder && acceptance.trial_ends_at
    ? Math.floor(new Date(String(acceptance.trial_ends_at)).getTime() / 1000)
    : undefined;
  const requirePaymentMethod = String(env.BILLING_REQUIRE_PAYMENT_METHOD_FOR_TRIAL || "true") !== "false";
  const payload = encodeForm({
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": 1,
    success_url: `${origin}/suscripcion/exito?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(successPath)}`,
    cancel_url: `${origin}/suscripcion/cancelada?plan=${plan}&interval=${interval}${founder ? "&founder=true" : ""}`,
    allow_promotion_codes: founder ? undefined : true,
    billing_address_collection: "required",
    "automatic_tax[enabled]": true,
    "tax_id_collection[enabled]": true,
    "customer_email": isEmail(email) ? email : undefined,
    payment_method_collection: founder && requirePaymentMethod ? "always" : undefined,
    "metadata[regikaha_plan]": plan,
    "metadata[regikaha_interval]": interval,
    "metadata[regikaha_user_id]": user.id,
    "metadata[regikaha_role]": role,
    "metadata[regikaha_contract_acceptance_id]": acceptanceId,
    "metadata[regikaha_founder]": founder ? "true" : "false",
    "metadata[regikaha_founder_slot_id]": founderSlot?.id,
    "subscription_data[metadata][regikaha_plan]": plan,
    "subscription_data[metadata][regikaha_interval]": interval,
    "subscription_data[metadata][regikaha_user_id]": user.id,
    "subscription_data[metadata][regikaha_role]": role,
    "subscription_data[metadata][regikaha_contract_acceptance_id]": acceptanceId,
    "subscription_data[metadata][regikaha_founder]": founder ? "true" : "false",
    "subscription_data[metadata][regikaha_founder_slot_id]": founderSlot?.id,
    "subscription_data[trial_end]": trialEnd,
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
