import { bad, json, isEmail, getSessionUser } from "../../apilib/http";
import { panelPathForRole } from "../../lib/accounts";
import { priceSecretName, type BillingInterval, type ProfessionalPlanId } from "../../lib/pricing";
import {
  allContractCheckboxesAccepted,
  isBillingInterval,
  isOfferingRole,
  isProfessionalPlan,
  planPriceCents,
  trialRequiresPaymentMethod,
} from "../../lib/billing/subscription";
import { legalVersions } from "../../lib/legal/contractVersions";
import { hashContractSnapshot } from "../../lib/legal/hashContract";

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

async function validateStripePrice(secret: string, priceId: string, plan: ProfessionalPlanId, interval: BillingInterval) {
  const response = await fetch(`https://api.stripe.com/v1/prices/${encodeURIComponent(priceId)}`, {
    headers: {
      authorization: `Bearer ${secret}`,
      "stripe-version": STRIPE_VERSION,
    },
  });
  const price: any = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(price?.error?.message || "No se pudo validar el precio de Stripe");

  const expectedInterval = interval === "monthly" ? "month" : "year";
  const expectedAmount = planPriceCents(plan, interval);
  if (
    price.active !== true
    || price.type !== "recurring"
    || price.currency !== "eur"
    || price.recurring?.interval !== expectedInterval
    || Number(price.recurring?.interval_count || 0) !== 1
    || Number(price.unit_amount || 0) !== expectedAmount
  ) {
    throw new Error("El precio de Stripe no coincide con el plan aceptado");
  }
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
  if (String(acceptance.contract_version || "") !== legalVersions.contract) {
    return json({
      error: "El contrato ha cambiado y debe aceptarse de nuevo",
      redirectTo: `/suscripcion/confirmar?plan=${plan}&interval=${interval}`,
    }, 409);
  }

  let snapshot: any;
  let acceptedCheckboxes: any;
  try {
    snapshot = JSON.parse(String(acceptance.contract_snapshot_json || "{}"));
    acceptedCheckboxes = JSON.parse(String(acceptance.accepted_checkboxes_json || "{}"));
  } catch {
    return bad("El contrato guardado no es válido", 409);
  }
  const snapshotHash = await hashContractSnapshot(snapshot);
  const expectedPrice = planPriceCents(plan, interval);
  const requirePaymentMethod = trialRequiresPaymentMethod(env);
  if (
    snapshotHash !== String(acceptance.contract_snapshot_hash || "")
    || snapshot?.commercialTerms?.userId !== user.id
    || snapshot?.commercialTerms?.planId !== plan
    || snapshot?.commercialTerms?.renewalInterval !== interval
    || Number(snapshot?.commercialTerms?.futurePrice) !== expectedPrice
    || snapshot?.commercialTerms?.paymentMethodRequired !== requirePaymentMethod
    || !allContractCheckboxesAccepted(acceptedCheckboxes)
  ) {
    return json({
      error: "El contrato guardado ya no coincide con las condiciones actuales",
      redirectTo: `/suscripcion/confirmar?plan=${plan}&interval=${interval}`,
    }, 409);
  }
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
  try {
    await validateStripePrice(secret, price, plan, interval);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "No se pudo validar el precio de Stripe", 500);
  }

  const origin = request.headers.get("Origin") || new URL(request.url).origin;
  const email = String(user.email || body.email || "").trim().toLowerCase();
  const role = String(user.role || "professional");
  const successPath = panelPathForRole(role as any);
  const trialEnd = founder && acceptance.trial_ends_at
    ? Math.floor(new Date(String(acceptance.trial_ends_at)).getTime() / 1000)
    : undefined;
  const existingCustomer = await env.DB.prepare(
    `SELECT stripe_customer_id FROM subscriptions
     WHERE user_id = ? AND stripe_customer_id IS NOT NULL
     ORDER BY updated_at DESC LIMIT 1`,
  ).bind(user.id).first();
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
    customer: existingCustomer?.stripe_customer_id || undefined,
    "customer_email": !existingCustomer?.stripe_customer_id && isEmail(email) ? email : undefined,
    payment_method_collection: founder && !requirePaymentMethod ? "if_required" : "always",
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
    "subscription_data[trial_settings][end_behavior][missing_payment_method]":
      founder && !requirePaymentMethod ? "cancel" : undefined,
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded",
      "stripe-version": STRIPE_VERSION,
      "idempotency-key": `rk_checkout_${acceptanceId}`,
    },
    body: payload,
  });

  const stripeData: any = await stripeRes.json().catch(() => ({}));
  if (!stripeRes.ok) {
    return bad(stripeData?.error?.message || "Stripe rechazó la sesión", stripeRes.status);
  }

  return json({ ok: true, id: stripeData.id, url: stripeData.url });
}
