"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, ImagePlus, MapPin, Save, Upload } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";
import { categories } from "@/lib/data";
import { europeanCountryOptions } from "@/lib/market";
import { optimizeImageForUpload } from "@/packages/image-optimizer";
import { useI18n } from "@/lib/i18n/context";
import { dashboardDictionaries, type DashboardCopy } from "@/lib/i18n/dashboard";

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
  latitude: string;
  longitude: string;
  yearsExperience: string;
  serviceRadiusKm: string;
  serviceArea: string;
  priceFrom: string;
  languages: string;
  insuranceDeclared: boolean;
  invoiceDeclared: boolean;
  docsDeclared: boolean;
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
  latitude: "",
  longitude: "",
  yearsExperience: "0",
  serviceRadiusKm: "30",
  serviceArea: "",
  priceFrom: "0",
  languages: "Español",
  insuranceDeclared: false,
  invoiceDeclared: false,
  docsDeclared: false,
  offersUrgent: false,
};

export function ProfileManager() {
  const { locale } = useI18n();
  const t = dashboardDictionaries[locale].profile;
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [areasText, setAreasText] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [maxProfilePhotos, setMaxProfilePhotos] = useState(6);
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
          latitude: p.latitude == null ? "" : String(p.latitude),
          longitude: p.longitude == null ? "" : String(p.longitude),
          yearsExperience: String(p.years_experience || 0),
          serviceRadiusKm: String(p.service_radius_km || 30),
          serviceArea: p.service_area_note || "",
          priceFrom: String(p.price_from || 0),
          languages: languages.length ? languages.join(", ") : "Español",
          insuranceDeclared: !!p.insurance_declared,
          invoiceDeclared: !!p.invoice_declared,
          docsDeclared: !!p.docs_declared,
          offersUrgent: !!p.offers_urgent,
        });
        setSelectedCategories(me.categories || []);
        setAreasText((me.areas || []).map((a: any) => [a.city, a.region, a.country].filter(Boolean).join(", ")).join("\n"));
        setLogoImage(p.logo_image || port.logoImage || null);
      }
      setPortfolio(port.items || []);
      setMaxProfilePhotos(Number(port.limits?.profilePhotos || 6));
      setLoading(false);
    }
    load().catch(() => {
      setError(t.loadError);
      setLoading(false);
    });
  }, [t.loadError]);

  const mapLabel = useMemo(
    () => [form.city, form.region, form.country].filter(Boolean).join(", ") || t.activeMarkets,
    [form.city, form.region, form.country, t.activeMarkets],
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
    const areas = lines.map((line, index) => {
      const [city = "", region = "", country = form.country] = line.split(",").map((part) => part.trim());
      const isMainArea = index === 0 || city.toLowerCase() === form.city.toLowerCase();
      return {
        city,
        region,
        country: country || form.country,
        latitude: isMainArea ? Number(form.latitude) || null : null,
        longitude: isMainArea ? Number(form.longitude) || null : null,
      };
    });
    if (!areas.length) areas.push({ city: form.city, region: form.region, country: form.country, latitude: Number(form.latitude) || null, longitude: Number(form.longitude) || null });
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
      if (!res.ok) throw new Error(data.error || t.saveError);
      setMessage(t.saveOk);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(formData: FormData) {
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const source = formData.get("file");
      if (!(source instanceof File)) throw new Error(t.imageInvalid);
      const optimized = await optimizeImageForUpload(source, maxProfilePhotos > 6 ? "europa_pro" : "autonomo_nacional");
      formData.set("file", optimized.image.file);
      formData.set("thumbnail", optimized.thumbnail.file);
      formData.set("width", String(optimized.image.width));
      formData.set("height", String(optimized.image.height));
      const res = await fetch("/api/portfolio", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.uploadError);
      if (data.logoImage) setLogoImage(data.logoImage);
      if (data.item) setPortfolio((items) => [data.item, ...items]);
      setMessage(t.uploadOk);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploadError);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title={t.title} subtitle={t.loadingSubtitle} />
        <div className="card p-8 text-sm text-muted">{t.preparing}</div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title={t.title}
        subtitle={t.subtitle}
        action={
          <button onClick={saveProfile} disabled={saving} className="btn btn-primary text-sm">
            <Save size={16} /> {saving ? t.saving : t.save}
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
            <h2 className="font-bold text-ink">{t.basicData}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={t.publicName} value={form.publicName} onChange={(v) => update("publicName", v)} />
              <Input label={t.legalName} value={form.legalName} onChange={(v) => update("legalName", v)} />
              <Input label={t.nifCif} value={form.nifCif} onChange={(v) => update("nifCif", v)} />
              <Input label={t.phone} value={form.phone} onChange={(v) => update("phone", v)} />
            </div>
            <Input label={t.seoTagline} value={form.tagline} onChange={(v) => update("tagline", v)} />
            <TextArea label={t.publicDescription} rows={5} value={form.description} onChange={(v) => update("description", v)} />
          </section>

          <section className="card p-6 space-y-4">
            <h2 className="font-bold text-ink">{t.servicesScope}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Select label={t.baseCountry} value={form.country} onChange={(v) => update("country", v)}>
                {europeanCountryOptions.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </Select>
              <div className="md:col-span-2">
                <PlaceAutocomplete
                  country={form.country}
                  value={form.city}
                  mode="professional"
                  label={t.mainCity}
                  onTextChange={(value) => update("city", value)}
                  onChange={(place, label) => {
                    update("city", place?.localityName || label);
                    update("region", place?.admin1Name || place?.admin2Name || "");
                    update("latitude", place ? String(place.latitude) : "");
                    update("longitude", place ? String(place.longitude) : "");
                    if (place?.countryCode) update("country", place.countryCode);
                  }}
                />
              </div>
              <Input label={t.yearsExperience} type="number" value={form.yearsExperience} onChange={(v) => update("yearsExperience", v)} />
              <Input label={t.radiusKm} type="number" value={form.serviceRadiusKm} onChange={(v) => update("serviceRadiusKm", v)} />
              <Input label={t.priceFrom} type="number" value={form.priceFrom} onChange={(v) => update("priceFrom", v)} />
            </div>
            <TextArea
              label={t.areasLabel}
              rows={4}
              value={areasText}
              onChange={setAreasText}
              placeholder={t.areasPlaceholder}
            />
            <Input label={t.coverageNote} value={form.serviceArea} onChange={(v) => update("serviceArea", v)} />
            <Input label={t.languages} value={form.languages} onChange={(v) => update("languages", v)} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Check label={t.insurance} checked={form.insuranceDeclared} onChange={(v) => update("insuranceDeclared", v)} />
              <Check label={t.invoice} checked={form.invoiceDeclared} onChange={(v) => update("invoiceDeclared", v)} />
              <Check label={t.docs} checked={form.docsDeclared} onChange={(v) => update("docsDeclared", v)} />
              <Check label={t.urgent} checked={form.offersUrgent} onChange={(v) => update("offersUrgent", v)} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-ink">{t.categories}</h2>
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
            <h2 className="font-bold text-ink">{t.logo}</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-canvas text-forest-700">
                {logoImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Camera size={28} />
                )}
              </div>
              <UploadButton kind="logo" label={t.uploadLogo} disabled={uploading} onUpload={uploadFile} />
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="p-5">
              <h2 className="font-bold text-ink inline-flex items-center gap-2">
                <MapPin size={18} className="text-forest-600" /> {t.publicMap}
              </h2>
              <p className="text-sm text-muted mt-1">{mapLabel}</p>
            </div>
            <iframe
              title={t.publicMap}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapLabel)}&output=embed`}
              loading="lazy"
              className="block h-56 w-full border-0 bg-canvas-alt"
            />
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-ink">{t.portfolio}</h2>
              <span className="text-xs text-muted">{portfolio.length}/{Math.max(0, maxProfilePhotos - (logoImage ? 1 : 0))}</span>
            </div>
            <PortfolioUpload disabled={uploading || portfolio.length >= Math.max(0, maxProfilePhotos - (logoImage ? 1 : 0))} onUpload={uploadFile} copy={t} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {portfolio.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl bg-canvas">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumbnailUrl || item.imageUrl || item.afterImage} alt="" className="h-24 w-full object-cover" />
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

function PortfolioUpload({ disabled, onUpload, copy }: { disabled: boolean; onUpload: (data: FormData) => void; copy: DashboardCopy["profile"] }) {
  const [meta, setMeta] = useState({ title: "", category: "", description: "", location: "" });

  return (
    <div className="mt-4 space-y-3 rounded-xl bg-canvas p-3">
      <Input label={copy.fieldTitle} value={meta.title} onChange={(v) => setMeta((m) => ({ ...m, title: v }))} />
      <Input label={copy.fieldCategory} value={meta.category} onChange={(v) => setMeta((m) => ({ ...m, category: v }))} />
      <TextArea label={copy.fieldDescription} rows={2} value={meta.description} onChange={(v) => setMeta((m) => ({ ...m, description: v }))} />
      <Input label={copy.fieldLocation} value={meta.location} onChange={(v) => setMeta((m) => ({ ...m, location: v }))} />
      <label className={`btn btn-primary w-full text-sm ${disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}>
        <ImagePlus size={16} /> {copy.uploadWork}
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
            data.set("title", meta.title || copy.defaultWorkTitle);
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
          <CheckCircle2 size={13} /> {copy.photoLimit}
        </p>
      )}
    </div>
  );
}
