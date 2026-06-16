"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function ContactForm() {
  const t = useT();
  const [sent, setSent] = useState(false);

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
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="card p-6 sm:p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.common.name}</span>
          <input className="reg-input mt-1.5" placeholder={t.ui.contactForm.namePlaceholder} required />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.common.email}</span>
          <input type="email" className="reg-input mt-1.5" placeholder="email@example.com" required />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.contactForm.subject}</span>
        <select className="reg-input mt-1.5" defaultValue="">
          <option value="" disabled>{t.ui.contactForm.subjectPlaceholder}</option>
          {t.ui.contactForm.subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.contactForm.message}</span>
        <textarea className="reg-input mt-1.5 resize-none" rows={5} placeholder={t.ui.contactForm.messagePlaceholder} required />
      </label>
      <button type="submit" className="btn btn-primary w-full">
        <Send size={16} /> {t.ui.contactForm.submit}
      </button>
    </form>
  );
}
