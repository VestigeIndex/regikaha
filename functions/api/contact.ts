import { bad, isEmail, json } from "../../apilib/http";
import { newId } from "../../apilib/auth";
import { configuredLimit, consumePersistentQuota, requireTurnstile } from "../../packages/cost-guards";
import { sendEmail } from "../../lib/notifications/email";
import { isLocale } from "../../lib/i18n/config";

function clean(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let body: any;
  try { body = await request.json(); } catch { return bad("JSON inválido"); }
  if (clean(body.website, 200)) return bad("Solicitud no válida");
  const challenge = await requireTurnstile(env, request, body.turnstileToken, "contact");
  if (challenge) return challenge;

  const name = clean(body.name, 120);
  const email = clean(body.email, 160).toLowerCase();
  const subject = clean(body.subject, 160);
  const message = clean(body.message, 3000);
  const locale = isLocale(String(body.locale || "")) ? String(body.locale) : "es";
  if (name.length < 2 || !isEmail(email) || subject.length < 2 || message.length < 10) {
    return bad("Datos de contacto no válidos");
  }

  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const quota = await consumePersistentQuota(env, `contact:ip:${ip}`, configuredLimit(env, "MAX_EMAILS_PER_IP_DAY"), "day");
  if (!quota.allowed) return bad("Has alcanzado el límite diario de mensajes", 429);

  const id = newId("contact_");
  await env.DB.prepare(
    "INSERT INTO contact_messages (id,name,email,subject,message,locale,status) VALUES (?,?,?,?,?,?,'new')",
  ).bind(id, name, email, subject, message, locale).run();

  await sendEmail(env, {
    to: { email: "help@regikaha.com", name: "RegiKaha" },
    subject: `[Contacto] ${subject}`,
    text: `Nombre: ${name}\nEmail: ${email}\nIdioma: ${locale}\n\n${message}`,
    tags: { type: "contact_form" },
  });
  return json({ ok: true, id }, 201);
}
