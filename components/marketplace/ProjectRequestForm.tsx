"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { europeanCountryOptions } from "@/lib/market";
import { preEstimateDisclaimer } from "@/lib/preestimate";

type Mode = "client" | "b2b";

export function ProjectRequestForm({ mode = "client" }: { mode?: Mode }) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) throw new Error(data.error || "No se pudo publicar la solicitud");
      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar la solicitud");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 size={38} className="mx-auto text-forest-600" />
        <h2 className="mt-4 text-xl font-bold text-ink">Solicitud publicada</h2>
        <p className="mt-2 text-muted">
          {mode === "client"
            ? "Hemos registrado tu proyecto. Si hay cobertura, los profesionales podrán responder con pre-presupuestos iniciales."
            : "Hemos registrado la necesidad B2B y abierto una tarea de captación de subcontratas en esa zona."}
        </p>
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
          <a href="/mapa" className="btn btn-primary">Ver mapa</a>
          <button onClick={() => setSent(false)} className="btn btn-secondary">Publicar otra</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8 space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input name="name" label={mode === "client" ? "Nombre" : "Persona de contacto"} required />
        <Input name="email" label="Email" type="email" required />
        <Input name="phone" label="Teléfono" type="tel" />
        {mode === "b2b" && <Input name="companyType" label="Tipo de empresa" placeholder="Constructora, promotora, estudio..." required />}
        {mode === "client" && (
          <Select name="clientType" label="Tipo de cliente">
            <option value="particular">Particular</option>
            <option value="empresa">Empresa</option>
            <option value="comunidad">Comunidad de vecinos</option>
            <option value="administrador_fincas">Administrador de fincas</option>
          </Select>
        )}
        <Select name="country" label="País">
          {europeanCountryOptions.map((country) => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </Select>
        <Input name="city" label="Ciudad / zona" required />
        {mode === "client" && <Input name="postalCode" label="Código postal" />}
        {mode === "client" ? (
          <Select name="categoryId" label="Categoría">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Select>
        ) : (
          <Select name="requiredSpecialty" label="Especialidad requerida">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
            <option value="maquinaria">Maquinaria</option>
            <option value="seguridad-prl">Seguridad y PRL</option>
            <option value="limpieza-final">Limpieza final de obra</option>
          </Select>
        )}
        {mode === "client" ? (
          <Input name="subcategory" label="Subcategoría" placeholder="Baño, cocina, urgencia, licencia..." />
        ) : (
          <Input name="projectType" label="Tipo de proyecto" placeholder="Obra nueva, reforma, local, nave..." />
        )}
        {mode === "client" ? (
          <Select name="propertyType" label="Tipo de inmueble">
            <option value="vivienda">Vivienda</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
            <option value="comunidad">Comunidad</option>
            <option value="nave">Nave</option>
          </Select>
        ) : (
          <Input name="teamSize" label="Equipo necesario" placeholder="2 oficiales, cuadrilla, empresa completa..." />
        )}
        <Select name="urgency" label={mode === "client" ? "Urgencia" : "Inicio estimado"}>
          <option value="flexible">Flexible</option>
          <option value="this_month">Este mes</option>
          <option value="urgent">Urgente</option>
        </Select>
        {mode === "b2b" && <Input name="duration" label="Duración aproximada" />}
        <Select name="budgetRange" label="Rango orientativo opcional">
          <option value="">Sin definir</option>
          <option value="menos-1000">Menos de 1.000 €</option>
          <option value="1000-5000">1.000 € - 5.000 €</option>
          <option value="5000-15000">5.000 € - 15.000 €</option>
          <option value="15000-50000">15.000 € - 50.000 €</option>
          <option value="mas-50000">Más de 50.000 €</option>
        </Select>
      </div>

      {mode === "client" && <Input name="approximateMeasures" label="Medidas aproximadas" placeholder="Ej. baño 4 m², piso 90 m²..." />}
      <Textarea
        name="description"
        label={mode === "client" ? "Describe tu proyecto" : "Describe la partida o subcontrata necesaria"}
        placeholder={mode === "client" ? "Qué necesitas, estado actual, plazos, materiales, fotos disponibles..." : "Especialidad, alcance, documentación requerida, fechas y condiciones de obra..."}
        required
      />

      {mode === "client" ? (
        <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
          <input name="acceptsPreEstimate" type="checkbox" required className="mt-1 accent-[var(--primary)]" />
          <span className="text-sm text-ink/85">{preEstimateDisclaimer}</span>
        </label>
      ) : (
        <p className="rounded-xl bg-canvas p-4 text-sm text-muted">
          Publicaremos la necesidad como demanda B2B y activaremos captación de subcontratas verificables en esa zona.
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        <Send size={16} /> {pending ? "Publicando..." : mode === "client" ? "Publicar mi proyecto gratis" : "Publicar necesidad de subcontrata"}
      </button>
    </form>
  );
}

function Input({ name, label, type = "text", placeholder, required }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input name={name} type={type} placeholder={placeholder} required={required} className="reg-input mt-1.5" />
    </label>
  );
}

function Select({ name, label, children }: { name: string; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <select name={name} className="reg-input mt-1.5">{children}</select>
    </label>
  );
}

function Textarea({ name, label, placeholder, required }: { name: string; label: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <textarea name={name} placeholder={placeholder} required={required} rows={5} className="reg-input mt-1.5 resize-none" />
    </label>
  );
}
