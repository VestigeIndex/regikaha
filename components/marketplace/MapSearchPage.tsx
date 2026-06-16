"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Crosshair, ListFilter, Map, MapPin, Search, SlidersHorizontal, Star, X } from "lucide-react";
import type { Professional, SearchFilters, SortOption } from "@/lib/types";
import { categories, languageOptions, searchProfessionals } from "@/lib/data";
import { citySearchLocations, countrySearchLocations, getLocationBySlug } from "@/lib/data/locations";
import { europeMarket, europeanCountryOptions } from "@/lib/market";
import { coverageStatus, primaryCategoryName } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { CoverageBadge } from "@/components/marketplace/CoverageBadge";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { CompareButton } from "@/components/marketplace/CompareButton";
import { RegiKahaMap } from "@/components/map/RegiKahaMap";

const sortLabels: Record<SortOption, string> = {
  relevance: "Más relevante",
  rating: "Mejor valoración",
  price: "Precio orientativo",
  projects: "Más proyectos",
  response: "Respuesta rápida",
  experience: "Más experiencia",
};

const proTypes: { value: string; label: string }[] = [
  { value: "", label: "Cualquier tipo" },
  { value: "empresa_reformas", label: "Empresa de reformas" },
  { value: "autonomo", label: "Autónomo" },
  { value: "instalador", label: "Instalador" },
  { value: "estudio_arquitectura", label: "Arquitectura" },
  { value: "ingenieria", label: "Ingeniería" },
  { value: "multiservicio", label: "Multiservicio" },
];

function countryName(code: string): string {
  return europeanCountryOptions.find((country) => country.code === code)?.name || code || europeMarket.primaryCountry;
}

function parseLanguages(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return ["Español"];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.length ? parsed.map(String) : ["Español"];
  } catch {
    return ["Español"];
  }
}

function mapRemoteProfessional(row: any): Professional {
  const countryCode = row.country || europeMarket.primaryCountryCode;
  return {
    id: row.id,
    userId: row.user_id || "",
    slug: row.slug,
    type: row.type || "autonomo",
    typeLabel: row.type_label || "Profesional",
    publicName: row.public_name || "Profesional RegiKaha",
    legalName: row.legal_name || "",
    nifCif: row.nif_cif || "",
    email: row.email || "",
    phone: row.phone || "",
    city: row.city || "",
    province: row.region || "",
    autonomousCommunity: row.region || "",
    countryCode,
    country: countryName(countryCode),
    locationSlug: (row.city || row.country || "europa").toString().toLowerCase(),
    serviceArea: [row.city, row.region, countryName(countryCode)].filter(Boolean).join(", "),
    serviceRadiusKm: Number(row.service_radius_km || 30),
    categoryIds: row.category_ids || [],
    specialties: [],
    yearsExperience: Number(row.years_experience || 0),
    languages: parseLanguages(row.languages),
    verificationStatus: row.verification_status || "pending",
    insuranceDeclared: !!row.insurance_declared,
    invoiceDeclared: !!row.invoice_declared,
    offersUrgent: !!row.offers_urgent,
    certifications: [],
    averageRating: Number(row.average_rating || 0),
    reviewCount: Number(row.review_count || 0),
    completedProjects: Number(row.completed_projects || row.portfolio_count || 0),
    responseTimeHours: Number(row.response_time_hours || 24),
    priceFrom: Number(row.price_from || 0),
    description: row.description || "",
    shortTagline: row.short_tagline || row.description || "",
    logoColor: row.logo_color || "#198C68",
    logoImage: row.logo_image || null,
    coverImage: row.cover_image || "/images/photos/ventanas.webp",
    founderMember: false,
    activeStatus: !!row.active_status,
    joinedAt: row.created_at || new Date().toISOString(),
  };
}

export function MapSearchPage({ mode = "search" }: { mode?: "search" | "map" }) {
  const params = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SortOption>("relevance");
  const [remoteResults, setRemoteResults] = useState<Professional[]>([]);
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">(mode === "map" ? "map" : "list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      query: params.get("q") ?? undefined,
      categoryId: params.get("cat") ?? undefined,
      locationSlug: params.get("loc") ?? undefined,
    }));
  }, [params]);

  const { results: localResults } = useMemo(() => searchProfessionals(filters, sort), [filters, sort]);
  const remoteQuery = useMemo(() => {
    const q = new URLSearchParams();
    const loc = filters.locationSlug ? getLocationBySlug(filters.locationSlug) : undefined;
    if (filters.query) q.set("q", filters.query);
    if (filters.categoryId) q.set("cat", filters.categoryId);
    if (loc?.countryCode) q.set("country", loc.countryCode);
    if (loc?.province || loc?.city) q.set("region", loc.province || loc.city || "");
    return q.toString();
  }, [filters.categoryId, filters.locationSlug, filters.query]);

  useEffect(() => {
    let cancelled = false;
    async function loadRemote() {
      try {
        const res = await fetch(`/api/search${remoteQuery ? `?${remoteQuery}` : ""}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setRemoteResults((data.results || []).map(mapRemoteProfessional));
          setRemoteLoaded(true);
        }
      } catch {
        if (!cancelled) setRemoteLoaded(false);
      }
    }
    loadRemote();
    return () => {
      cancelled = true;
    };
  }, [remoteQuery]);

  const results = useMemo(() => {
    if (!remoteLoaded) return localResults;
    const remoteSlugs = new Set(remoteResults.map((p) => p.slug));
    return [...remoteResults, ...localResults.filter((p) => !remoteSlugs.has(p.slug))];
  }, [localResults, remoteLoaded, remoteResults]);

  const selected = results.find((p) => p.id === selectedId) || results[0] || null;
  const coverage = coverageStatus(results.length, 0);
  const activeCount = Object.values(filters).filter((v) => v !== undefined && v !== "" && v !== false).length;

  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggle(key: keyof SearchFilters) {
    setFilters((current) => ({ ...current, [key]: current[key] ? undefined : true }));
  }

  function clearAll() {
    setFilters({});
    setSort("relevance");
    setSelectedId(null);
  }

  const filtersUI = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink inline-flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-forest-600" /> Filtros
        </h2>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-medium text-forest-700 hover:underline">
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <Field label="Buscar">
        <div className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2.5">
          <Search size={16} className="text-forest-500" />
          <input
            value={filters.query ?? ""}
            onChange={(e) => update("query", e.target.value || undefined)}
            placeholder="Servicio, obra, subcontrata..."
            className="w-full bg-transparent text-sm outline-none text-ink placeholder:text-muted"
          />
        </div>
      </Field>

      <Field label="Ubicación">
        <Select value={filters.locationSlug ?? ""} onChange={(value) => update("locationSlug", value || undefined)}>
          <option value="">{europeMarket.label}</option>
          <optgroup label="País">
            {countrySearchLocations.map((location) => (
              <option key={location.slug} value={location.slug}>{location.label}</option>
            ))}
          </optgroup>
          <optgroup label="Ciudad o región">
            {citySearchLocations.map((location) => (
              <option key={location.slug} value={location.slug}>{location.label}</option>
            ))}
          </optgroup>
        </Select>
      </Field>

      <Field label="Categoría">
        <Select value={filters.categoryId ?? ""} onChange={(value) => update("categoryId", value || undefined)}>
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
      </Field>

      <Field label="Tipo de profesional">
        <Select
          value={filters.professionalType ?? ""}
          onChange={(value) => update("professionalType", (value || undefined) as SearchFilters["professionalType"])}
        >
          {proTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </Field>

      <Field label="Idioma">
        <Select value={filters.language ?? ""} onChange={(value) => update("language", value || undefined)}>
          <option value="">Cualquier idioma</option>
          {languageOptions.slice(0, 12).map((language) => (
            <option key={language} value={language}>{language}</option>
          ))}
        </Select>
      </Field>

      <Field label="Valoración mínima">
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => update("minRating", rating === 0 ? undefined : rating)}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium ring-1 transition-colors",
                (filters.minRating ?? 0) === rating
                  ? "bg-forest-600 text-white ring-forest-600"
                  : "bg-white text-ink ring-forest-600/15 hover:bg-mint",
              )}
            >
              {rating === 0 ? "Todas" : <>{rating}<Star size={11} fill="currentColor" /></>}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Características">
        <div className="space-y-2.5">
          <Check label="Solo verificados" checked={!!filters.verifiedOnly} onChange={() => toggle("verifiedOnly")} />
          <Check label="Trabaja con factura" checked={!!filters.withInvoice} onChange={() => toggle("withInvoice")} />
          <Check label="Con seguro de R. C." checked={!!filters.withInsurance} onChange={() => toggle("withInsurance")} />
          <Check label="Atiende urgencias" checked={!!filters.urgentOnly} onChange={() => toggle("urgentOnly")} />
          <Check label="Con portfolio" checked={!!filters.withPortfolio} onChange={() => toggle("withPortfolio")} />
        </div>
      </Field>
    </div>
  );

  return (
    <section className="container-x py-8 lg:py-10">
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <CoverageBadge status={coverage} />
          <span className="text-sm text-muted">
            <strong className="text-ink">{results.length}</strong> profesionales y empresas visibles en esta búsqueda.
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/publicar-proyecto" className="btn btn-primary text-sm">
            Publicar mi proyecto gratis
          </Link>
          <Link href="/registro" className="btn btn-secondary text-sm">
            Soy profesional en esta zona
          </Link>
        </div>
      </div>

      <div className="lg:hidden mb-4 grid grid-cols-2 gap-2 rounded-xl bg-canvas p-1">
        <button onClick={() => setMobileView("list")} className={cn("rounded-lg px-3 py-2 text-sm font-semibold", mobileView === "list" ? "bg-white shadow-soft text-ink" : "text-muted")}>
          Lista
        </button>
        <button onClick={() => setMobileView("map")} className={cn("rounded-lg px-3 py-2 text-sm font-semibold", mobileView === "map" ? "bg-white shadow-soft text-ink" : "text-muted")}>
          Mapa
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_minmax(380px,0.95fr)]">
        <aside className="hidden lg:block">
          <div className="card p-5 sticky top-24">{filtersUI}</div>
        </aside>

        <div className={cn("min-w-0", mobileView === "map" && "hidden lg:block")}>
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden btn btn-secondary text-sm py-2">
              <ListFilter size={15} /> Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <label className="ml-auto inline-flex items-center gap-2 text-sm">
              <span className="text-muted hidden sm:inline">Ordenar:</span>
              <Select value={sort} onChange={(value) => setSort(value as SortOption)} compact>
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <option key={key} value={key}>{sortLabels[key]}</option>
                ))}
              </Select>
            </label>
          </div>

          {results.length === 0 ? (
            <NoCoverageState />
          ) : (
            <div className="grid gap-4">
              {results.map((professional) => (
                <button
                  key={professional.id}
                  type="button"
                  onClick={() => setSelectedId(professional.id)}
                  className={cn("block text-left rounded-[1.2rem]", selectedId === professional.id && "ring-2 ring-forest-500")}
                >
                  <ProfessionalCard pro={professional} />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className={cn("min-h-[520px] lg:sticky lg:top-24", mobileView === "list" && "hidden lg:block")}>
          <div className="card overflow-hidden">
            <div className="h-[520px]">
              <RegiKahaMap professionals={results} selectedId={selected?.id} onSelect={(professional) => setSelectedId(professional.id)} />
            </div>
            {selected && (
              <div className="border-t hairline p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Seleccionado en el mapa</p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{selected.publicName}</h3>
                    <p className="text-sm text-muted">{primaryCategoryName(selected)} · {selected.city || selected.serviceArea}</p>
                  </div>
                  <span className="chip">{selected.averageRating ? `${selected.averageRating}/5` : "Nuevo"}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/profesionales/${selected.slug}`} className="btn btn-primary text-sm py-2">Ver perfil</Link>
                  <Link href={`/profesionales/${selected.slug}#solicitar`} className="btn btn-secondary text-sm py-2">Pedir pre-presupuesto</Link>
                  <FavoriteButton compact />
                  <CompareButton compact />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Map} title="Mapa europeo" text="Explora profesionales, empresas y subcontratas por país, ciudad, categoría, valoración y disponibilidad." />
        <InfoCard icon={Crosshair} title="Zonas sin cobertura" text="Si aún no hay profesionales en una zona, capturamos tu demanda y activamos captación local." />
        <InfoCard icon={Building2} title="B2B y subcontratas" text="Constructoras y empresas pueden publicar necesidades de subcontrata por especialidad y ciudad." />
      </section>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto h-full w-[88%] max-w-sm bg-white overflow-y-auto p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-ink">Filtros</span>
              <button onClick={() => setFiltersOpen(false)} className="grid place-items-center h-9 w-9 rounded-lg hover:bg-canvas" aria-label="Cerrar filtros">
                <X size={20} />
              </button>
            </div>
            {filtersUI}
            <button onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full mt-6">
              Ver {results.length} {results.length === 1 ? "resultado" : "resultados"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function NoCoverageState() {
  return (
    <div className="card p-8 text-center">
      <MapPin size={28} className="mx-auto text-forest-600" />
      <h2 className="mt-3 font-bold text-ink">Estamos verificando profesionales en esta zona</h2>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Publica tu proyecto gratis y te avisaremos cuando haya opciones disponibles. También activaremos captación de profesionales fundadores en esa ciudad y categoría.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link href="/publicar-proyecto" className="btn btn-primary text-sm">Publicar proyecto gratis</Link>
        <Link href="/registro" className="btn btn-secondary text-sm">Soy profesional en esta zona</Link>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Map; title: string; text: string }) {
  return (
    <article className="card p-5">
      <Icon size={20} className="text-forest-600" />
      <h3 className="mt-3 font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-muted leading-relaxed">{text}</p>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{label}</p>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  compact,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-xl bg-white ring-1 ring-forest-600/15 text-sm text-ink outline-none cursor-pointer focus:ring-forest-500",
        compact ? "px-3 py-2" : "px-3 py-2.5",
      )}
    >
      {children}
    </select>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={cn(
          "grid place-items-center h-5 w-5 rounded-md ring-1 transition-colors",
          checked ? "bg-forest-600 ring-forest-600 text-white" : "bg-white ring-forest-600/25 group-hover:ring-forest-500",
        )}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5L5 9l4.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm text-ink">{label}</span>
    </label>
  );
}
