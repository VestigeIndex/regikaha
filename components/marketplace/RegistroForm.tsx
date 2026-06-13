"use client";

import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, PartyPopper, Building2, MapPin, ShieldCheck } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const steps = ["Tu actividad", "Datos y zona", "Verificación"];

export function RegistroForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  function toggleCat(id: string) {
    setSelectedCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  if (done) {
    return (
      <div className="card p-8 sm:p-10 text-center max-w-xl mx-auto">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-forest-500/12 text-forest-600">
          <PartyPopper size={32} />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-ink">¡Bienvenido a RegiNova!</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Hemos recibido tu solicitud. Nuestro equipo verificará tu actividad y te avisará por email
          para activar tu perfil. Si estás entre los primeros 300 verificados, tendrás{" "}
          <span className="font-semibold text-forest-700">5 meses gratis</span> de RegiNova Pro.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/panel" className="btn btn-primary">Ir a mi panel</a>
          <a href="/para-profesionales" className="btn btn-secondary">Cómo funciona</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progreso */}
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < steps.length - 1) setStep((s) => s + 1);
          else setDone(true);
        }}
        className="card p-6 sm:p-8"
      >
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={Building2} title="¿A qué te dedicas?" subtitle="Elige el tipo de profesional y tus categorías." />
            <Field label="Tipo de profesional">
              <select className="reg-input" required defaultValue="">
                <option value="" disabled>Selecciona…</option>
                <option>Empresa de reformas</option>
                <option>Autónomo especializado</option>
                <option>Instalador autorizado</option>
                <option>Estudio de arquitectura</option>
                <option>Ingeniería / peritación</option>
                <option>Empresa multiservicio</option>
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
              <input type="number" min={0} className="reg-input" placeholder="Ej. 8" required />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={MapPin} title="Tus datos y zona de trabajo" subtitle="Para mostrar tu perfil y que te encuentren clientes cerca." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre comercial"><input className="reg-input" placeholder="Ej. Reformas Costa" required /></Field>
              <Field label="Nombre o razón social"><input className="reg-input" placeholder="Ej. Reformas Costa S.L." required /></Field>
              <Field label="NIF / CIF"><input className="reg-input" placeholder="B-12345678" required /></Field>
              <Field label="Teléfono"><input type="tel" className="reg-input" placeholder="+34 6XX XXX XXX" required /></Field>
              <Field label="Email"><input type="email" className="reg-input" placeholder="tu@email.com" required /></Field>
              <Field label="Ciudad"><input className="reg-input" placeholder="Ej. Valencia" required /></Field>
            </div>
            <Field label="Zona de servicio"><input className="reg-input" placeholder="Ej. Valencia y área metropolitana" required /></Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <Legend icon={ShieldCheck} title="Verificación y normas" subtitle="La verificación genera confianza y mejora tu posición por mérito." />
            <div className="space-y-3">
              <Toggle label="Tengo seguro de responsabilidad civil" />
              <Toggle label="Trabajo con factura" />
              <Toggle label="Puedo aportar documentación profesional / colegiación si aplica" />
              <Toggle label="Atiendo urgencias" />
            </div>
            <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
              <input type="checkbox" required className="mt-1 accent-[var(--primary)]" />
              <span className="text-sm text-ink/85">
                Acepto las{" "}
                <a href="/legal/terminos-profesionales" className="underline text-forest-700">condiciones para profesionales</a>,
                la <a href="/legal/politica-verificacion" className="underline text-forest-700">política de verificación</a> y
                el ranking justo de RegiNova (sin pagos por posición).
              </span>
            </label>
            <div className="rounded-xl bg-mint/60 ring-1 ring-forest-600/12 p-4 text-sm text-forest-800">
              <strong>Oferta fundadores:</strong> si estás entre los primeros 300 verificados, tienes 5 meses gratis de RegiNova Pro.
            </div>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-ghost">
              <ArrowLeft size={16} /> Atrás
            </button>
          ) : <span />}
          <button type="submit" className="btn btn-primary">
            {step < steps.length - 1 ? <>Continuar <ArrowRight size={16} /></> : <>Crear mi perfil <Check size={16} /></>}
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

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="w-full flex items-center justify-between gap-3 rounded-xl bg-canvas px-4 py-3 text-left"
    >
      <span className="text-sm text-ink">{label}</span>
      <span className={cn("relative h-6 w-11 rounded-full transition-colors shrink-0", on ? "bg-forest-600" : "bg-forest-200")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[1.4rem]" : "left-0.5")} />
      </span>
    </button>
  );
}
