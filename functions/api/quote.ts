import { json, bad, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { isActiveCountryCode } from "../../lib/market";
import { requireTurnstile } from "../../packages/cost-guards";

// POST /api/quote — solicitud de presupuesto de un cliente.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }
  const email = String(b.clientEmail || b.email || "").trim();
  const description = String(b.description || "").trim();
  const country = String(b.country || "").trim().toUpperCase();
  const city = String(b.city || "").trim();
  const honeypot = String(b.website || b.companyWebsite || "").trim();
  if (honeypot) return bad("Solicitud no válida", 400);
  const challenge = await requireTurnstile(env, request, b.turnstileToken, "request_quote");
  if (challenge) return challenge;
  if (!isEmail(email)) return bad("Email no válido");
  if (!country || !city) return bad("Faltan país o ciudad");
  if (!isActiveCountryCode(country)) return bad("País no disponible todavía en RegiKaha");
  if (description.length < 20) return bad("Describe brevemente lo que necesitas");
  if (description.length > 2400) return bad("La descripción es demasiado larga");
  if (b.professionalId) {
    const target = await env.DB.prepare(
      "SELECT id FROM professionals WHERE id = ? AND active_status = 1 AND verification_status != 'suspended'",
    ).bind(String(b.professionalId)).first();
    if (!target) return bad("Este perfil no está disponible para nuevas solicitudes", 409);
  }

  const id = newId("qr_");
  await env.DB.prepare(
    `INSERT INTO quote_requests
      (id,professional_id,category_id,service_id,client_name,client_email,client_phone,country,region,city,description,budget_range,urgency)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).bind(
    id, b.professionalId || null, b.categoryId || null, b.serviceId || null,
    String(b.name || b.clientName || ""), email, String(b.phone || ""),
    country, String(b.region || ""), city,
    description, String(b.budgetRange || ""), String(b.urgency || "flexible"),
  ).run();

  return json({ ok: true, id }, 201);
}
