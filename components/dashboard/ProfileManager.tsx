"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, ImagePlus, MapPin, Save, Upload } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { categories } from "@/lib/data";
import { europeanCountryOptions } from "@/lib/market";

type ProfileForm = {
  publicName: string;
  legalName: string;
  nifCif: string;
  type: string;
  tagline: string;
  description: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  yearsExperience: string;
  serviceRadiusKm: string;
  priceFrom: string;
  languages: string;
  insuranceDeclared: boolean;
  invoiceDeclared: boolean;
  offersUrgent: boolean;
};

const initialForm: ProfileForm = {
  publicName: "",
  legalName: "",
  nifCif: "",
  type: "autonomo",
  tagline: "",
  description: "",
  phone: "",
  country: "ES",
  region: "",
  city: "",
  yearsExperience: "0",
  serviceRadiusKm: "30",
  priceFrom: "0",
  languages: "Español",
  insuranceDeclared: false,
  invoiceDeclared: false,
  offersUrgent: false,
};

export function ProfileManager() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [areasText, setAreasText] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [meRes, portfolioRes] = await Promise.all([fetch("/api/me"), fetch("/api/portfolio")]);
      const me = await meRes.json();
      const port = portfolioRes.ok ? await portfolioRes.json() : { items: [] };
      if (me.professional) {
        const p = me.professional;
        let languages: string[] = [];
        try { languages = JSON.parse(p.languages || "[]"); } catch { languages = []; }
        setForm({
          publicName: p.public_name || "",
          legalName: p.legal_name || "",
          nifCif: p.nif_cif || "",
          type: p.type || "autonomo",
          tagline: p.short_tagline || "",
          description: p.description || "",
          phone: p.phone || "",
          country: p.country || "ES",
          region: p.region || "",
          city: p.city || "",
          yearsExperience: String(p.years_experience || 0),
          serviceRadiusKm: String(p.service_radius_km || 30),
          priceFrom: String(p.price_from || 0),
          languages: languages.length ? languages.join(", ") : "Español",
          insuranceDeclared: !!p.insurance_declared,
          invoiceDeclared: !!p.invoice_declared,
          offersUrgent: !!p.offers_urgent,
        });
        setSelectedCategories(me.categories || []);
        setAreasText((me.areas || []).map((a: any) => [a.city, a.region, a.country].filter(Boolean).join(", ")).join("\n"));
        setLogoImage(p.logo_image || port.logoImage || null);
      }
      setPortfolio(port.items || []);
      setLoading(false);
    }
    load().catch(() => {
      setError("No se pudo cargar el perfil");
      setLoading(false);
    });
  }, []);

  const mapLabel = useMemo(
    () => [form.city, form.region, form.country].filter(Boolean).join(", ") || "Europa",
    [form.city, form.region, form.country],
  );

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCategory(id: string) {
    setSelectedCategories((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function parseAreas() {
    const lines = areasText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const areas = lines.map((line) => {
      const [city = "", region = "", country = form.country] = line.split(",").map((part) => part.trim());
      return { city, region, country: country || form.country };
    });
    if (!areas.length) areas.push({ city: form.city, region: form.region, country: form.country });
    return areas;
  }

  async function saveProfile() {
    setSaving(true);
    setError(null);
    setMessage(null);
    const payload = {
      ...form,
      yearsExperience: Number(form.yearsExperience || 0),
      serviceRadiusKm: Number(form.serviceRadiusKm || 30),
      priceFrom: Number(form.priceFrom || 0),
      languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean),
      categories: selectedCategories,
      areas: parseAreas(),
    };
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el perfil");
      setMessage("Perfil actualizado. Tu ficha pública y tu SEO se regeneran con estos datos.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(formData: FormData) {
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/portfolio", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen");
      if (data.logoImage) setLogoImage(data.logoImage);
      if (data.item) setPortfolio((items) => [data.item, ...items]);
      setMessage("Imagen subida correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Mi perfil" subtitle="Cargando tu ficha profesional..." />
        <div className="card p-8 text-sm text-muted">Preparando el panel.</div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Mi perfil"
        subtitle="Datos públicos, SEO, mapa de operación, logo y trabajos realizados."
        action={
          <button onClick={saveProfile} disabled={saving} className="btn btn-primary text-sm">
            <Save size={16} /> {saving ? "Guardando..." : "Guardar perfil"}
          </button>
        }
      />

      {(message || error) && (
        <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-mint text-forest-800"}`}>
          {error || message}
        </div>
      )}

      <div className="grid xl:grid-cols-[1fr_390px] gap-6">
        <div className="space-y-6">
          <section className="card p-6 space-y-4">
            <h2 className="font-bold text-ink">Datos básicos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Nombre comercial" value={form.publicName} onChange={(v) => update("publicName", v)} />
              <Input label="Nombre legal" value={form.legalName} onChange={(v) => update("legalName", v)} />
              <Input label="NIF/CIF/VAT" value={form.nifCif} onChange={(v) => update("nifCif", v)} />
              <Input label="Teléfono" value={form.phone} onChange={(v) => update("phone", v)} />
            </div>
            <Input label="Titular SEO corto" value={form.tagline} onChange={(v) => update("tagline", v)} />
            <TextArea label="Descripción pública" rows={5} value={form.description} onChange={(v) => update("description", v)} />
          </section>

          <section className="card p-6 space-y-4">
            <h2 className="font-bold text-ink">Servicios y alcance</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Select label="País base" value={form.country} onChange={(v) => update("country", v)}>
                {europeanCountryOptions.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </Select>
              <Input label="Región / provincia" value={form.region} onChange={(v) => update("region", v)} />
              <Input label="Ciudad" value={form.city} onChange={(v) => update("city", v)} />
              <Input label="Años de experiencia" type="number" value={form.yearsExperience} onChange={(v) => update("yearsExperience", v)} />
              <Input label="Radio km" type="number" value={form.serviceRadiusKm} onChange={(v) => update("serviceRadiusKm", v)} />
              <Input label="Precio desde (€)" type="number" value={form.priceFrom} onChange={(v) => update("priceFrom", v)} />
            </div>
            <TextArea
              label="Zonas donde operas"
              rows={4}
              value={areasText}
              onChange={setAreasText}
              placeholder={"Madrid, Comunidad de Madrid, ES\nLisboa, Lisboa, PT"}
            />
            <Input label="Idiomas" value={form.languages} onChange={(v) => update("languages", v)} />
            <div className="grid sm:grid-cols-3 gap-3">
              <Check label="Seguro R. C." checked={form.insuranceDeclared} onChange={(v) => update("insuranceDeclared", v)} />
              <Check label="Trabaja con factura" checked={form.invoiceDeclared} onChange={(v) => update("invoiceDeclared", v)} />
              <Check label="Atiende urgencias" checked={form.offersUrgent} onChange={(v) => update("offersUrgent", v)} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-ink">Categorías profesionales</h2>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="accent-forest-600"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <h2 className="font-bold text-ink">Logo de empresa</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-canvas text-forest-700">
                {logoImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Camera size={28} />
                )}
              </div>
              <UploadButton kind="logo" label="Subir logo" disabled={uploading} onUpload={uploadFile} />
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="p-5">
              <h2 className="font-bold text-ink inline-flex items-center gap-2">
                <MapPin size={18} className="text-forest-600" /> Mapa público
              </h2>
              <p className="text-sm text-muted mt-1">{mapLabel}</p>
            </div>
            <iframe
              title="Mapa de operación"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapLabel)}&output=embed`}
              loading="lazy"
              className="block h-56 w-full border-0 bg-canvas-alt"
            />
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-ink">Trabajos realizados</h2>
              <span className="text-xs text-muted">{portfolio.length}/5</span>
            </div>
            <PortfolioUpload disabled={uploading || portfolio.length >= 5} onUpload={uploadFile} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {portfolio.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl bg-canvas">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl || item.afterImage} alt="" className="h-24 w-full object-cover" />
                  <p className="truncate px-2 py-1.5 text-xs text-ink">{item.title}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
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

function TextArea({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (value: string) => void; rows: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="reg-input mt-1.5 resize-none" />
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

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2.5 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-forest-600" />
      {label}
    </label>
  );
}

function UploadButton({ kind, label, disabled, onUpload }: { kind: string; label: string; disabled: boolean; onUpload: (data: FormData) => void }) {
  return (
    <label className={`btn btn-secondary text-sm ${disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}>
      <Upload size={16} /> {label}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const data = new FormData();
          data.set("kind", kind);
          data.set("file", file);
          onUpload(data);
          e.currentTarget.value = "";
        }}
      />
    </label>
  );
}

function PortfolioUpload({ disabled, onUpload }: { disabled: boolean; onUpload: (data: FormData) => void }) {
  const [meta, setMeta] = useState({ title: "", category: "", description: "", location: "" });

  return (
    <div className="mt-4 space-y-3 rounded-xl bg-canvas p-3">
      <Input label="Título" value={meta.title} onChange={(v) => setMeta((m) => ({ ...m, title: v }))} />
      <Input label="Categoría" value={meta.category} onChange={(v) => setMeta((m) => ({ ...m, category: v }))} />
      <TextArea label="Descripción" rows={2} value={meta.description} onChange={(v) => setMeta((m) => ({ ...m, description: v }))} />
      <Input label="Ubicación" value={meta.location} onChange={(v) => setMeta((m) => ({ ...m, location: v }))} />
      <label className={`btn btn-primary w-full text-sm ${disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}>
        <ImagePlus size={16} /> Subir foto de trabajo
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const data = new FormData();
            data.set("kind", "portfolio");
            data.set("file", file);
            data.set("title", meta.title || "Trabajo realizado");
            data.set("category", meta.category);
            data.set("description", meta.description);
            data.set("location", meta.location);
            onUpload(data);
            setMeta({ title: "", category: "", description: "", location: "" });
            e.currentTarget.value = "";
          }}
        />
      </label>
      {disabled && (
        <p className="text-xs text-muted inline-flex items-center gap-1">
          <CheckCircle2 size={13} /> Límite de 5 fotos alcanzado.
        </p>
      )}
    </div>
  );
}
