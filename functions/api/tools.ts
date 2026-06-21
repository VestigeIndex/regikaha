import { bad, privateJson, requireRole } from "../../apilib/http";
import { newId } from "../../apilib/auth";

const offeringRoles = ["professional", "company", "subcontractor", "admin", "superadmin"];
const priorities = new Set(["low", "normal", "high"]);
const taskStatuses = new Set(["open", "done"]);

function clean(value: unknown, max = 500): string {
  return String(value || "").trim().slice(0, max);
}

function lineItems(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 30).map((item: any) => ({
    description: clean(item?.description, 160),
    quantity: Math.max(0, Number(item?.quantity || 0)),
    unitPrice: Math.max(0, Number(item?.unitPrice || 0)),
  })).filter((item) => item.description);
}

export async function onRequestGet(context: any) {
  const user = await requireRole(context.env, context.request, offeringRoles);
  if (user instanceof Response) return user;
  const [tasks, templates, profile, professional] = await Promise.all([
    context.env.DB.prepare(
      "SELECT * FROM business_tasks WHERE user_id = ? ORDER BY status ASC, due_date IS NULL, due_date ASC, created_at DESC LIMIT 200",
    ).bind(user.id).all(),
    context.env.DB.prepare(
      "SELECT * FROM estimate_templates WHERE user_id = ? ORDER BY name COLLATE NOCASE LIMIT 100",
    ).bind(user.id).all(),
    context.env.DB.prepare("SELECT country FROM profiles WHERE user_id = ?").bind(user.id).first(),
    context.env.DB.prepare("SELECT country FROM professionals WHERE user_id = ?").bind(user.id).first(),
  ]);
  return privateJson({
    tasks: tasks.results || [],
    templates: (templates.results || []).map((template: any) => ({
      ...template,
      line_items: (() => { try { return JSON.parse(template.line_items || "[]"); } catch { return []; } })(),
    })),
    context: { country: professional?.country || profile?.country || "ES", role: user.role },
  });
}

export async function onRequestPost(context: any) {
  const user = await requireRole(context.env, context.request, offeringRoles);
  if (user instanceof Response) return user;
  let body: any;
  try { body = await context.request.json(); } catch { return bad("JSON inválido"); }
  const action = clean(body.action, 40);

  if (action === "task.create") {
    const title = clean(body.title, 180);
    if (title.length < 3) return bad("Añade un título a la tarea");
    const id = newId("task_");
    const priority = priorities.has(String(body.priority)) ? String(body.priority) : "normal";
    await context.env.DB.prepare(
      "INSERT INTO business_tasks (id,user_id,title,due_date,priority,status,related_type,related_id) VALUES (?,?,?,?,?,'open',?,?)",
    ).bind(id, user.id, title, clean(body.dueDate, 20) || null, priority, clean(body.relatedType, 40) || null, clean(body.relatedId, 120) || null).run();
    return privateJson({ ok: true, id }, 201);
  }

  if (action === "task.update") {
    const id = clean(body.id, 120);
    const status = taskStatuses.has(String(body.status)) ? String(body.status) : "open";
    const priority = priorities.has(String(body.priority)) ? String(body.priority) : "normal";
    await context.env.DB.prepare(
      "UPDATE business_tasks SET title = COALESCE(NULLIF(?,''),title), due_date = ?, priority = ?, status = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
    ).bind(clean(body.title, 180), clean(body.dueDate, 20) || null, priority, status, id, user.id).run();
    return privateJson({ ok: true });
  }

  if (action === "task.delete") {
    await context.env.DB.prepare("DELETE FROM business_tasks WHERE id = ? AND user_id = ?")
      .bind(clean(body.id, 120), user.id).run();
    return privateJson({ ok: true });
  }

  if (action === "template.create") {
    const name = clean(body.name, 120);
    if (name.length < 3) return bad("Añade un nombre a la plantilla");
    const id = newId("tpl_");
    const items = lineItems(body.lineItems);
    const vatRate = Math.max(0, Math.min(100, Number(body.vatRate || 0)));
    await context.env.DB.prepare(
      "INSERT INTO estimate_templates (id,user_id,name,summary,line_items,vat_rate) VALUES (?,?,?,?,?,?)",
    ).bind(id, user.id, name, clean(body.summary, 1200), JSON.stringify(items), vatRate).run();
    return privateJson({ ok: true, id }, 201);
  }

  if (action === "template.delete") {
    await context.env.DB.prepare("DELETE FROM estimate_templates WHERE id = ? AND user_id = ?")
      .bind(clean(body.id, 120), user.id).run();
    return privateJson({ ok: true });
  }

  return bad("Acción no reconocida");
}
