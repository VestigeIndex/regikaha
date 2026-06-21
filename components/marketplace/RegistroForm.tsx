"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ArrowLeft, PartyPopper, Building2, MapPin, ShieldCheck } from "lucide-react";
import { GoogleConnectButton } from "@/components/auth/GoogleConnectButton";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";
import { categories } from "@/lib/data/categories";
import { integrations } from "@/lib/integrations";
import { europeanCountryOptions } from "@/lib/market";
import { useI18n, useT } from "@/lib/i18n/context";
import { localeMeta } from "@/lib/i18n/config";
import { subscriptionTextDictionaries } from "@/lib/i18n/subscription";
import { useContent } from "@/lib/i18n/useLocalizedContent";
import { detectMarketCountry } from "@/lib/market-country";
import { cn } from "@/lib/utils";
import { Turnstile } from "@/components/security/Turnstile";

type RegisterForm = {
  type: string;
  yearsExperience: string;
  publicName: string;
  legalName: string;
  nifCif: string;
  phone: string;
  email: string;
  password: string;
  country: string;
  region: string;
  city: string;
  placeId: string;
  placeSlug: string;
  latitude: string;
  longitude: string;
  serviceArea: string;
  tagline: string;
  description: string;
  insuranceDeclared: boolean;
  invoiceDeclared: boolean;
  docsDeclared: boolean;
  offersUrgent: boolean;
};

const initialForm: RegisterForm = {
  type: "autonomo",
  yearsExperience: "0",
  publicName: "",
  legalName: "",
  nifCif: "",
  phone: "",
  email: "",
  password: "",
  country: "ES",
  region: "",
  city: "",
  placeId: "",
  placeSlug: "",
  latitude: "",
  longitude: "",
  serviceArea: "",
  tagline: "",
  description: "",
  insuranceDeclared: false,
  invoiceDeclared: false,
  docsDeclared: false,
  offersUrgent: false,
};

export function RegistroForm() {
  const { locale } = useI18n();
  const t = useT();
  const content = useContent();
  const steps = t.ui.register.steps;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [nextPath, setNextPath] = useState("/suscripcion");
  const countryTouched = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    detectMarketCountry(locale).then((country) => {
      if (!cancelled && !countryTouched.current) setForm((current) => ({ ...current, country }));
    });
    return () => { cancelled = true; };
  }, [locale]);

  function update<K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) {
    if (key === "country") countryTouched.current = true;
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCat(id: string) {
    setSelectedCats((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  async function finish() {
    setPending(true);
    setError(null);
    try {
      if (!selectedCats.length) throw new Error(t.ui.register.selectCategoryError);
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...form,
          yearsExperience: Number(form.yearsExperience || 0),
          categories: selectedCats,
          languages: [localeMeta[locale].native],
          areas: [{ country: form.country, region: form.region, city: form.city, latitude: form.latitude, longitude: form.longitude }],
          plan: params.get("plan") === "europa_pro" ? "europa_pro" : "autonomo_nacional",
          interval: params.get("interval") === "yearly" ? "yearly" : "monthly",
          founderIntent: params.get("founder") === "true",
          turnstileToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.ui.register.unableToCreate);
      setNextPath(data.redirectTo || "/suscripcion");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.ui.register.unableToCreate);
      setChallengeKey((value) => value + 1);
      setTurnstileToken("");
    } finally {
      setPending(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 0 && !selectedCats.length) {
      setError(t.ui.register.selectCategoryError);
      return;
    }
    if (step < steps.length - 1) {
      setError(null);
      setStep((s) => s + 1);
      return;
    }
    await finish();
  }

  if (done) {
    return (
      <div className="card p-8 sm:p-10 text-center max-w-xl mx-auto">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-forest-500/12 text-forest-600">
          <PartyPopper size={32} />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-ink">{t.ui.register.welcomeTitle}</h2>
        <p className="mt-3 text-muted leading-relaxed">
          {t.ui.register.welcomeText}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={nextPath} className="btn btn-primary">
            {subscriptionTextDictionaries[locale]["Verificar email y continuar"]}
          </Link>
          <Link href="/panel/servicios" className="btn btn-secondary">{t.ui.register.createServices}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ol className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <li key={label} className="flex-1 flex items-center gap-2">
            <span
              className={cn(
                "grid place-items-center h-8 w-8 rounded-full text-sm font-bold shrink-0 transition-colors",
                i < step ? "bg-forest-600 text-white" : i === step ? "bg-forest-600 text-white ring-4 ring-forest-500/20" : "bg-canvas-alt text-muted",
              )}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </span>
            <span className={cn("text-sm font-medium hidden sm:block", i === step ? "text-ink" : "text-muted")}>{label}</span>
            {i < steps.length - 1 && <span className="flex-1 h-px bg-[var(--hairline)]" />}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="card p-6 sm:p-8">
        {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={Building2} title={t.ui.register.legendActivityTitle} subtitle={t.ui.register.legendActivitySubtitle} />
            <div className="rounded-2xl bg-canvas p-4 ring-1 ring-forest-600/10">
              <p className="text-sm font-semibold text-ink">{t.ui.register.connectTitle}</p>
              <p className="text-sm text-muted mt-1">
                {t.ui.register.connectText}
              </p>
              <div className="mt-3">
                <GoogleConnectButton clientId={integrations.googleClientId} redirectTo="/registro/profesional" />
              </div>
            </div>
            <Field label={t.ui.register.professionalType}>
              <select className="reg-input" required value={form.type} onChange={(e) => update("type", e.target.value)}>
                <option value="empresa_reformas">{t.ui.register.proTypes.empresa_reformas}</option>
                <option value="autonomo">{t.ui.register.proTypes.autonomo}</option>
                <option value="instalador">{t.ui.register.proTypes.instalador}</option>
                <option value="estudio_arquitectura">{t.ui.register.proTypes.estudio_arquitectura}</option>
                <option value="ingenieria">{t.ui.register.proTypes.ingenieria}</option>
                <option value="multiservicio">{t.ui.register.proTypes.multiservicio}</option>
              </select>
            </Field>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                {t.ui.common.categories} ({selectedCats.length} {t.ui.register.selectedCategories})
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => toggleCat(c.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors",
                      selectedCats.includes(c.id)
                        ? "bg-forest-600 text-white ring-forest-600"
                        : "bg-white text-ink ring-forest-600/15 hover:bg-mint",
                    )}
                  >
                    {content.categories[c.id].name}
                  </button>
                ))}
              </div>
            </div>
            <Field label={t.ui.register.yearsExperience}>
              <input type="number" min={0} className="reg-input" value={form.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} required />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={MapPin} title={t.ui.register.legendDataTitle} subtitle={t.ui.register.legendDataSubtitle} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t.ui.register.publicName}><input className="reg-input" value={form.publicName} onChange={(e) => update("publicName", e.target.value)} required /></Field>
              <Field label={t.ui.register.legalName}><input className="reg-input" value={form.legalName} onChange={(e) => update("legalName", e.target.value)} required /></Field>
              <Field label={t.ui.register.nifCifVat}><input className="reg-input" value={form.nifCif} onChange={(e) => update("nifCif", e.target.value)} required /></Field>
              <Field label={t.ui.common.phone}><input type="tel" className="reg-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} required /></Field>
              <Field label={t.ui.common.email}><input type="email" className="reg-input" value={form.email} onChange={(e) => update("email", e.target.value)} required /></Field>
              <Field label={t.ui.register.password}><input type="password" className="reg-input" value={form.password} onChange={(e) => update("password", e.target.value)} minLength={8} autoComplete="new-password" /></Field>
              <Field label={t.ui.common.country}>
                <select className="reg-input" value={form.country} onChange={(e) => update("country", e.target.value)} required>
                  {europeanCountryOptions.map((country) => (
                    <option key={country.code} value={country.code}>{localizedCountry(country.code, locale)}</option>
                  ))}
                </select>
              </Field>
              <div>
                <PlaceAutocomplete
                  country={form.country}
                  required
                  mode="professional"
                  label={t.ui.common.city}
                  onTextChange={(label) => update("city", label)}
                  onChange={(place, label) => {
                    update("city", place?.localityName || label);
                    update("region", place?.admin1Name || place?.admin2Name || "");
                    update("placeId", place?.id || "");
                    update("placeSlug", place?.slug || "");
                    update("latitude", place ? String(place.latitude) : "");
                    update("longitude", place ? String(place.longitude) : "");
                    if (place?.countryCode) update("country", place.countryCode);
                  }}
                />
              </div>
              <Field label={t.ui.register.serviceArea}><input className="reg-input" value={form.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} /></Field>
            </div>
            <Field label={t.ui.register.seoTagline}><input className="reg-input" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} required /></Field>
            <Field label={t.ui.register.publicDescription}>
              <textarea className="reg-input resize-none" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} required />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={ShieldCheck} title={t.ui.register.verificationTitle} subtitle={t.ui.register.verificationSubtitle} />
            <div className="space-y-3">
              <Toggle label={t.ui.register.insurance} on={form.insuranceDeclared} onChange={(v) => update("insuranceDeclared", v)} />
              <Toggle label={t.ui.register.invoice} on={form.invoiceDeclared} onChange={(v) => update("invoiceDeclared", v)} />
              <Toggle label={t.ui.register.professionalDocs} on={form.docsDeclared} onChange={(v) => update("docsDeclared", v)} />
              <Toggle label={t.ui.register.urgent} on={form.offersUrgent} onChange={(v) => update("offersUrgent", v)} />
            </div>
            <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
              <input type="checkbox" required className="mt-1 accent-[var(--primary)]" />
              <span className="text-sm text-ink/85">
                {t.ui.register.termsText}
                <Link href="/legal/terminos-profesionales" className="underline text-forest-700">{t.ui.register.proTerms}</Link>,{" "}
                <Link href="/legal/politica-verificacion" className="underline text-forest-700">{t.ui.register.verificationPolicy}</Link> {t.ui.register.fairRanking}
              </span>
            </label>
            <Turnstile key={challengeKey} action="register_professional" onToken={setTurnstileToken} />
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-ghost">
              <ArrowLeft size={16} /> {t.ui.actions.back}
            </button>
          ) : <span />}
          <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
            {step < steps.length - 1 ? <>{t.ui.actions.continue} <ArrowRight size={16} /></> : <>{pending ? t.ui.register.creating : t.ui.register.createProfile} <Check size={16} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}

function localizedCountry(code: string, locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function Legend({ icon: Icon, title, subtitle }: { icon: typeof Building2; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid place-items-center h-10 w-10 rounded-xl bg-forest-500/12 text-forest-600 shrink-0">
        <Icon size={20} />
      </span>
      <div>
        <h2 className="font-bold text-ink">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="w-full flex items-center justify-between gap-3 rounded-xl bg-canvas px-4 py-3 text-left"
    >
      <span className="text-sm text-ink">{label}</span>
      <span className={cn("relative h-6 w-11 rounded-full transition-colors shrink-0", on ? "bg-forest-600" : "bg-forest-200")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[1.4rem]" : "left-0.5")} />
      </span>
    </button>
  );
}
