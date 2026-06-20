import { bad, privateJson } from "../../../apilib/http";
import { newId } from "../../../apilib/auth";
import { getCurrentProfessional } from "../../../apilib/professional";
import { leadInvalidReasons } from "../../../lib/leads";

export async function onRequestPost(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  let body: any;
  try { body = await context.request.json(); } catch { return bad("invalid_json"); }
  const unlockId = String(body.unlockId || "").trim();
  const reason = String(body.reason || "").trim();
  const details = String(body.details || "").trim().slice(0, 1200);
  if (!unlockId || !leadInvalidReasons.includes(reason as any)) return bad("invalid_report");
  const unlock = await context.env.DB.prepare(
    "SELECT * FROM lead_unlocks WHERE id = ? AND professional_id = ?",
  ).bind(unlockId, current.professional.id).first();
  if (!unlock) return bad("unlock_not_found", 404);
  await context.env.DB.prepare(
    `INSERT INTO lead_invalid_reports
      (id,lead_unlock_id,lead_id,professional_id,reason,details,status)
     VALUES (?,?,?,?,?,?,'submitted')`,
  ).bind(newId("lead_report_"), unlockId, unlock.lead_id, current.professional.id, reason, details).run();
  return privateJson({ ok: true }, 201);
}
