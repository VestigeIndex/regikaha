import { privateJson, bad, isEmail, sessionCookieHeaders, getSessionUser } from "../../apilib/http";
import { hashPassword, createSession, newId, slugify } from "../../apilib/auth";
import { normalizeRole, panelPathForRole } from "../../lib/accounts";
import { hashContractSnapshot } from "../../lib/legal/hashContract";
import { sendEmail, verificationEmailMessage } from "../../lib/notifications/email";
import { requireTurnstile } from "../../packages/cost-guards";
import { logError } from "../../lib/observability";
import { logAudit } from "../../apilib/audit";

function clean(value: unknown, max = 600): string {
  return String(value || "").trim().slice(0, max);
}

function coordinate(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function billingRedirect(body: any, role: string, verifyEmail: boolean) {
  if (role === "client") return panelPathForRole(role as any);
  const plan = body.plan === "europa_pro" ? "europa_pro" : "autonomo_nacional";
  const interval = body.interval === "yearly" ? "yearly" : "monthly";
  const founder = body.founderIntent === true || String(body.founder || "") === "true";
  const params = new URLSearchParams({ plan, interval });
  if (founder) params.set("founder", "true");
  if (verifyEmail) params.set("verifyEmail", "true");
  return `/suscripcion/confirmar?${params.toString()}`;
}

async function createVerification(env: any) {
  const rawToken = `${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g, "")}`;
  return { rawToken, tokenHash: await hashContractSnapshot({ token: rawToken }) };
}

async function sendVerification(env: any, request: Request, params: { email: string; name?: string; rawToken: string }) {
  const origin = String(env.NEXT_PUBLIC_SITE_URL || request.headers.get("Origin") || new URL(request.url).origin).replace(/\/$/, "");
  const verifyUrl = `${origin}/verificar-email?token=${encodeURIComponent(params.rawToken)}`;
  return sendEmail(env, verificationEmailMessage({ email: params.email, name: params.name, verifyUrl }));
}

// POST /api/register — crea cuenta (email+contraseña) + perfil profesional pendiente.
export async function onRequestPost(context: any) {
  const { request, env } = context;
  let b: any;
  try { b = await request.json(); } catch { return bad("JSON inválido"); }

  const sessionUser = await getSessionUser(env, request);
  const role = normalizeRole(b.role || b.accountRole || "professional", "professional");
  const email = String(b.email || sessionUser?.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const publicName = String(b.publicName || "").trim();
  const country = String(b.country || "").trim().toUpperCase();
  const region = String(b.region || "").trim();
  const city = String(b.city || "").trim();
  const type = String(b.type || "autonomo");
  const categories: string[] = Array.isArray(b.categories) ? b.categories.slice(0, 8).map(String) : [];

  if (clean(b.website, 200)) return bad("Solicitud no válida");
  const challenge = await requireTurnstile(
    env,
    request,
    b.turnstileToken,
    role === "professional" ? "register_professional" : "register_account",
  );
  if (challenge) return challenge;
  if (!isEmail(email)) return bad("Email no válido");
  if (!sessionUser && password.length < 8) return bad("La contraseña debe tener al menos 8 caracteres");
  if (role !== "professional") {
    if (!String(b.acceptsTerms || "").trim() && b.acceptsTerms !== true) return bad("Debes aceptar las condiciones");
    const name = String(b.name || b.displayName || "").trim();
    if (!name) return bad("Falta el nombre");
    const userId = sessionUser?.id || newId("usr_");
    const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (exists && (!sessionUser || exists.id !== sessionUser.id)) return bad("Ya existe una cuenta con ese email", 409);
    const stmts = [];
    const verification = sessionUser ? null : await createVerification(env);
    if (!sessionUser) {
      const pwHash = await hashPassword(password);
      stmts.push(env.DB.prepare("INSERT INTO users (id,email,password_hash,role,verify_token) VALUES (?,?,?,?,?)").bind(userId, email, pwHash, role, verification!.tokenHash));
    }
    if (stmts.length) await env.DB.batch(stmts);
    if (verification) await sendVerification(env, request, { email, name, rawToken: verification.rawToken });
    try {
      await env.DB.prepare(
        `INSERT OR REPLACE INTO profiles
          (user_id,role,status,display_name,contact_name,country,region,city,place_id,place_slug,latitude,longitude,phone,email_verified,onboarding_completed,updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`,
      ).bind(
          userId,
          role,
          role === "client" ? "active" : "draft",
          String(b.displayName || name),
          name,
          String(b.country || "").toUpperCase(),
          String(b.region || ""),
          String(b.city || ""),
          String(b.placeId || ""),
          String(b.placeSlug || ""),
          coordinate(b.latitude ?? b.placeLatitude),
          coordinate(b.longitude ?? b.placeLongitude),
          String(b.phone || ""),
          0,
          0,
      ).run();
    } catch (error) {
      // En entornos sin migración de profiles aplicada, la cuenta de usuario sigue siendo válida.
      logError("register.profileInsert", error, { userId, role });
    }
    const { token, maxAge } = await createSession(env, userId);
    if (!sessionUser) await logAudit(env, { userId, action: "register", meta: { role }, request });
    return privateJson(
      {
        ok: true,
        user: { id: userId, email, role },
        emailVerificationRequired: !!verification,
        redirectTo: billingRedirect(b, role, !!verification),
      },
      201,
      sessionCookieHeaders(token, maxAge, request),
    );
  }
  if (!publicName) return bad("Falta el nombre comercial");
  if (!country) return bad("Falta el país de actividad");

  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists && (!sessionUser || exists.id !== sessionUser.id)) return bad("Ya existe una cuenta con ese email", 409);
  if (sessionUser) {
    const existingProfile = await env.DB.prepare("SELECT id,slug,public_name FROM professionals WHERE user_id = ?")
      .bind(sessionUser.id)
      .first();
    if (existingProfile) {
      return privateJson({ ok: true, professional: existingProfile }, 200);
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
  const seoTitle = `${publicName} - profesional en ${city || country} | Regi Kaha`;
  const seoDescription = String(b.tagline || b.description || "").trim().slice(0, 160);

  const stmts = [];
  const verification = sessionUser ? null : await createVerification(env);
  if (!sessionUser) {
    const pwHash = await hashPassword(password);
    stmts.push(env.DB.prepare("INSERT INTO users (id,email,password_hash,role,verify_token) VALUES (?,?,?,'professional',?)").bind(userId, email, pwHash, verification!.tokenHash));
  }
  stmts.push(
    env.DB.prepare(
      `INSERT INTO professionals
        (id,user_id,slug,type,type_label,public_name,legal_name,nif_cif,country,region,city,latitude,longitude,phone,years_experience,languages,
         description,short_tagline,service_area_note,insurance_declared,invoice_declared,docs_declared,offers_urgent,seo_title,seo_description,verification_status,active_status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',0)`,
    ).bind(
      proId, userId, slug, type, typeLabel[type] || "Profesional", publicName, String(b.legalName || ""), String(b.nifCif || ""),
      country, region, city, coordinate(b.latitude ?? b.placeLatitude), coordinate(b.longitude ?? b.placeLongitude),
      String(b.phone || ""), Number(b.yearsExperience) || 0, langs,
      String(b.description || ""), String(b.tagline || ""), String(b.serviceArea || ""), b.insuranceDeclared ? 1 : 0,
      b.invoiceDeclared ? 1 : 0, b.docsDeclared ? 1 : 0, b.offersUrgent ? 1 : 0, seoTitle, seoDescription,
    ),
  );
  for (const c of categories) {
    stmts.push(env.DB.prepare("INSERT OR IGNORE INTO professional_categories (professional_id,category_id) VALUES (?,?)").bind(proId, c));
  }
  const areas = Array.isArray(b.areas) && b.areas.length ? b.areas.slice(0, 80) : [{ country, region, city }];
  for (const area of areas) {
    stmts.push(env.DB.prepare("INSERT INTO service_areas (id,professional_id,country,region,city,latitude,longitude) VALUES (?,?,?,?,?,?,?)")
      .bind(
        newId("area_"),
        proId,
        String(area.country || country).toUpperCase(),
        String(area.region || region),
        String(area.city || city),
        coordinate(area.latitude ?? b.latitude ?? b.placeLatitude),
        coordinate(area.longitude ?? b.longitude ?? b.placeLongitude),
      ));
  }

  await env.DB.batch(stmts);
  if (verification) await sendVerification(env, request, { email, name: publicName, rawToken: verification.rawToken });
  const { token, maxAge } = await createSession(env, userId);
  if (!sessionUser) await logAudit(env, { userId, action: "register", resourceType: "professional", resourceId: proId, meta: { role: "professional" }, request });
  return privateJson(
    {
      ok: true,
      professional: { id: proId, slug, publicName, verificationStatus: "pending", activeStatus: false },
      emailVerificationRequired: !!verification,
      redirectTo: billingRedirect(b, "professional", !!verification),
    },
    201,
    sessionCookieHeaders(token, maxAge, request),
  );
}
