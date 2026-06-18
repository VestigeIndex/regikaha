import { json, bad, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { requireActiveProfessional } from "../../apilib/professional";

function normalizeLineItems(value: unknown) {
  const raw = Array.isArray(value) ? value : [];
  return raw
    .map((item: any) => ({
      description: String(item?.description || "").trim(),
      quantity: Math.max(1, Number(item?.quantity || 1)),
      unitPrice: Math.max(0, Number(item?.unitPrice || 0)),
    }))
    .filter((item) => item.description && Number.isFinite(item.quantity) && Number.isFinite(item.unitPrice))
    .slice(0, 30);
}

export async function onRequestPost(context: any) {
  const current = await requireActiveProfessional(context.env, context.request);
  if (current instanceof Response) return current;

  let b: any;
  try { b = await context.request.json(); } catch { return bad("JSON inválido"); }

  const quoteRequestId = String(b.quoteRequestId || "").trim();
  const title = String(b.title || "Pre-presupuesto inicial").trim().slice(0, 140);
  const summary = String(b.summary || "").trim().slice(0, 1200);
  const vatRate = Math.max(0, Math.min(99, Number(b.vatRate ?? 21)));
  const lineItems = normalizeLineItems(b.lineItems);
  if (!quoteRequestId) return bad("Falta la solicitud");
  if (!lineItems.length) return bad("Añade al menos una línea de pre-presupuesto");

  const requestRow = await context.env.DB.prepare(
    "SELECT * FROM quote_requests WHERE id = ? AND professional_id = ?",
  ).bind(quoteRequestId, current.professional.id).first();
  if (!requestRow) return bad("Solicitud no encontrada", 404);

  const clientEmail = String(b.clientEmail || requestRow.client_email || "").trim();
  if (clientEmail && !isEmail(clientEmail)) return bad("Email del cliente no válido");

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vat = subtotal * (vatRate / 100);
  const total = subtotal + vat;
  const id = newId("est_");

  await context.env.DB.batch([
    context.env.DB.prepare(
      `INSERT INTO quote_estimates
        (id, quote_request_id, professional_id, client_email, title, summary, line_items,
         subtotal_eur, vat_rate, vat_eur, total_eur, status, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent', datetime('now'))`,
    ).bind(
      id, quoteRequestId, current.professional.id, clientEmail || null, title, summary,
      JSON.stringify(lineItems), subtotal, vatRate, vat, total,
    ),
    context.env.DB.prepare("UPDATE quote_requests SET status = 'quoted' WHERE id = ? AND professional_id = ?")
      .bind(quoteRequestId, current.professional.id),
  ]);

  return json({
    ok: true,
    estimate: {
      id,
      title,
      summary,
      lineItems,
      subtotalEur: subtotal,
      vatRate,
      vatEur: vat,
      totalEur: total,
      status: "sent",
    },
  }, 201);
}
