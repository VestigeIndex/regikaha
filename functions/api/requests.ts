import { bad, privateJson } from "../../apilib/http";
import { getCurrentProfessional, getSubscriptionAccess, safeJsonArray } from "../../apilib/professional";

function locationOf(row: any) {
  return [row.city, row.region, row.country].filter(Boolean).join(", ");
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const access = await getSubscriptionAccess(context.env, current.user.id);
  if (!access.active) {
    return privateJson({ requests: [], subscriptionRequired: true, subscriptionStatus: access.subscription?.status || "no_subscription" });
  }

  const quotes = await context.env.DB.prepare(
    `SELECT * FROM quote_requests
     WHERE professional_id = ?
     ORDER BY created_at DESC
     LIMIT 80`,
  ).bind(current.professional.id).all();

  const estimates = await context.env.DB.prepare(
    `SELECT * FROM quote_estimates
     WHERE professional_id = ?
     ORDER BY created_at DESC
     LIMIT 160`,
  ).bind(current.professional.id).all();

  const estimateMap = new Map<string, any[]>();
  for (const estimate of estimates.results || []) {
    const list = estimateMap.get(estimate.quote_request_id) || [];
    list.push({
      id: estimate.id,
      title: estimate.title,
      summary: estimate.summary,
      lineItems: safeJsonArray(estimate.line_items),
      subtotalEur: Number(estimate.subtotal_eur || 0),
      vatRate: Number(estimate.vat_rate || 0),
      vatEur: Number(estimate.vat_eur || 0),
      totalEur: Number(estimate.total_eur || 0),
      status: estimate.status,
      sentAt: estimate.sent_at,
      createdAt: estimate.created_at,
    });
    estimateMap.set(estimate.quote_request_id, list);
  }

  return privateJson({
    requests: (quotes.results || []).map((q: any) => ({
      id: q.id,
      clientName: q.client_name || "Cliente",
      clientEmail: q.client_email || "",
      clientPhone: q.client_phone || "",
      categoryId: q.category_id || "",
      serviceId: q.service_id || null,
      location: locationOf(q),
      country: q.country || current.professional.country || "ES",
      description: q.description || "",
      budgetRange: q.budget_range || "",
      urgency: q.urgency || "flexible",
      status: q.status || "new",
      createdAt: q.created_at,
      estimates: estimateMap.get(q.id) || [],
    })),
  });
}

export async function onRequestPatch(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const access = await getSubscriptionAccess(context.env, current.user.id);
  if (!access.active) return bad("Tu suscripción no está activa", 402);
  let body: any;
  try { body = await context.request.json(); } catch { return bad("JSON inválido"); }
  const id = String(body.id || "").trim();
  const status = String(body.status || "").trim();
  if (!id || !["new", "contacted", "quoted", "won", "lost", "closed"].includes(status)) return bad("Estado no válido");
  await context.env.DB.prepare(
    "UPDATE quote_requests SET status = ? WHERE id = ? AND professional_id = ?",
  ).bind(status, id, current.professional.id).run();
  return privateJson({ ok: true });
}
