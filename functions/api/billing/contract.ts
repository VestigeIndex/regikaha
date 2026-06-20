import { bad, getSessionUser, json } from "../../../apilib/http";
import { newId } from "../../../apilib/auth";
import {
  addMonths,
  allContractCheckboxesAccepted,
  founderMonths,
  founderReservationHours,
  founderSlotLimit,
  isBillingInterval,
  isOfferingRole,
  isProfessionalPlan,
  planPriceCents,
  trialRequiresPaymentMethod,
} from "../../../lib/billing/subscription";
import { isLocale } from "../../../lib/i18n/config";
import { buildSubscriptionContractSnapshot } from "../../../lib/legal/buildSubscriptionContract";
import { legalVersions } from "../../../lib/legal/contractVersions";
import { hashContractSnapshot } from "../../../lib/legal/hashContract";

async function profileForUser(env: any, user: any) {
  if (user.role === "professional") {
    return env.DB.prepare(
      "SELECT id, country, city FROM professionals WHERE user_id = ?",
    ).bind(user.id).first();
  }
  return env.DB.prepare(
    "SELECT id, country, city, place_id FROM profiles WHERE user_id = ?",
  ).bind(user.id).first();
}

async function reserveFounderSlot(env: any, params: {
  user: any;
  profile: any;
  selectedPlan: string;
  trialMonths: number;
  trialEndsAt: string;
}) {
  const reservationModifier = `-${founderReservationHours(env)} hours`;
  await env.DB.prepare(
    `UPDATE founder_slots
     SET status = 'expired'
     WHERE status = 'reserved' AND datetime(reserved_at) < datetime('now', ?)`,
  ).bind(reservationModifier).run();

  const existing = await env.DB.prepare(
    "SELECT * FROM founder_slots WHERE user_id = ? LIMIT 1",
  ).bind(params.user.id).first();
  if (existing && ["reserved", "active", "converted"].includes(String(existing.status))) return existing;

  const limit = founderSlotLimit(env);
  const id = existing?.id || newId("founder_");
  const result = await env.DB.prepare(
    `INSERT INTO founder_slots
      (id,user_id,profile_id,email,role,country_code,place_id,city,selected_plan,trial_months,status,reserved_at,trial_ends_at)
     SELECT ?,?,?,?,?,?,?,?,?,?,'reserved',datetime('now'),?
     WHERE (SELECT COUNT(*) FROM founder_slots WHERE status IN ('reserved','active','converted')) < ?
     ON CONFLICT(user_id) DO UPDATE SET
       profile_id = excluded.profile_id,
       email = excluded.email,
       role = excluded.role,
       country_code = excluded.country_code,
       place_id = excluded.place_id,
       city = excluded.city,
       selected_plan = excluded.selected_plan,
       trial_months = excluded.trial_months,
       status = 'reserved',
       reserved_at = datetime('now'),
       trial_ends_at = excluded.trial_ends_at`,
  ).bind(
    id,
    params.user.id,
    params.profile?.id || null,
    params.user.email,
    params.user.role,
    params.profile?.country || null,
    params.profile?.place_id || null,
    params.profile?.city || null,
    params.selectedPlan,
    params.trialMonths,
    params.trialEndsAt,
    limit,
  ).run();

  if (!Number(result?.meta?.changes || result?.changes || 0)) return null;
  return env.DB.prepare("SELECT * FROM founder_slots WHERE user_id = ? LIMIT 1").bind(params.user.id).first();
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = await getSessionUser(env, request);
  if (!user) return bad("Necesitas iniciar sesión antes de aceptar el contrato", 401);
  if (!isOfferingRole(String(user.role))) return bad("Esta suscripción es para cuentas que ofrecen servicios", 403);
  if (!Number(user.email_verified || 0)) return bad("Verifica tu email antes de activar la suscripción", 403);

  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }

  const plan = String(body.plan || "");
  const interval = String(body.interval || "");
  const locale = String(body.locale || "");
  const founderRequested = body.founder === true;
  if (!isProfessionalPlan(plan) || !isBillingInterval(interval)) return bad("Plan no válido");
  if (!isLocale(locale)) return bad("Idioma de contrato no válido");
  if (!allContractCheckboxesAccepted(body.checkboxes)) return bad("Debes aceptar todas las declaraciones del contrato");

  const profile = await profileForUser(env, user);
  if (!profile) return bad("Completa primero tu perfil profesional o de empresa", 409);

  const now = new Date();
  const acceptedAt = now.toISOString();
  const months = founderMonths(env);
  const trialEndsAt = founderRequested ? addMonths(now, months).toISOString() : undefined;
  const futurePrice = planPriceCents(plan, interval);
  const paymentMethodRequired = trialRequiresPaymentMethod(env);
  const selectedPlan = `${plan}:${interval}`;
  let founderSlot: any = null;

  if (founderRequested) {
    founderSlot = await reserveFounderSlot(env, {
      user,
      profile,
      selectedPlan,
      trialMonths: months,
      trialEndsAt: trialEndsAt!,
    });
    if (!founderSlot) return bad("Las plazas fundador ya se han agotado. Puedes activar un plan normal.", 409);
  }

  const snapshot = buildSubscriptionContractSnapshot({
    userId: user.id,
    role: user.role,
    planId: plan,
    acceptedAt,
    acceptedLocale: locale,
    priceToday: founderRequested ? 0 : futurePrice,
    futurePrice,
    currency: "EUR",
    trialStartsAt: founderRequested ? acceptedAt : undefined,
    trialEndsAt,
    firstChargeAt: founderRequested ? trialEndsAt : acceptedAt,
    renewalInterval: interval,
    founderTrial: founderRequested,
    paymentMethodRequired,
    acceptedCheckboxes: body.checkboxes,
  });

  const [snapshotHash, ipHash, userAgentHash] = await Promise.all([
    hashContractSnapshot(snapshot),
    hashContractSnapshot({ ip: request.headers.get("CF-Connecting-IP") || "unknown" }),
    hashContractSnapshot({ userAgent: request.headers.get("User-Agent") || "unknown" }),
  ]);
  const acceptanceId = newId("contract_");

  await env.DB.prepare(
    `INSERT INTO subscription_contract_acceptances
      (id,user_id,profile_id,plan_id,role,contract_version,terms_version,privacy_version,
       verification_policy_version,reviews_policy_version,ranking_policy_version,cancellation_policy_version,
       price_today,future_price,currency,trial_starts_at,trial_ends_at,first_charge_at,renewal_interval,
       ip_address_hash,user_agent_hash,accepted_checkboxes_json,contract_snapshot_hash,contract_snapshot_json,
       accepted_locale,accepted_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).bind(
    acceptanceId,
    user.id,
    profile.id,
    plan,
    user.role,
    legalVersions.contract,
    legalVersions.terms,
    legalVersions.privacy,
    legalVersions.verificationPolicy,
    legalVersions.reviewsPolicy,
    legalVersions.rankingPolicy,
    legalVersions.cancellationPolicy,
    founderRequested ? 0 : futurePrice,
    futurePrice,
    "EUR",
    founderRequested ? acceptedAt : null,
    trialEndsAt || null,
    founderRequested ? trialEndsAt : acceptedAt,
    interval,
    ipHash,
    userAgentHash,
    JSON.stringify(body.checkboxes),
    snapshotHash,
    JSON.stringify(snapshot),
    locale,
    acceptedAt,
  ).run();

  return json({
    ok: true,
    acceptanceId,
    founder: founderRequested,
    founderSlotId: founderSlot?.id || null,
    trialEndsAt: trialEndsAt || null,
    firstChargeAt: founderRequested ? trialEndsAt : acceptedAt,
    futurePrice,
    currency: "EUR",
  }, 201);
}
