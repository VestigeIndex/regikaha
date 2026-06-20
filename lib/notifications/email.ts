type EmailRecipient = { email: string; name?: string };

export type EmailMessage = {
  to: EmailRecipient;
  subject: string;
  text: string;
  html?: string;
  tags?: Record<string, string>;
};

export type NotificationEnv = {
  RESEND_API_KEY?: string;
  MAILCHANNELS_ENABLED?: string;
  FROM_EMAIL?: string;
};

export async function sendEmail(env: NotificationEnv, message: EmailMessage): Promise<{ ok: boolean; provider: string }> {
  const from = env.FROM_EMAIL || "RegiKaha <help@regikaha.com>";

  if (env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to.name ? `${message.to.name} <${message.to.email}>` : message.to.email],
        subject: message.subject,
        text: message.text,
        html: message.html,
        tags: message.tags
          ? Object.entries(message.tags).map(([name, value]) => ({ name, value }))
          : undefined,
      }),
    });
    return { ok: res.ok, provider: "resend" };
  }

  if (env.MAILCHANNELS_ENABLED === "true") {
    const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: message.to.email, name: message.to.name }] }],
        from: { email: from.includes("<") ? from.match(/<([^>]+)>/)?.[1] : from, name: "RegiKaha" },
        subject: message.subject,
        content: [
          { type: "text/plain", value: message.text },
          ...(message.html ? [{ type: "text/html", value: message.html }] : []),
        ],
      }),
    });
    return { ok: res.ok, provider: "mailchannels" };
  }

  console.info("RegiKaha email noop", {
    tags: message.tags,
  });
  return { ok: true, provider: "noop" };
}

export function subscriptionEndingMessage(params: { email: string; name?: string; plan: string; endDate: string; price: string }): EmailMessage {
  const greeting = params.name ? `Hola ${params.name},` : "Hola,";
  return {
    to: { email: params.email, name: params.name },
    subject: "Tu periodo promocional de RegiKaha termina pronto",
    text: `${greeting}

Tu periodo promocional termina el ${params.endDate}. Para seguir recibiendo solicitudes y mantener tu perfil activo, necesitarás mantener un plan ${params.plan} por ${params.price}.

Si la suscripción no está activa, RegiKaha puede limitar el acceso comercial sin borrar tu perfil, portfolio ni reseñas.`,
    tags: { type: "subscription_trial_notice" },
  };
}

export function verificationEmailMessage(params: { email: string; name?: string; verifyUrl: string }): EmailMessage {
  const greeting = params.name ? `Hola ${params.name},` : "Hola,";
  return {
    to: { email: params.email, name: params.name },
    subject: "Verifica tu email en RegiKaha",
    text: `${greeting}\n\nConfirma tu email para activar las funciones profesionales de RegiKaha:\n${params.verifyUrl}\n\nSi no has creado esta cuenta, ignora este mensaje.`,
    html: `<p>${greeting}</p><p>Confirma tu email para activar las funciones profesionales de RegiKaha.</p><p><a href="${params.verifyUrl}">Verificar email</a></p><p>Si no has creado esta cuenta, ignora este mensaje.</p>`,
    tags: { type: "email_verification" },
  };
}
