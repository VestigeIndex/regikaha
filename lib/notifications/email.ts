type EmailRecipient = { email: string; name?: string };

export type EmailMessage = {
  to: EmailRecipient;
  replyTo?: EmailRecipient;
  subject: string;
  text: string;
  html?: string;
  tags?: Record<string, string>;
};

export type NotificationEnv = {
  RESEND_API_KEY?: string;
  MAILCHANNELS_ENABLED?: string;
  FROM_EMAIL?: string;
  REPLY_TO_EMAIL?: string;
};

function safeName(value?: string) {
  return String(value || "")
    .replace(/[\r\n<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function formatRecipient(recipient: EmailRecipient): string {
  const email = String(recipient.email || "").trim();
  const name = safeName(recipient.name);
  return name ? `${name} <${email}>` : email;
}

function parseFrom(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (!match) return { email: value.trim(), name: "Regi Kaha" };
  return { email: match[2].trim(), name: safeName(match[1]) || "Regi Kaha" };
}

async function sendWithMailChannels(from: string, replyTo: string, message: EmailMessage) {
  return fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: message.to.email, name: message.to.name }] }],
      from: parseFrom(from),
      reply_to: parseFrom(replyTo),
      subject: message.subject,
      content: [
        { type: "text/plain", value: message.text },
        ...(message.html ? [{ type: "text/html", value: message.html }] : []),
      ],
    }),
  });
}

export async function sendEmail(env: NotificationEnv, message: EmailMessage): Promise<{ ok: boolean; provider: string }> {
  const from = env.FROM_EMAIL || "Regi Kaha <no-reply@regikaha.com>";
  const replyTo = message.replyTo ? formatRecipient(message.replyTo) : env.REPLY_TO_EMAIL || "help@regikaha.com";

  if (env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [formatRecipient(message.to)],
        reply_to: replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
        tags: message.tags
          ? Object.entries(message.tags).map(([name, value]) => ({ name, value }))
          : undefined,
      }),
    });
    if (!res.ok) {
      console.warn("Regi Kaha Resend delivery failed", {
        status: res.status,
        tags: message.tags,
      });
      if (env.MAILCHANNELS_ENABLED === "true") {
        const fallback = await sendWithMailChannels(from, replyTo, message);
        if (!fallback.ok) {
          console.warn("Regi Kaha MailChannels fallback delivery failed", {
            status: fallback.status,
            tags: message.tags,
          });
        }
        return { ok: fallback.ok, provider: "mailchannels" };
      }
    }
    return { ok: res.ok, provider: "resend" };
  }

  if (env.MAILCHANNELS_ENABLED === "true") {
    const res = await sendWithMailChannels(from, replyTo, message);
    if (!res.ok) {
      console.warn("Regi Kaha MailChannels delivery failed", {
        status: res.status,
        tags: message.tags,
      });
    }
    return { ok: res.ok, provider: "mailchannels" };
  }

  console.info("Regi Kaha email noop", {
    tags: message.tags,
  });
  return { ok: true, provider: "noop" };
}

export function subscriptionEndingMessage(params: { email: string; name?: string; plan: string; endDate: string; price: string }): EmailMessage {
  const name = safeName(params.name);
  const greeting = name ? `Hola ${name},` : "Hola,";
  return {
    to: { email: params.email, name },
    subject: "Tu periodo promocional de Regi Kaha termina pronto",
    text: `${greeting}

Tu periodo promocional termina el ${params.endDate}. Para seguir recibiendo solicitudes y mantener tu perfil activo, necesitarás mantener un plan ${params.plan} por ${params.price}.

Si la suscripción no está activa, Regi Kaha puede limitar el acceso comercial sin borrar tu perfil, portfolio ni reseñas.`,
    tags: { type: "subscription_trial_notice" },
  };
}

export function verificationEmailMessage(params: { email: string; name?: string; verifyUrl: string }): EmailMessage {
  const name = safeName(params.name);
  const greeting = name ? `Hola ${name},` : "Hola,";
  const verifyUrl = safeUrl(params.verifyUrl);
  return {
    to: { email: params.email, name },
    subject: "Verifica tu email en Regi Kaha",
    text: `${greeting}\n\nConfirma tu email para activar las funciones profesionales de Regi Kaha:\n${verifyUrl}\n\nSi no has creado esta cuenta, ignora este mensaje.`,
    html: `<p>${escapeHtml(greeting)}</p><p>Confirma tu email para activar las funciones profesionales de Regi Kaha.</p><p><a href="${escapeHtml(verifyUrl)}">Verificar email</a></p><p>Si no has creado esta cuenta, ignora este mensaje.</p>`,
    tags: { type: "email_verification" },
  };
}
