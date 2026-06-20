"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";
import { categories } from "@/lib/data/categories";
import { europeanCountryOptions } from "@/lib/market";
import { useI18n, useT } from "@/lib/i18n/context";
import { useContent } from "@/lib/i18n/useLocalizedContent";
import { searchGeoDictionaries } from "@/lib/i18n/search-geo";
import { detectMarketCountry } from "@/lib/market-country";

type Mode = "client" | "b2b";

export function ProjectRequestForm({ mode = "client" }: { mode?: Mode }) {
  const { locale } = useI18n();
  const t = useT();
  const content = useContent();
  const geoCopy = searchGeoDictionaries[locale];
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("ES");
  const countryTouched = useRef(false);

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
    const payload = Object.fromEntries(form.entries());
    if (mode === "client") payload.acceptsPreEstimate = String(form.get("acceptsPreEstimate") === "on");
    try {
      const res = await fetch(mode === "client" ? "/api/projects" : "/api/b2b-projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.ui.projectForm.unableToPublish);
      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.ui.projectForm.unableToPublish);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 size={38} className="mx-auto text-forest-600" />
        <h2 className="mt-4 text-xl font-bold text-ink">{t.ui.projectForm.sentTitle}</h2>
        <p className="mt-2 text-muted">
          {mode === "client" ? t.ui.projectForm.sentClient : t.ui.projectForm.sentB2b}
        </p>
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
          <Link href="/mapa" className="btn btn-primary">{t.ui.actions.searchMap}</Link>
          <Link href="/registro/profesional" className="btn btn-secondary">{t.ui.register.createProfile}</Link>
          <button onClick={() => setSent(false)} className="btn btn-secondary">{t.ui.actions.publishAnother}</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8 space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input name="name" label={mode === "client" ? t.ui.common.name : t.ui.projectForm.contactPerson} required />
        <Input name="email" label={t.ui.common.email} type="email" required />
        <Input name="phone" label={t.ui.common.phone} type="tel" />
        {mode === "b2b" && <Input name="companyType" label={t.ui.projectForm.companyType} placeholder={t.ui.projectForm.companyTypePlaceholder} required />}
        {mode === "client" && (
          <Select name="clientType" label={t.ui.projectForm.clientType}>
            <option value="particular">{t.ui.projectForm.clientTypes.particular}</option>
            <option value="empresa">{t.ui.projectForm.clientTypes.empresa}</option>
            <option value="comunidad">{t.ui.projectForm.clientTypes.comunidad}</option>
            <option value="administrador_fincas">{t.ui.projectForm.clientTypes.administrador_fincas}</option>
          </Select>
        )}
        <Select name="country" label={t.ui.common.country} value={country} onChange={selectCountry}>
          {europeanCountryOptions.map((country) => (
            <option key={country.code} value={country.code}>{localizedCountry(country.code, locale)}</option>
          ))}
        </Select>
        <div className="sm:col-span-1">
          <PlaceAutocomplete
            country={country}
            required
            mode={mode === "client" ? "project" : "company"}
            label={t.ui.projectForm.cityZone}
            namePrefix="place"
          />
        </div>
        {mode === "client" && <Input name="postalCode" label={t.ui.projectForm.postalCode} />}
        {mode === "client" ? (
          <Select name="categoryId" label={t.ui.common.category}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{content.categories[category.id].name}</option>
            ))}
          </Select>
        ) : (
          <Select name="requiredSpecialty" label={t.ui.projectForm.requiredSpecialty}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{content.categories[category.id].name}</option>
            ))}
            <option value="maquinaria">{t.ui.projectForm.extraSpecialties.machinery}</option>
            <option value="seguridad-prl">{t.ui.projectForm.extraSpecialties.safety}</option>
            <option value="limpieza-final">{t.ui.projectForm.extraSpecialties.cleaning}</option>
          </Select>
        )}
        {mode === "client" ? (
          <Input name="subcategory" label={t.ui.projectForm.subcategory} placeholder={t.ui.projectForm.subcategoryPlaceholder} />
        ) : (
          <Input name="projectType" label={t.ui.projectForm.projectType} placeholder={t.ui.projectForm.projectTypePlaceholder} />
        )}
        {mode === "client" ? (
          <Select name="propertyType" label={t.ui.projectForm.propertyType}>
            <option value="vivienda">{t.ui.projectForm.propertyTypes.vivienda}</option>
            <option value="local">{t.ui.projectForm.propertyTypes.local}</option>
            <option value="oficina">{t.ui.projectForm.propertyTypes.oficina}</option>
            <option value="comunidad">{t.ui.projectForm.propertyTypes.comunidad}</option>
            <option value="nave">{t.ui.projectForm.propertyTypes.nave}</option>
          </Select>
        ) : (
          <Input name="teamSize" label={t.ui.projectForm.teamSize} placeholder={t.ui.projectForm.teamSizePlaceholder} />
        )}
        <Select name="urgency" label={mode === "client" ? t.ui.projectForm.urgency : t.ui.projectForm.estimatedStart}>
          <option value="flexible">{t.ui.common.flexible}</option>
          <option value="this_month">{t.ui.common.thisMonth}</option>
          <option value="urgent">{t.ui.common.urgent}</option>
        </Select>
        <Select name="radiusKm" label={geoCopy.radius}>
          <option value="10">10 km</option>
          <option value="25">25 km</option>
          <option value="50">50 km</option>
          <option value="100">100 km</option>
          <option value="250">250 km</option>
        </Select>
        {mode === "b2b" && <Input name="duration" label={t.ui.projectForm.duration} />}
        <Select name="budgetRange" label={t.ui.projectForm.budgetRange}>
          <option value="">{t.ui.common.noneDefined}</option>
          <option value="menos-1000">{t.ui.projectForm.budgetOptions.under1000}</option>
          <option value="1000-5000">{t.ui.projectForm.budgetOptions.from1000To5000}</option>
          <option value="5000-15000">{t.ui.projectForm.budgetOptions.from5000To15000}</option>
          <option value="15000-50000">{t.ui.projectForm.budgetOptions.from15000To50000}</option>
          <option value="mas-50000">{t.ui.projectForm.budgetOptions.over50000}</option>
        </Select>
      </div>

      {mode === "client" && <Input name="approximateMeasures" label={t.ui.projectForm.approximateMeasures} placeholder={t.ui.projectForm.approximateMeasuresPlaceholder} />}
      <Textarea
        name="description"
        label={mode === "client" ? t.ui.projectForm.clientDescription : t.ui.projectForm.b2bDescription}
        placeholder={mode === "client" ? t.ui.projectForm.clientDescriptionPlaceholder : t.ui.projectForm.b2bDescriptionPlaceholder}
        minLength={20}
        maxLength={2400}
        required
      />

      {mode === "client" ? (
        <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
          <input name="acceptsPreEstimate" type="checkbox" required className="mt-1 accent-[var(--primary)]" />
          <span className="text-sm text-ink/85">{t.ui.projectForm.preEstimateDisclaimer}</span>
        </label>
      ) : (
        <p className="rounded-xl bg-canvas p-4 text-sm text-muted">
          {t.ui.projectForm.b2bNotice}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        <Send size={16} /> {pending ? t.ui.projectForm.publishing : mode === "client" ? t.ui.projectForm.publishClient : t.ui.projectForm.publishB2b}
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

function Input({
  name,
  label,
  type = "text",
  placeholder,
  required,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input name={name} type={type} placeholder={placeholder} required={required} minLength={minLength} className="reg-input mt-1.5" />
    </label>
  );
}

function Select({
  name,
  label,
  children,
  value,
  onChange,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <select name={name} value={value} onChange={(event) => onChange?.(event.target.value)} className="reg-input mt-1.5">{children}</select>
    </label>
  );
}

function Textarea({
  name,
  label,
  placeholder,
  required,
  minLength,
  maxLength,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={5}
        className="reg-input mt-1.5 resize-none"
      />
    </label>
  );
}
