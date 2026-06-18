"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { europeanCountryOptions } from "@/lib/market";
import { panelPathForRole, roleLabels, type AccountRole } from "@/lib/accounts";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";

const roleCopy: Record<Exclude<AccountRole, "professional" | "admin">, { title: string; text: string; submit: string }> = {
  client: {
    title: "Crear cuenta cliente",
    text: "Publica proyectos, guarda favoritos, recibe pre-presupuestos y gestiona conversaciones.",
    submit: "Crear cuenta cliente",
  },
  company: {
    title: "Crear cuenta empresa",
    text: "Publica necesidades de subcontrata, compara equipos y gestiona solicitudes B2B.",
    submit: "Crear cuenta empresa",
  },
  subcontractor: {
    title: "Crear cuenta subcontrata",
    text: "Define especialidades, zonas de servicio y disponibilidad para recibir oportunidades B2B.",
    submit: "Crear cuenta subcontrata",
  },
};

export function AccountRegisterForm({ role }: { role: Exclude<AccountRole, "professional" | "admin"> }) {
  const router = useRouter();
  const copy = roleCopy[role];
  const [country, setCountry] = useState("ES");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo crear la cuenta");
      setDone(true);
      setTimeout(() => {
        router.push(data.redirectTo || panelPathForRole(role));
        router.refresh();
      }, 450);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="card p-8 text-center max-w-xl mx-auto">
        <CheckCircle2 size={40} className="mx-auto text-forest-600" />
        <h2 className="mt-4 text-xl font-bold text-ink">Tu cuenta se ha creado</h2>
        <p className="mt-2 text-muted">Te llevamos a tu panel. Si el inicio automático no estuviera disponible, podrás entrar desde Conectar.</p>
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
        <Field label={role === "client" ? "Nombre" : "Nombre de contacto"}>
          <input name="name" required className="reg-input" />
        </Field>
        {role !== "client" && (
          <Field label="Razón social o nombre público">
            <input name="displayName" required className="reg-input" />
          </Field>
        )}
        <Field label="Email">
          <input name="email" type="email" required className="reg-input" autoComplete="email" />
        </Field>
        <Field label="Contraseña">
          <input name="password" type="password" required minLength={8} className="reg-input" autoComplete="new-password" />
        </Field>
        <Field label="Teléfono">
          <input name="phone" type="tel" className="reg-input" />
        </Field>
        <Field label="País">
          <select name="country" value={country} onChange={(e) => setCountry(e.target.value)} className="reg-input" required>
            {europeanCountryOptions.map((option) => (
              <option key={option.code} value={option.code}>{option.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <PlaceAutocomplete country={country} required mode={role === "client" ? "project" : role} placeholder="Ciudad, pueblo o código postal" />
      {role !== "client" && (
        <Field label={role === "company" ? "Necesidades habituales" : "Especialidades"}>
          <textarea name="description" required minLength={20} rows={4} className="reg-input resize-none" />
        </Field>
      )}
      <label className="flex items-start gap-3 rounded-xl bg-canvas p-4 cursor-pointer">
        <input type="checkbox" name="acceptsTerms" required className="mt-1 accent-[var(--primary)]" />
        <span className="text-sm text-ink/85">
          Acepto las condiciones aplicables a {roleLabels[role].toLowerCase()}, la política de privacidad y el uso de RegiKaha como plataforma tecnológica de intermediación.
        </span>
      </label>
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? "Creando cuenta..." : copy.submit}
      </button>
    </form>
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
