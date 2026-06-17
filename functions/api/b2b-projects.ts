import { json, bad, isEmail } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { isActiveCountryCode } from "../../lib/market";

function clean(value: unknown, max = 600): string {
  return String(value || "").trim().slice(0, max);
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const email = clean(b.email, 160).toLowerCase();
  const country = clean(b.country, 4).toUpperCase();
  const city = clean(b.city, 120);
  const requiredSpecialty = clean(b.requiredSpecialty || b.categoryId, 120);
  const description = clean(b.description, 2400);
  if (clean(b.website, 200)) return bad("Solicitud no válida");
  if (!isEmail(email)) return bad("Email de empresa no válido");
  if (!country || !city || !requiredSpecialty) return bad("Faltan país, ciudad o especialidad");
  if (!isActiveCountryCode(country)) return bad("País no disponible todavía en RegiKaha");
  if (description.length < 20) return bad("Describe un poco más la necesidad de subcontrata");

  const requestId = newId("b2b_");
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO b2b_project_requests
        (id,company_type,country,city,required_specialty,project_type,start_date,duration,team_size,required_documents,description,budget_range,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'published')`,
    ).bind(
      requestId,
      clean(b.companyType, 120),
      country,
      city,
      requiredSpecialty,
      clean(b.projectType, 120),
      clean(b.startDate, 40),
      clean(b.duration, 80),
      clean(b.teamSize, 80),
      JSON.stringify(Array.isArray(b.requiredDocuments) ? b.requiredDocuments.slice(0, 20).map(String) : []),
      description,
      clean(b.budgetRange, 80),
    ),
    env.DB.prepare(
      `INSERT INTO growth_tasks (id,type,country,city,category_id,priority,status,prompt)
       VALUES (?,?,?,?,?,1,'open',?)`,
    ).bind(
      newId("gt_"),
      "captar_subcontratas",
      country,
      city,
      requiredSpecialty,
      `Buscar subcontratas de ${requiredSpecialty} en ${city}, ${country}. Hay una necesidad B2B real y conviene contactar empresas fundadoras con documentación verificable.`,
    ),
  ]);

  return json({ ok: true, requestId }, 201);
}
