import { json, bad, isEmail, sessionCookie, getSessionUser } from "../../apilib/http";
import { hashPassword, createSession, newId, slugify } from "../../apilib/auth";

// POST /api/register — crea cuenta (email+contraseña) + perfil profesional pendiente.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const sessionUser = await getSessionUser(env, request);
  const email = String(b.email || sessionUser?.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const publicName = String(b.publicName || "").trim();
  const country = String(b.country || "").trim().toUpperCase();
  const region = String(b.region || "").trim();
  const city = String(b.city || "").trim();
  const type = String(b.type || "autonomo");
  const categories: string[] = Array.isArray(b.categories) ? b.categories.slice(0, 8).map(String) : [];

  if (!isEmail(email)) return bad("Email no válido");
  if (!sessionUser && password.length < 8) return bad("La contraseña debe tener al menos 8 caracteres");
  if (!publicName) return bad("Falta el nombre comercial");
  if (!country) return bad("Falta el país de actividad");

  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists && (!sessionUser || exists.id !== sessionUser.id)) return bad("Ya existe una cuenta con ese email", 409);
  if (sessionUser) {
    const existingProfile = await env.DB.prepare("SELECT id,slug,public_name FROM professionals WHERE user_id = ?")
      .bind(sessionUser.id)
      .first();
    if (existingProfile) {
      return json({ ok: true, professional: existingProfile }, 200);
    }
  }

  const userId = sessionUser?.id || newId("usr_");
  const proId = newId("pro_");
  const slug = `${slugify(publicName) || "profesional"}-${proId.slice(-6)}`;
  const langs = JSON.stringify(Array.isArray(b.languages) ? b.languages : []);
  const typeLabel: Record<string, string> = {
    empresa_reformas: "Empresa de reformas",
    autonomo: "Autónomo especializado",
    instalador: "Instalador autorizado",
    estudio_arquitectura: "Estudio de arquitectura",
    ingenieria: "Ingeniería / peritación",
    multiservicio: "Empresa multiservicio",
  };
  const seoTitle = `${publicName} - profesional verificado en ${city || country} | RegiKaha`;
  const seoDescription = String(b.tagline || b.description || "").trim().slice(0, 160);

  const stmts = [];
  if (!sessionUser) {
    const pwHash = await hashPassword(password);
    stmts.push(env.DB.prepare("INSERT INTO users (id,email,password_hash,role) VALUES (?,?,?,'professional')").bind(userId, email, pwHash));
  }
  stmts.push(
    env.DB.prepare(
      `INSERT INTO professionals
        (id,user_id,slug,type,type_label,public_name,legal_name,nif_cif,country,region,city,phone,years_experience,languages,
         description,short_tagline,insurance_declared,invoice_declared,offers_urgent,seo_title,seo_description,verification_status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending')`,
    ).bind(
      proId, userId, slug, type, typeLabel[type] || "Profesional", publicName, String(b.legalName || ""), String(b.nifCif || ""),
      country, region, city, String(b.phone || ""), Number(b.yearsExperience) || 0, langs,
      String(b.description || ""), String(b.tagline || ""), b.insuranceDeclared ? 1 : 0,
      b.invoiceDeclared ? 1 : 0, b.offersUrgent ? 1 : 0, seoTitle, seoDescription,
    ),
  );
  for (const c of categories) {
    stmts.push(env.DB.prepare("INSERT OR IGNORE INTO professional_categories (professional_id,category_id) VALUES (?,?)").bind(proId, c));
  }
  const areas = Array.isArray(b.areas) && b.areas.length ? b.areas.slice(0, 80) : [{ country, region, city }];
  for (const area of areas) {
    stmts.push(env.DB.prepare("INSERT INTO service_areas (id,professional_id,country,region,city) VALUES (?,?,?,?,?)")
      .bind(newId("area_"), proId, String(area.country || country).toUpperCase(), String(area.region || region), String(area.city || city)));
  }

  await env.DB.batch(stmts);
  const { token, maxAge } = await createSession(env, userId);
  return json(
    { ok: true, professional: { id: proId, slug, publicName, verificationStatus: "pending" } },
    201,
    { "Set-Cookie": sessionCookie(token, maxAge) },
  );
}
