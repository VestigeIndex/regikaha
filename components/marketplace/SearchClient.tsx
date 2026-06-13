"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Star, Search } from "lucide-react";
import type { SearchFilters, SortOption } from "@/lib/types";
import { searchProfessionals, categories, locations, languageOptions } from "@/lib/data";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { cn } from "@/lib/utils";

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
  { value: "estudio_arquitectura", label: "Estudio de arquitectura" },
  { value: "ingenieria", label: "Ingeniería" },
  { value: "multiservicio", label: "Multiservicio" },
];

export function SearchClient() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SortOption>("relevance");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Inicializa desde la URL (?q, ?cat, ?loc).
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      query: params.get("q") ?? undefined,
      categoryId: params.get("cat") ?? undefined,
      locationSlug: params.get("loc") ?? undefined,
    }));
  }, [params]);

  const { results, total } = useMemo(() => searchProfessionals(filters, sort), [filters, sort]);

  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }
  function toggle(key: keyof SearchFilters) {
    setFilters((f) => ({ ...f, [key]: f[key] ? undefined : true }));
  }
  function clearAll() {
    setFilters({});
    setSort("relevance");
  }

  const activeCount = Object.values(filters).filter((v) => v !== undefined && v !== "" && v !== false).length;

  const filtersUI = (
    <div className="space-y-6">
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
            placeholder="Servicio o palabra clave"
            className="w-full bg-transparent text-sm outline-none text-ink placeholder:text-muted"
          />
        </div>
      </Field>

      <Field label="Categoría">
        <Select value={filters.categoryId ?? ""} onChange={(v) => update("categoryId", v || undefined)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </Field>

      <Field label="Ubicación">
        <Select value={filters.locationSlug ?? ""} onChange={(v) => update("locationSlug", v || undefined)}>
          <option value="">Toda España</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>{l.city}</option>
          ))}
        </Select>
      </Field>

      <Field label="Valoración mínima">
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => update("minRating", r === 0 ? undefined : r)}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium ring-1 transition-colors",
                (filters.minRating ?? 0) === r
                  ? "bg-forest-600 text-white ring-forest-600"
                  : "bg-white text-ink ring-forest-600/15 hover:bg-mint",
              )}
            >
              {r === 0 ? "Todas" : <>{r}<Star size={11} fill="currentColor" /></>}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Tipo de profesional">
        <Select
          value={filters.professionalType ?? ""}
          onChange={(v) => update("professionalType", (v || undefined) as SearchFilters["professionalType"])}
        >
          {proTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
      </Field>

      <Field label="Idioma">
        <Select value={filters.language ?? ""} onChange={(v) => update("language", v || undefined)}>
          <option value="">Cualquier idioma</option>
          {languageOptions.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
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
    <div className="container-x py-10 lg:py-12">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="card p-5 sticky top-24">{filtersUI}</div>
        </aside>

        {/* Resultados */}
        <div>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{total}</span>{" "}
              {total === 1 ? "profesional encontrado" : "profesionales encontrados"}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden btn btn-secondary text-sm py-2"
              >
                <SlidersHorizontal size={15} /> Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
              <label className="inline-flex items-center gap-2 text-sm">
                <span className="text-muted hidden sm:inline">Ordenar:</span>
                <Select value={sort} onChange={(v) => setSort(v as SortOption)} compact>
                  {(Object.keys(sortLabels) as SortOption[]).map((s) => (
                    <option key={s} value={s}>{sortLabels[s]}</option>
                  ))}
                </Select>
              </label>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-ink font-semibold">No hay profesionales con esos filtros</p>
              <p className="text-sm text-muted mt-1">Prueba a ampliar la búsqueda o limpiar filtros.</p>
              <button onClick={clearAll} className="btn btn-primary mt-5">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} />
              ))}
            </div>
          )}

          <p className="mt-8 text-xs text-muted text-center">
            Resultados ordenados por mérito (valoración, experiencia y respuesta). Nunca por pago.
          </p>
        </div>
      </div>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto h-full w-[88%] max-w-sm bg-white overflow-y-auto p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-ink">Filtros</span>
              <button onClick={() => setMobileOpen(false)} className="grid place-items-center h-9 w-9 rounded-lg hover:bg-canvas" aria-label="Cerrar filtros">
                <X size={20} />
              </button>
            </div>
            {filtersUI}
            <button onClick={() => setMobileOpen(false)} className="btn btn-primary w-full mt-6">
              Ver {total} {total === 1 ? "resultado" : "resultados"}
            </button>
          </div>
        </div>
      )}
    </div>
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
  onChange: (v: string) => void;
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
