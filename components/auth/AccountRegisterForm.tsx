"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { europeanCountryOptions } from "@/lib/market";
import { panelPathForRole, type AccountRole } from "@/lib/accounts";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";
import { useI18n } from "@/lib/i18n/context";
import { accountRegisterDictionaries } from "@/lib/i18n/account-register";
import { detectMarketCountry } from "@/lib/market-country";

export function AccountRegisterForm({ role }: { role: Exclude<AccountRole, "professional" | "admin"> }) {
  const router = useRouter();
  const { locale } = useI18n();
  const dictionary = accountRegisterDictionaries[locale];
  const copy = dictionary.roles[role];
  const [country, setCountry] = useState("ES");
  const countryTouched = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    detectMarketCountry(locale).then((detected) => {
      if (!cancelled && !countryTouched.current) setCountry(detected);
    });
    return () => { cancelled = true; };
  }, [locale]);

  function selectCountry(value: string) {
    countryTouched.current = true;
    setCountry(value);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form.entries()),
          plan: params.get("plan") === "europa_pro" ? "europa_pro" : "autonomo_nacional",
          interval: params.get("interval") === "yearly" ? "yearly" : "monthly",
          founderIntent: params.get("founder") === "true",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || dictionary.unable);
      setDone(true);
      setTimeout(() => {
        router.push(data.redirectTo || panelPathForRole(role));
        router.refresh();
      }, 450);
    } catch (err) {
      setError(err instanceof Error ? err.message : dictionary.unable);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="card p-8 text-center max-w-xl mx-auto">
        <CheckCircle2 size={40} className="mx-auto text-forest-600" />
        <h2 className="mt-4 text-xl font-bold text-ink">{dictionary.doneTitle}</h2>
        <p className="mt-2 text-muted">{dictionary.doneText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
      <input type="hidden" name="role" value={role} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-500/12 text-forest-700">
          <UserPlus size={21} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink">{copy.title}</h2>
          <p className="mt-1 text-sm text-muted">{copy.text}</p>
        </div>
      </div>
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={role === "client" ? dictionary.name : dictionary.contactName}>
          <input name="name" required className="reg-input" />
        </Field>
        {role !== "client" && (
          <Field label={dictionary.displayName}>
            <input name="displayName" required className="reg-input" />
          </Field>
        )}
        <Field label={dictionary.email}>
          <input name="email" type="email" required className="reg-input" autoComplete="email" />
        </Field>
        <Field label={dictionary.password}>
          <input name="password" type="password" required minLength={8} className="reg-input" autoComplete="new-password" />
        </Field>
        <Field label={dictionary.phone}>
          <input name="phone" type="tel" className="reg-input" />
        </Field>
        <Field label={dictionary.country}>
          <select name="country" value={country} onChange={(e) => selectCountry(e.target.value)} className="reg-input" required>
            {europeanCountryOptions.map((option) => (
              <option key={option.code} value={option.code}>{localizedCountry(option.code, locale)}</option>
            ))}
          </select>
        </Field>
      </div>
      <PlaceAutocomplete country={country} required mode={role === "client" ? "project" : role} placeholder={dictionary.cityPlaceholder} />
      {role !== "client" && (
        <Field label={role === "company" ? dictionary.needs : dictionary.specialties}>
          <textarea name="description" required minLength={20} rows={4} className="reg-input resize-none" />
        </Field>
      )}
      <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
        <input type="checkbox" name="acceptsTerms" required className="mt-1 accent-[var(--primary)]" />
        <span className="text-sm text-ink/85">
          {copy.terms}
        </span>
      </label>
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? dictionary.creating : copy.submit}
      </button>
    </form>
  );
}

function localizedCountry(code: string, locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
