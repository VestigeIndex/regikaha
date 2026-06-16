"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useT } from "@/lib/i18n/context";

/**
 * Formulario de solicitud de pre-presupuesto no vinculante.
 */
export function QuoteForm({
  professionalName,
  professionalId,
  categoryId,
  serviceId,
  serviceTitle,
  compact = false,
}: {
  professionalName: string;
  professionalId?: string;
  categoryId?: string;
  serviceId?: string | null;
  serviceTitle?: string;
  compact?: boolean;
}) {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
      const payload = {
      professionalId,
      categoryId,
      serviceId,
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      city: String(form.get("city") || ""),
      description: String(form.get("description") || ""),
      budgetRange: String(form.get("budgetRange") || ""),
      urgency: String(form.get("urgency") || "flexible"),
      website: String(form.get("website") || ""),
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.ui.quoteForm.unableToSend);
      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.ui.quoteForm.unableToSend);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-forest-500/12 text-forest-600">
          <CheckCircle2 size={30} />
        </span>
        <h3 className="mt-4 font-semibold text-ink">{t.ui.quoteForm.sentTitle}</h3>
        <p className="mt-1.5 text-sm text-muted leading-relaxed">
          {t.ui.quoteForm.sentTextPrefix}{professionalName}{t.ui.quoteForm.sentTextSuffix}
        </p>
        <button onClick={() => setSent(false)} className="btn btn-secondary mt-5 text-sm">
          {t.ui.quoteForm.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {serviceTitle && (
        <p className="text-xs text-muted">
          {t.ui.quoteForm.requesting} <span className="font-medium text-ink">{serviceTitle}</span>
        </p>
      )}
      <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-3"}>
        <Input name="name" label={t.ui.common.name} placeholder={t.ui.quoteForm.namePlaceholder} required />
        <Input name="phone" label={t.ui.common.phone} placeholder={t.ui.quoteForm.phonePlaceholder} type="tel" />
      </div>
      <Input name="email" label={t.ui.common.email} placeholder="email@example.com" type="email" required />
      <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-3"}>
        <Input name="city" label={t.ui.common.city} placeholder={t.ui.quoteForm.cityPlaceholder} required />
        <Input name="country" label={t.ui.common.country} placeholder={t.ui.quoteForm.countryPlaceholder} required />
      </div>
      {!compact && (
        <div className="grid sm:grid-cols-2 gap-3">
          <Select name="budgetRange" label={t.ui.quoteForm.budgetRange}>
            <option value="">{t.ui.common.noneDefined}</option>
            <option value="menos-1000">{t.ui.projectForm.budgetOptions.under1000}</option>
            <option value="1000-5000">{t.ui.projectForm.budgetOptions.from1000To5000}</option>
            <option value="5000-15000">{t.ui.projectForm.budgetOptions.from5000To15000}</option>
            <option value="mas-15000">{t.ui.projectForm.budgetOptions.from15000To50000}</option>
          </Select>
          <Select name="urgency" label={t.ui.quoteForm.deadline}>
            <option value="flexible">{t.ui.common.flexible}</option>
            <option value="this_month">{t.ui.common.thisMonth}</option>
            <option value="urgent">{t.ui.common.urgent}</option>
          </Select>
        </div>
      )}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.quoteForm.tellUs}</label>
        <textarea
          name="description"
          required
          rows={compact ? 3 : 4}
          placeholder={t.ui.quoteForm.descriptionPlaceholder}
          className="mt-1.5 w-full rounded-xl bg-canvas px-3.5 py-3 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-forest-500 placeholder:text-muted resize-none"
        />
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        <Send size={16} /> {pending ? t.ui.quoteForm.submitting : t.ui.quoteForm.submit}
      </button>
      <p className="text-[0.7rem] text-muted text-center leading-relaxed">
        {t.ui.projectForm.preEstimateDisclaimer} {t.ui.quoteForm.privacyPrefix}
        <a href="/legal/privacidad" className="underline hover:text-forest-700">{t.ui.quoteForm.privacyLink}</a>.
      </p>
    </form>
  );
}

function Select({
  name,
  label,
  children,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="mt-1.5 w-full rounded-xl bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-forest-500"
      >
        {children}
      </select>
    </div>
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
