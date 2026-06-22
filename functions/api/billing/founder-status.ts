import { json } from "../../../apilib/http";
import {
  founderMonths,
  founderReservationHours,
  founderSlotLimit,
  trialRequiresPaymentMethod,
} from "../../../lib/billing/subscription";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const limit = founderSlotLimit(env); // plazas por país
  const country = String(new URL(request.url).searchParams.get("country") || "").trim().toUpperCase().slice(0, 2);
  await env.DB.prepare(
    `UPDATE founder_slots
     SET status = 'expired'
     WHERE status = 'reserved' AND datetime(reserved_at) < datetime('now', ?)`,
  ).bind(`-${founderReservationHours(env)} hours`).run();
  const row = await (country
    ? env.DB.prepare(
        `SELECT COUNT(*) AS claimed FROM founder_slots
         WHERE status IN ('reserved','active','converted') AND country_code = ?`,
      ).bind(country)
    : env.DB.prepare(
        `SELECT COUNT(*) AS claimed FROM founder_slots
         WHERE status IN ('reserved','active','converted')`,
      )
  ).first();
  const claimed = Math.min(limit, Number(row?.claimed || 0));
  return json({
    country: country || null,
    perCountry: true,
    limit,
    claimed,
    remaining: Math.max(0, limit - claimed),
    available: claimed < limit,
    trialMonths: founderMonths(env),
    reservationHours: founderReservationHours(env),
    paymentMethodRequired: trialRequiresPaymentMethod(env),
  });
}
