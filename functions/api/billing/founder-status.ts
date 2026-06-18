import { json } from "../../../apilib/http";
import { founderMonths, founderSlotLimit } from "../../../lib/billing/subscription";

export async function onRequestGet(context: any) {
  const { env } = context;
  const limit = founderSlotLimit(env);
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS claimed
     FROM founder_slots
     WHERE status IN ('reserved','active','converted')`,
  ).first();
  const claimed = Math.min(limit, Number(row?.claimed || 0));
  return json({
    limit,
    claimed,
    remaining: Math.max(0, limit - claimed),
    available: claimed < limit,
    trialMonths: founderMonths(env),
  });
}
