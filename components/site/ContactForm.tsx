"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-forest-500/12 text-forest-600">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="mt-4 font-semibold text-ink">Mensaje enviado</h2>
        <p className="mt-1.5 text-sm text-muted">Gracias por escribirnos. Te responderemos lo antes posible.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="card p-6 sm:p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nombre</span>
          <input className="reg-input mt-1.5" placeholder="Tu nombre" required />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
          <input type="email" className="reg-input mt-1.5" placeholder="tu@email.com" required />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Asunto</span>
        <select className="reg-input mt-1.5" defaultValue="">
          <option value="" disabled>Selecciona…</option>
          <option>Soy cliente y tengo una duda</option>
          <option>Soy profesional y quiero unirme</option>
          <option>Verificación o incidencia</option>
          <option>Prensa o colaboración</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Mensaje</span>
        <textarea className="reg-input mt-1.5 resize-none" rows={5} placeholder="¿En qué podemos ayudarte?" required />
      </label>
      <button type="submit" className="btn btn-primary w-full">
        <Send size={16} /> Enviar mensaje
      </button>
    </form>
  );
}
