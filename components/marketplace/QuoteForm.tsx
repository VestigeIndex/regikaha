"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

/**
 * Formulario de solicitud de presupuesto.
 *
 * En la fase inicial no envía a backend: valida en cliente y muestra el estado
 * de éxito. El handler `onSubmit` está aislado para conectarlo a un Worker /
 * D1 (tabla quote_requests) sin tocar la UI.
 */
export function QuoteForm({
  professionalName,
  serviceTitle,
  compact = false,
}: {
  professionalName: string;
  serviceTitle?: string;
  compact?: boolean;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: conectar a /api/quote-requests (Cloudflare Worker + D1).
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-forest-500/12 text-forest-600">
          <CheckCircle2 size={30} />
        </span>
        <h3 className="mt-4 font-semibold text-ink">Solicitud enviada</h3>
        <p className="mt-1.5 text-sm text-muted leading-relaxed">
          {professionalName} recibirá tu solicitud y te responderá lo antes posible. Te avisaremos por email.
        </p>
        <button onClick={() => setSent(false)} className="btn btn-secondary mt-5 text-sm">
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {serviceTitle && (
        <p className="text-xs text-muted">
          Solicitas presupuesto de <span className="font-medium text-ink">{serviceTitle}</span>
        </p>
      )}
      <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-3"}>
        <Input name="name" label="Nombre" placeholder="Tu nombre" required />
        <Input name="phone" label="Teléfono" placeholder="Para que te llamen" type="tel" />
      </div>
      <Input name="email" label="Email" placeholder="tu@email.com" type="email" required />
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">Cuéntanos tu proyecto</label>
        <textarea
          name="description"
          required
          rows={compact ? 3 : 4}
          placeholder="Describe brevemente qué necesitas, zona y plazos."
          className="mt-1.5 w-full rounded-xl bg-canvas px-3.5 py-3 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-forest-500 placeholder:text-muted resize-none"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        <Send size={16} /> Solicitar presupuesto
      </button>
      <p className="text-[0.7rem] text-muted text-center leading-relaxed">
        Gratis y sin compromiso. Al enviar aceptas la{" "}
        <a href="/legal/privacidad" className="underline hover:text-forest-700">política de privacidad</a>.
      </p>
    </form>
  );
}

function Input({
  name,
  label,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-forest-500 placeholder:text-muted"
      />
    </div>
  );
}
