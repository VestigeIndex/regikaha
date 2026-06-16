"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { categories, getCategoryById } from "@/lib/data";
import { formatPriceFrom, priceTypeLabel } from "@/lib/utils";

type ServiceForm = {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  priceFrom: string;
  priceType: "fixed" | "from" | "hour" | "m2" | "project";
  estimatedTime: string;
  serviceArea: string;
  includes: string;
  excludes: string;
  process: string;
};

const emptyForm: ServiceForm = {
  id: "",
  title: "",
  categoryId: "",
  description: "",
  priceFrom: "0",
  priceType: "from",
  estimatedTime: "",
  serviceArea: "",
  includes: "",
  excludes: "",
  process: "",
};

export function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
    const data = await res.json().catch(() => ({}));
    if (res.ok) setServices(data.services || []);
    else setError(data.error || "No se pudieron cargar los servicios");
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => {
      setError("No se pudieron cargar los servicios");
      setLoading(false);
    });
  }, []);

  function update<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function edit(service: any) {
    setForm({
      id: service.id,
      title: service.title || "",
      categoryId: service.categoryId || "",
      description: service.description || "",
      priceFrom: String(service.priceFrom || 0),
      priceType: service.priceType || "from",
      estimatedTime: service.estimatedTime || "",
      serviceArea: service.serviceArea || "",
      includes: (service.includes || []).join("\n"),
      excludes: (service.excludes || []).join("\n"),
      process: (service.process || []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, priceFrom: Number(form.priceFrom || 0) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el servicio");
      setForm(emptyForm);
      setMessage("Servicio guardado y disponible para tu perfil público.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el servicio");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError(null);
    const res = await fetch("/api/services", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setServices((current) => current.filter((service) => service.id !== id));
      setMessage("Servicio desactivado.");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo desactivar el servicio");
    }
  }

  return (
    <>
      <DashboardHeader
        title="Mis servicios"
        subtitle="Crea servicios concretos. Cada uno alimenta tu perfil público y su SEO."
        action={<button onClick={() => setForm(emptyForm)} className="btn btn-secondary text-sm"><Plus size={16} /> Nuevo servicio</button>}
      />

      {(message || error) && (
        <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-mint text-forest-800"}`}>
          {error || message}
        </div>
      )}

      <section className="card p-6 mb-6">
        <h2 className="font-bold text-ink">{form.id ? "Editar servicio" : "Nuevo servicio"}</h2>
        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          <Input label="Título del servicio" value={form.title} onChange={(v) => update("title", v)} />
          <Select label="Categoría" value={form.categoryId} onChange={(v) => update("categoryId", v)}>
            <option value="">Selecciona categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Select>
          <Input label="Precio desde (€)" type="number" value={form.priceFrom} onChange={(v) => update("priceFrom", v)} />
          <Select label="Tipo de precio" value={form.priceType} onChange={(v) => update("priceType", v as ServiceForm["priceType"])}>
            <option value="from">Desde</option>
            <option value="fixed">Precio cerrado</option>
            <option value="hour">Por hora</option>
            <option value="m2">Por m²</option>
            <option value="project">Por proyecto</option>
          </Select>
          <Input label="Tiempo estimado" value={form.estimatedTime} onChange={(v) => update("estimatedTime", v)} />
          <Input label="Zona del servicio" value={form.serviceArea} onChange={(v) => update("serviceArea", v)} />
        </div>
        <div className="mt-4 space-y-4">
          <TextArea label="Descripción SEO" rows={4} value={form.description} onChange={(v) => update("description", v)} />
          <div className="grid lg:grid-cols-3 gap-4">
            <TextArea label="Incluye" rows={5} value={form.includes} onChange={(v) => update("includes", v)} />
            <TextArea label="No incluye" rows={5} value={form.excludes} onChange={(v) => update("excludes", v)} />
            <TextArea label="Proceso" rows={5} value={form.process} onChange={(v) => update("process", v)} />
          </div>
        </div>
        <div className="mt-5 flex gap-2 flex-wrap">
          <button onClick={save} disabled={saving} className="btn btn-primary text-sm">
            <Save size={16} /> {saving ? "Guardando..." : "Guardar servicio"}
          </button>
          {form.id && <button onClick={() => setForm(emptyForm)} className="btn btn-secondary text-sm">Cancelar edición</button>}
        </div>
      </section>

      {loading ? (
        <div className="card p-8 text-sm text-muted">Cargando servicios.</div>
      ) : (
        <div className="space-y-3">
          {services.length === 0 && (
            <div className="card p-8 text-sm text-muted">Aún no tienes servicios publicados.</div>
          )}
          {services.map((service) => {
            const cat = getCategoryById(service.categoryId);
            return (
              <article key={service.id} className="card p-5 flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-ink">{service.title}</h2>
                    {cat && <span className="chip">{cat.name}</span>}
                    <span className="inline-flex items-center gap-1 text-xs text-forest-700 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-forest-500" /> Activo
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1.5 line-clamp-1 max-w-xl">{service.description}</p>
                  <p className="text-sm mt-2">
                    <span className="text-muted">{priceTypeLabel(service.priceType)} </span>
                    <span className="font-bold text-ink">{formatPriceFrom(service.priceFrom)}</span>
                    {service.estimatedTime && <span className="text-muted"> · {service.estimatedTime}</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  {service.slug && (
                    <a href={`/profesionales/${service.professionalSlug}/${service.slug}`} className="btn btn-secondary text-sm py-2">
                      <Eye size={15} /> Ver
                    </a>
                  )}
                  <button onClick={() => edit(service)} className="btn btn-secondary text-sm py-2"><Pencil size={15} /> Editar</button>
                  <button onClick={() => remove(service.id)} className="btn btn-secondary text-sm py-2"><Trash2 size={15} /> Quitar</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="reg-input mt-1.5" />
    </label>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (value: string) => void; rows: number }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="reg-input mt-1.5 resize-none" />
    </label>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="reg-input mt-1.5">
        {children}
      </select>
    </label>
  );
}
