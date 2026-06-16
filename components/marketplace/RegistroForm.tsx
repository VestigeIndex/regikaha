"use client";

import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, PartyPopper, Building2, MapPin, ShieldCheck } from "lucide-react";
import { GoogleConnectButton } from "@/components/auth/GoogleConnectButton";
import { categories } from "@/lib/data/categories";
import { integrations } from "@/lib/integrations";
import { europeanCountryOptions } from "@/lib/market";
import { cn } from "@/lib/utils";

const steps = ["Tu actividad", "Datos y zona", "Verificación"];

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
  serviceArea: "",
  tagline: "",
  description: "",
  insuranceDeclared: false,
  invoiceDeclared: false,
  docsDeclared: false,
  offersUrgent: false,
};

export function RegistroForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [form, setForm] = useState<RegisterForm>(initialForm);

  function update<K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCat(id: string) {
    setSelectedCats((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  async function finish() {
    setPending(true);
    setError(null);
    try {
      if (!selectedCats.length) throw new Error("Selecciona al menos una categoría profesional");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearsExperience: Number(form.yearsExperience || 0),
          categories: selectedCats,
          languages: ["Español"],
          areas: [{ country: form.country, region: form.region, city: form.city }],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo crear el perfil");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el perfil");
    } finally {
      setPending(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < steps.length - 1) {
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
        <h2 className="mt-5 text-2xl font-bold text-ink">¡Bienvenido a RegiKaha!</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Tu perfil profesional ya está creado. Desde el panel puedes completar servicios,
          logo, fotos de trabajos, mapa de operación y presupuestos iniciales.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/panel" className="btn btn-primary">Ir a mi panel</a>
          <a href="/panel/servicios" className="btn btn-secondary">Crear servicios</a>
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
            <Legend icon={Building2} title="¿A qué te dedicas?" subtitle="Elige el tipo de profesional y tus categorías." />
            <div className="rounded-2xl bg-canvas p-4 ring-1 ring-forest-600/10">
              <p className="text-sm font-semibold text-ink">Conecta tu cuenta profesional</p>
              <p className="text-sm text-muted mt-1">
                Usa Google para iniciar sesión más rápido y dejar tu email verificado desde el primer paso.
              </p>
              <div className="mt-3">
                <GoogleConnectButton clientId={integrations.googleClientId} redirectTo="/registro" />
              </div>
            </div>
            <Field label="Tipo de profesional">
              <select className="reg-input" required value={form.type} onChange={(e) => update("type", e.target.value)}>
                <option value="empresa_reformas">Empresa de reformas</option>
                <option value="autonomo">Autónomo especializado</option>
                <option value="instalador">Instalador autorizado</option>
                <option value="estudio_arquitectura">Estudio de arquitectura</option>
                <option value="ingenieria">Ingeniería / peritación</option>
                <option value="multiservicio">Empresa multiservicio</option>
              </select>
            </Field>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                Categorías ({selectedCats.length} seleccionadas)
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
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Años de experiencia">
              <input type="number" min={0} className="reg-input" value={form.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} required />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={MapPin} title="Tus datos y zona de trabajo" subtitle="Para mostrar tu perfil y que te encuentren clientes en Europa, país y ciudad." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre comercial"><input className="reg-input" value={form.publicName} onChange={(e) => update("publicName", e.target.value)} placeholder="Ej. Reformas Costa" required /></Field>
              <Field label="Nombre o razón social"><input className="reg-input" value={form.legalName} onChange={(e) => update("legalName", e.target.value)} placeholder="Ej. Reformas Costa S.L." required /></Field>
              <Field label="NIF / CIF / VAT"><input className="reg-input" value={form.nifCif} onChange={(e) => update("nifCif", e.target.value)} placeholder="B-12345678" required /></Field>
              <Field label="Teléfono"><input type="tel" className="reg-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+34 6XX XXX XXX" required /></Field>
              <Field label="Email"><input type="email" className="reg-input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="tu@email.com" required /></Field>
              <Field label="Contraseña"><input type="password" className="reg-input" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Mínimo 8 caracteres" /></Field>
              <Field label="País">
                <select className="reg-input" value={form.country} onChange={(e) => update("country", e.target.value)} required>
                  {europeanCountryOptions.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Región / provincia"><input className="reg-input" value={form.region} onChange={(e) => update("region", e.target.value)} placeholder="Ej. Comunidad de Madrid" required /></Field>
              <Field label="Ciudad"><input className="reg-input" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Ej. Madrid" required /></Field>
              <Field label="Zona de servicio"><input className="reg-input" value={form.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} placeholder="Ej. Madrid y alrededores" required /></Field>
            </div>
            <Field label="Titular SEO corto"><input className="reg-input" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Ej. Reformas integrales con estimación inicial clara" required /></Field>
            <Field label="Descripción pública">
              <textarea className="reg-input resize-none" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe tu experiencia, tipo de trabajos y zonas donde operas." required />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={ShieldCheck} title="Verificación y normas" subtitle="La verificación genera confianza y mejora tu posición por mérito." />
            <div className="space-y-3">
              <Toggle label="Tengo seguro de responsabilidad civil" on={form.insuranceDeclared} onChange={(v) => update("insuranceDeclared", v)} />
              <Toggle label="Trabajo con factura" on={form.invoiceDeclared} onChange={(v) => update("invoiceDeclared", v)} />
              <Toggle label="Puedo aportar documentación profesional / colegiación si aplica" on={form.docsDeclared} onChange={(v) => update("docsDeclared", v)} />
              <Toggle label="Atiendo urgencias" on={form.offersUrgent} onChange={(v) => update("offersUrgent", v)} />
            </div>
            <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
              <input type="checkbox" required className="mt-1 accent-[var(--primary)]" />
              <span className="text-sm text-ink/85">
                Acepto las{" "}
                <a href="/legal/terminos-profesionales" className="underline text-forest-700">condiciones para profesionales</a>,
                la <a href="/legal/politica-verificacion" className="underline text-forest-700">política de verificación</a> y
                el ranking justo de RegiKaha (sin pagos por posición).
              </span>
            </label>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-ghost">
              <ArrowLeft size={16} /> Atrás
            </button>
          ) : <span />}
          <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
            {step < steps.length - 1 ? <>Continuar <ArrowRight size={16} /></> : <>{pending ? "Creando..." : "Crear mi perfil"} <Check size={16} /></>}
          </button>
        </div>
      </form>
    </div>
  );
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
