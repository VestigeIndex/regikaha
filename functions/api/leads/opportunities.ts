import { bad, privateJson } from "../../../apilib/http";
import { newId } from "../../../apilib/auth";
import { getCurrentProfessional, getSubscriptionAccess, safeJsonArray } from "../../../apilib/professional";
import { getLeadPrice, leadCurrency } from "../../../lib/leads";

function mapLead(row: any) {
  const unlocked = Boolean(row.unlock_id);
  return {
    id: row.id,
    title: row.title || row.category_id || "",
    categoryId: row.category_id || "",
    subcategory: row.subcategory || "",
    clientType: row.client_type || "particular",
    country: row.country || "",
    region: row.region || "",
    city: row.city || "",
    postalCode: row.postal_code || "",
    distanceKm: row.distance_km == null ? null : Number(row.distance_km),
    description: row.description || "",
    urgency: row.urgency || "flexible",
    budgetRange: row.budget_range || "",
    propertyType: row.property_type || "",
    locale: row.locale || "es",
    qualityScore: Number(row.quality_score || 0),
    maxProfessionals: Number(row.max_professionals || 4),
    unlockedCount: Number(row.unlocked_count || 0),
    remainingSlots: Math.max(0, Number(row.max_professionals || 4) - Number(row.unlocked_count || 0)),
    price: Number(row.lead_price || 0),
    currency: row.lead_currency || leadCurrency(row.country),
    unlocked,
    unlockId: row.unlock_id || null,
    unlockStatus: row.unlock_status || null,
    contact: unlocked ? {
      name: row.contact_name || "",
      email: row.contact_email || "",
      phone: row.contact_phone || "",
    } : null,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

export async function onRequestGet(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const access = await getSubscriptionAccess(context.env, current.user.id);
  const preferences = await context.env.DB.prepare(
    "SELECT * FROM professional_lead_preferences WHERE professional_id = ?",
  ).bind(current.professional.id).first();
  const categories = preferences
    ? safeJsonArray(preferences.categories)
    : (await context.env.DB.prepare(
        "SELECT category_id FROM professional_categories WHERE professional_id = ?",
      ).bind(current.professional.id).all()).results?.map((row: any) => row.category_id) || [];
  const countries = preferences
    ? safeJsonArray(preferences.countries)
    : [current.professional.country].filter(Boolean);

  const rows = await context.env.DB.prepare(
    `SELECT project.*,
       match.score AS match_score,
       unlock.id AS unlock_id,
       unlock.status AS unlock_status,
       CASE WHEN unlock.id IS NULL THEN NULL ELSE project.contact_name END AS contact_name,
       CASE WHEN unlock.id IS NULL THEN NULL ELSE project.contact_email END AS contact_email,
       CASE WHEN unlock.id IS NULL THEN NULL ELSE project.contact_phone END AS contact_phone
     FROM project_requests project
     JOIN match_candidates match
       ON match.project_id = project.id AND match.professional_id = ?
     LEFT JOIN lead_unlocks unlock
       ON unlock.lead_id = project.id AND unlock.professional_id = ?
     WHERE project.status IN ('published','active','matched')
       AND (project.expires_at IS NULL OR project.expires_at > datetime('now'))
     ORDER BY unlock.id IS NOT NULL DESC, match.score DESC, project.created_at DESC
     LIMIT 100`,
  ).bind(current.professional.id, current.professional.id).all();

  const leads = (rows.results || [])
    .filter((row: any) => !countries.length || countries.includes(row.country))
    .filter((row: any) => !categories.length || categories.includes(row.category_id))
    .map((row: any) => {
      const pricing = getLeadPrice({
        countryCode: row.country,
        categoryId: row.category_id,
        budgetRange: row.budget_range,
        urgency: row.urgency,
        clientType: row.client_type,
      });
      return mapLead({ ...row, lead_price: pricing.amount, lead_currency: pricing.currency });
    });
  const currency = leadCurrency(current.professional.country || countries[0] || "ES");
  const balance = await context.env.DB.prepare(
    "SELECT * FROM lead_balances WHERE user_id = ? AND currency = ?",
  ).bind(current.user.id, currency).first();

  return privateJson({
    subscriptionRequired: !access.active,
    subscriptionStatus: access.subscription?.status || "no_subscription",
    leads,
    balance: {
      currency,
      promotional: Number(balance?.promotional_balance || 0),
      paid: Number(balance?.paid_balance || 0),
      reserved: Number(balance?.reserved_balance || 0),
      available: Number(balance?.promotional_balance || 0) + Number(balance?.paid_balance || 0)
        - Number(balance?.reserved_balance || 0),
    },
  });
}

export async function onRequestPost(context: any) {
  const current = await getCurrentProfessional(context.env, context.request);
  if (current instanceof Response) return current;
  const access = await getSubscriptionAccess(context.env, current.user.id);
  if (!access.active) return bad("subscription_required", 402);

  let body: any;
  try { body = await context.request.json(); } catch { return bad("invalid_json"); }
  const leadId = String(body.leadId || "").trim();
  if (!leadId) return bad("missing_lead");

  const lead = await context.env.DB.prepare(
    `SELECT project.*
     FROM project_requests project
     JOIN match_candidates match
       ON match.project_id = project.id AND match.professional_id = ?
     WHERE project.id = ?
       AND project.status IN ('published','active','matched')
       AND (project.expires_at IS NULL OR project.expires_at > datetime('now'))
     LIMIT 1`,
  ).bind(current.professional.id, leadId).first();
  if (!lead) return bad("lead_unavailable", 404);

  const pricing = getLeadPrice({
    countryCode: lead.country,
    categoryId: lead.category_id,
    budgetRange: lead.budget_range,
    urgency: lead.urgency,
    clientType: lead.client_type,
  });
  const existing = await context.env.DB.prepare(
    "SELECT id FROM lead_unlocks WHERE lead_id = ? AND professional_id = ?",
  ).bind(leadId, current.professional.id).first();
  if (existing) return privateJson({ ok: true, alreadyUnlocked: true, lead: mapLead({ ...lead, unlock_id: existing.id, lead_price: pricing.amount, lead_currency: pricing.currency }) });

  await context.env.DB.prepare(
    `INSERT OR IGNORE INTO lead_balances
      (user_id,currency,promotional_balance,paid_balance,reserved_balance)
     VALUES (?,?,0,0,0)`,
  ).bind(current.user.id, pricing.currency).run();

  const unlockId = newId("unlock_");
  const contactSnapshot = JSON.stringify({
    name: lead.contact_name || "",
    email: lead.contact_email || "",
    phone: lead.contact_phone || "",
    capturedAt: new Date().toISOString(),
  });
  const statements = await context.env.DB.batch([
    context.env.DB.prepare(
      `INSERT INTO lead_unlocks
        (id,lead_id,professional_id,user_id,price,currency,country_code,status,contact_data_snapshot,tax_info)
       SELECT ?,?,?,?,?,?,?, 'unlocked', ?, ?
       WHERE EXISTS (
         SELECT 1 FROM project_requests
         WHERE id = ? AND unlocked_count < max_professionals
           AND status IN ('published','active','matched')
           AND (expires_at IS NULL OR expires_at > datetime('now'))
       )
       AND EXISTS (
         SELECT 1 FROM lead_balances
         WHERE user_id = ? AND currency = ?
           AND promotional_balance + paid_balance - reserved_balance >= ?
       )`,
    ).bind(
      unlockId,
      leadId,
      current.professional.id,
      current.user.id,
      pricing.amount,
      pricing.currency,
      lead.country,
      contactSnapshot,
      JSON.stringify({ countryCode: lead.country, currency: pricing.currency }),
      leadId,
      current.user.id,
      pricing.currency,
      pricing.amount,
    ),
    context.env.DB.prepare(
      `UPDATE lead_balances
       SET promotional_balance = MAX(0, promotional_balance - ?),
           paid_balance = paid_balance - MAX(0, ? - promotional_balance),
           updated_at = datetime('now')
       WHERE user_id = ? AND currency = ?
         AND EXISTS (SELECT 1 FROM lead_unlocks WHERE id = ?)`,
    ).bind(pricing.amount, pricing.amount, current.user.id, pricing.currency, unlockId),
    context.env.DB.prepare(
      `UPDATE project_requests
       SET unlocked_count = unlocked_count + 1,
           status = CASE WHEN unlocked_count + 1 >= max_professionals THEN 'matched' ELSE status END
       WHERE id = ? AND unlocked_count < max_professionals
         AND EXISTS (SELECT 1 FROM lead_unlocks WHERE id = ?)`,
    ).bind(leadId, unlockId),
    context.env.DB.prepare(
      `INSERT INTO lead_balance_transactions
        (id,user_id,currency,amount,balance_type,transaction_type,reference_type,reference_id,description)
       SELECT ?,?,?,?,'mixed','debit','lead_unlock',?,'Contact unlock'
       WHERE EXISTS (SELECT 1 FROM lead_unlocks WHERE id = ?)`,
    ).bind(newId("lead_tx_"), current.user.id, pricing.currency, -pricing.amount, unlockId, unlockId),
    context.env.DB.prepare(
      `INSERT INTO quote_requests
        (id,professional_id,category_id,client_name,client_email,client_phone,country,region,city,latitude,longitude,radius_km,description,budget_range,urgency,status)
       SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'new'
       WHERE EXISTS (SELECT 1 FROM lead_unlocks WHERE id = ?)`,
    ).bind(
      newId("qr_"),
      current.professional.id,
      lead.category_id,
      lead.contact_name || "Client",
      lead.contact_email || "",
      lead.contact_phone || "",
      lead.country,
      lead.region || "",
      lead.city,
      lead.latitude,
      lead.longitude,
      lead.radius_km || 25,
      lead.description,
      lead.budget_range || "",
      lead.urgency || "flexible",
      unlockId,
    ),
  ]);

  const inserted = Number((statements[0] as any)?.meta?.changes || 0) > 0;
  if (!inserted) {
    const fresh = await context.env.DB.prepare(
      "SELECT unlocked_count,max_professionals FROM project_requests WHERE id = ?",
    ).bind(leadId).first();
    if (Number(fresh?.unlocked_count || 0) >= Number(fresh?.max_professionals || 4)) return bad("lead_full", 409);
    return bad("insufficient_balance", 402);
  }

  return privateJson({
    ok: true,
    unlockId,
    price: pricing.amount,
    currency: pricing.currency,
    contact: {
      name: lead.contact_name || "",
      email: lead.contact_email || "",
      phone: lead.contact_phone || "",
    },
  }, 201);
}
