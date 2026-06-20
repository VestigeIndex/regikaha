"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useI18n, useT } from "@/lib/i18n/context";
import { Turnstile } from "@/components/security/Turnstile";
import { costControlsDictionaries } from "@/lib/i18n/cost-controls";

export function ContactForm() {
  const t = useT();
  const { locale } = useI18n();
  const costCopy = costControlsDictionaries[locale];
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeKey, setChallengeKey] = useState(0);

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-forest-500/12 text-forest-600">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="mt-4 font-semibold text-ink">{t.ui.contactForm.sentTitle}</h2>
        <p className="mt-1.5 text-sm text-muted">{t.ui.contactForm.sentText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const form = new FormData(e.currentTarget);
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ ...Object.fromEntries(form.entries()), locale }),
          });
          if (!response.ok) throw new Error(costCopy.contactError);
          setSent(true);
          e.currentTarget.reset();
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : costCopy.contactError);
          setChallengeKey((value) => value + 1);
        } finally {
          setPending(false);
        }
      }}
      className="card p-6 sm:p-7 space-y-4"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.common.name}</span>
          <input name="name" className="reg-input mt-1.5" placeholder={t.ui.contactForm.namePlaceholder} required />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.common.email}</span>
          <input name="email" type="email" className="reg-input mt-1.5" placeholder="email@example.com" required />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.contactForm.subject}</span>
        <select name="subject" className="reg-input mt-1.5" defaultValue="" required>
          <option value="" disabled>{t.ui.contactForm.subjectPlaceholder}</option>
          {t.ui.contactForm.subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.contactForm.message}</span>
        <textarea name="message" minLength={10} maxLength={3000} className="reg-input mt-1.5 resize-none" rows={5} placeholder={t.ui.contactForm.messagePlaceholder} required />
      </label>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      <Turnstile key={challengeKey} action="contact" />
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        <Send size={16} /> {pending ? t.ui.actions.sending : t.ui.contactForm.submit}
      </button>
    </form>
  );
}
