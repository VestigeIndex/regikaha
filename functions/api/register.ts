import { json, bad, isEmail, sessionCookie } from "../../apilib/http";
import { hashPassword, createSession, newId, slugify } from "../../apilib/auth";

// POST /api/register — crea cuenta (email+contraseña) + perfil profesional pendiente.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const publicName = String(b.publicName || "").trim();
  const country = String(b.country || "").trim().toUpperCase();
  const region = String(b.region || "").trim();
  const city = String(b.city || "").trim();
  const type = String(b.type || "autonomo");
  const categories: string[] = Array.isArray(b.categories) ? b.categories.slice(0, 8).map(String) : [];

  if (!isEmail(email)) return bad("Email no válido");
  if (password.length < 8) return bad("La contraseña debe tener al menos 8 caracteres");
  if (!publicName) return bad("Falta el nombre comercial");
  if (!country) return bad("Falta el país de actividad");

  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists) return bad("Ya existe una cuenta con ese email", 409);

  const userId = newId("usr_");
  const proId = newId("pro_");
  const pwHash = await hashPassword(password);
  const slug = `${slugify(publicName) || "profesional"}-${proId.slice(-6)}`;
  const langs = JSON.stringify(Array.isArray(b.languages) ? b.languages : []);

  const stmts = [
    env.DB.prepare("INSERT INTO users (id,email,password_hash,role) VALUES (?,?,?,'professional')").bind(userId, email, pwHash),
    env.DB.prepare(
      `INSERT INTO professionals
        (id,user_id,slug,type,public_name,legal_name,nif_cif,country,region,city,phone,years_experience,languages,description,short_tagline,verification_status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending')`,
    ).bind(
      proId, userId, slug, type, publicName, String(b.legalName || ""), String(b.nifCif || ""),
      country, region, city, String(b.phone || ""), Number(b.yearsExperience) || 0, langs,
      String(b.description || ""), String(b.tagline || ""),
    ),
  ];
  for (const c of categories) {
    stmts.push(env.DB.prepare("INSERT OR IGNORE INTO professional_categories (professional_id,category_id) VALUES (?,?)").bind(proId, c));
  }
  stmts.push(env.DB.prepare("INSERT INTO service_areas (id,professional_id,country,region,city) VALUES (?,?,?,?,?)").bind(newId("area_"), proId, country, region, city));

  await env.DB.batch(stmts);
  const { token, maxAge } = await createSession(env, userId);
  return json(
    { ok: true, professional: { id: proId, slug, publicName, verificationStatus: "pending" } },
    201,
    { "Set-Cookie": sessionCookie(token, maxAge) },
  );
}
