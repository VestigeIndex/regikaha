"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Crosshair, ListFilter, Map, MapPin, Search, SlidersHorizontal, Star, X } from "lucide-react";
import type { Professional, SearchFilters, SortOption } from "@/lib/types";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";
import { categories, searchProfessionals } from "@/lib/data";
import { citySearchLocations, countrySearchLocations, getLocationBySlug } from "@/lib/data/locations";
import { europeanCountryOptions } from "@/lib/market";
import { coordinatesForCity, coverageStatus } from "@/lib/geo";
import { type Locale } from "@/lib/i18n/config";
import { useI18n, useT } from "@/lib/i18n/context";
import { useContent, useLocalizedProfessional } from "@/lib/i18n/useLocalizedContent";
import { cn } from "@/lib/utils";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { CoverageBadge } from "@/components/marketplace/CoverageBadge";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { CompareButton } from "@/components/marketplace/CompareButton";
import { RegiKahaMap } from "@/components/map/RegiKahaMap";
import { searchGeoDictionaries } from "@/lib/i18n/search-geo";

function countryName(code: string, locale: Locale): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code.toUpperCase()) || code;
  } catch {
    return europeanCountryOptions.find((country) => country.code === code)?.name || code;
  }
}

function parseLanguages(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.length ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function mapRemoteProfessional(row: any, locale: Locale, professionalLabel: string): Professional {
  const countryCode = row.country || "ES";
  const country = countryName(countryCode, locale);
  return {
    id: row.id,
    userId: row.user_id || "",
    slug: row.slug,
    type: row.type || "autonomo",
    typeLabel: row.type_label || professionalLabel,
    publicName: row.public_name || `${professionalLabel} RegiKaha`,
    legalName: row.legal_name || "",
    nifCif: row.nif_cif || "",
    email: row.email || "",
    phone: row.phone || "",
    city: row.city || "",
    province: row.region || "",
    autonomousCommunity: row.region || "",
    countryCode,
    country,
    locationSlug: (row.city || row.country || "market").toString().toLowerCase(),
    serviceArea: [row.city, row.region, country].filter(Boolean).join(", "),
    serviceRadiusKm: Number(row.service_radius_km || 30),
    latitude: row.search_latitude == null ? undefined : Number(row.search_latitude),
    longitude: row.search_longitude == null ? undefined : Number(row.search_longitude),
    distanceKm: row.distance_km == null ? undefined : Number(row.distance_km),
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
  const { locale } = useI18n();
  const t = useT();
  const content = useContent();
  const geoCopy = searchGeoDictionaries[locale];
  const params = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SortOption>("relevance");
  const [remoteResults, setRemoteResults] = useState<Professional[]>([]);
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">(mode === "map" ? "map" : "list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const latitudeParam = params.get("lat");
    const longitudeParam = params.get("lng");
    const radiusParam = params.get("radiusKm");
    const latitude = Number(latitudeParam);
    const longitude = Number(longitudeParam);
    const radiusKm = Number(radiusParam);
    setFilters((current) => ({
      ...current,
      query: params.get("q") ?? undefined,
      categoryId: params.get("cat") ?? undefined,
      locationSlug: params.get("loc") ?? undefined,
      countryCode: params.get("country") ?? undefined,
      region: params.get("region") ?? undefined,
      city: params.get("city") ?? undefined,
      latitude: latitudeParam !== null && Number.isFinite(latitude) ? latitude : undefined,
      longitude: longitudeParam !== null && Number.isFinite(longitude) ? longitude : undefined,
      radiusKm: radiusParam !== null && Number.isFinite(radiusKm) && radiusKm > 0 ? radiusKm : undefined,
    }));
  }, [params]);

  const { results: localResults } = useMemo(() => searchProfessionals(filters, sort), [filters, sort]);
  const remoteQuery = useMemo(() => {
    const q = new URLSearchParams();
    const loc = filters.locationSlug ? getLocationBySlug(filters.locationSlug) : undefined;
    if (filters.query) q.set("q", filters.query);
    if (filters.categoryId) q.set("cat", filters.categoryId);
    if (filters.countryCode || loc?.countryCode) q.set("country", filters.countryCode || loc?.countryCode || "");
    if (filters.region || filters.city || loc?.province || loc?.city) q.set("region", filters.region || filters.city || loc?.province || loc?.city || "");
    if (filters.city) q.set("city", filters.city);
    if (filters.radiusKm) q.set("radiusKm", String(filters.radiusKm));
    if (Number.isFinite(filters.latitude)) q.set("lat", String(filters.latitude));
    if (Number.isFinite(filters.longitude)) q.set("lng", String(filters.longitude));
    if (filters.minRating) q.set("minRating", String(filters.minRating));
    if (filters.verifiedOnly) q.set("verified", "1");
    if (filters.withInvoice) q.set("invoice", "1");
    if (filters.withInsurance) q.set("insurance", "1");
    if (filters.urgentOnly) q.set("urgent", "1");
    if (filters.withPortfolio) q.set("portfolio", "1");
    if (filters.language) q.set("language", filters.language);
    if (filters.professionalType) q.set("type", filters.professionalType);
    if (filters.maxPriceFrom) q.set("maxPrice", String(filters.maxPriceFrom));
    if (filters.minYearsExperience) q.set("minExperience", String(filters.minYearsExperience));
    q.set("sort", sort);
    return q.toString();
  }, [filters, sort]);

  useEffect(() => {
    let cancelled = false;
    async function loadRemote() {
      try {
        const res = await fetch(`/api/search${remoteQuery ? `?${remoteQuery}` : ""}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setRemoteResults((data.results || []).map((row: any) => mapRemoteProfessional(row, locale, t.ui.nav.forPros)));
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
  }, [locale, remoteQuery, t.ui.nav.forPros]);

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

  function selectLegacyLocation(value: string) {
    const location = value ? getLocationBySlug(value) : undefined;
    if (location?.city) {
      const coordinates = coordinatesForCity(location.city, location.countryCode);
      setFilters((current) => ({
        ...current,
        locationSlug: value,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        radiusKm: current.radiusKm || 25,
      }));
      return;
    }
    setFilters((current) => ({ ...current, locationSlug: value || undefined, latitude: undefined, longitude: undefined }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setFilters((current) => ({
        ...current,
        city: geoCopy.currentLocation,
        locationSlug: undefined,
        placeId: undefined,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        radiusKm: current.radiusKm || 25,
      })),
      () => window.alert(geoCopy.locationError),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  const filtersUI = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink inline-flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-forest-600" /> {t.ui.searchPage.filters}
        </h2>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-medium text-forest-700 hover:underline">
            {t.ui.searchPage.clear} ({activeCount})
          </button>
        )}
      </div>

      <Field label={t.ui.searchPage.searchLabel}>
        <div className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2.5">
          <Search size={16} className="text-forest-500" />
          <input
            value={filters.query ?? ""}
            onChange={(e) => update("query", e.target.value || undefined)}
            placeholder={t.ui.searchPage.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none text-ink placeholder:text-muted"
          />
        </div>
      </Field>

      <Field label={t.ui.searchPage.locationLabel}>
        <PlaceAutocomplete
          mode="search"
          country={filters.countryCode}
          placeholder={geoCopy.placeholder}
          onTextChange={(label) => {
            update("city", label || undefined);
            update("placeId", undefined);
            update("latitude", undefined);
            update("longitude", undefined);
          }}
          onChange={(place, label) => {
            update("placeId", place?.id);
            update("countryCode", place?.countryCode);
            update("city", place?.localityName || label || undefined);
            update("region", place?.admin1Name || place?.admin2Name || undefined);
            update("latitude", place?.latitude);
            update("longitude", place?.longitude);
            update("locationSlug", undefined);
            if (place && !filters.radiusKm) update("radiusKm", 25);
          }}
        />
        <div className="mt-2">
        <Select value={filters.locationSlug ?? ""} onChange={selectLegacyLocation}>
          <option value="">{t.ui.searchPage.allEurope}</option>
          <optgroup label={t.ui.searchPage.countryGroup}>
            {countrySearchLocations.map((location) => (
              <option key={location.slug} value={location.slug}>{countryName(location.countryCode, locale)}</option>
            ))}
          </optgroup>
          <optgroup label={t.ui.searchPage.cityRegionGroup}>
            {citySearchLocations.map((location) => (
              <option key={location.slug} value={location.slug}>
                {[location.city, countryName(location.countryCode, locale)].filter(Boolean).join(", ")}
              </option>
            ))}
          </optgroup>
        </Select>
        <button type="button" onClick={useMyLocation} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-800">
          <Crosshair size={15} /> {geoCopy.useMyLocation}
        </button>
        </div>
      </Field>

      <Field label={geoCopy.radius}>
        <Select
          value={filters.radiusKm ? String(filters.radiusKm) : ""}
          onChange={(value) => update("radiusKm", value ? Number(value) : undefined)}
        >
          <option value="">{geoCopy.unlimited}</option>
          <option value="10">10 km</option>
          <option value="25">25 km</option>
          <option value="50">50 km</option>
          <option value="100">100 km</option>
          <option value="250">250 km</option>
        </Select>
      </Field>

      <Field label={t.ui.common.category}>
        <Select value={filters.categoryId ?? ""} onChange={(value) => update("categoryId", value || undefined)}>
          <option value="">{t.ui.searchPage.allCategories}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{content.categories[category.id].name}</option>
          ))}
        </Select>
      </Field>

      <Field label={t.ui.searchPage.proTypeLabel}>
        <Select
          value={filters.professionalType ?? ""}
          onChange={(value) => update("professionalType", (value || undefined) as SearchFilters["professionalType"])}
        >
          {t.ui.searchPage.proTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </Field>

      <Field label={t.ui.searchPage.languageLabel}>
        <Select value={filters.language ?? ""} onChange={(value) => update("language", value || undefined)}>
          <option value="">{t.ui.searchPage.anyLanguage}</option>
          {content.languageOptions.map((language) => (
            <option key={language.value} value={language.value}>{language.label}</option>
          ))}
        </Select>
      </Field>

      <Field label={t.ui.searchPage.minRating}>
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
              {rating === 0 ? t.ui.common.all : <>{rating}<Star size={11} fill="currentColor" /></>}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t.ui.searchPage.features}>
        <div className="space-y-2.5">
          <Check label={t.ui.searchPage.verifiedOnly} checked={!!filters.verifiedOnly} onChange={() => toggle("verifiedOnly")} />
          <Check label={t.ui.searchPage.withInvoice} checked={!!filters.withInvoice} onChange={() => toggle("withInvoice")} />
          <Check label={t.ui.searchPage.withInsurance} checked={!!filters.withInsurance} onChange={() => toggle("withInsurance")} />
          <Check label={t.ui.searchPage.urgentOnly} checked={!!filters.urgentOnly} onChange={() => toggle("urgentOnly")} />
          <Check label={t.ui.searchPage.withPortfolio} checked={!!filters.withPortfolio} onChange={() => toggle("withPortfolio")} />
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
            <strong className="text-ink">{results.length}</strong> {t.ui.searchPage.visibleSummary}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/publicar-proyecto" className="btn btn-primary text-sm">
            {t.ui.actions.publishProjectFree}
          </Link>
          <Link href="/registro" className="btn btn-secondary text-sm">
            {t.ui.actions.imProZone}
          </Link>
        </div>
      </div>

      <div className="lg:hidden mb-4 grid grid-cols-2 gap-2 rounded-xl bg-canvas p-1">
        <button onClick={() => setMobileView("list")} className={cn("rounded-lg px-3 py-2 text-sm font-semibold", mobileView === "list" ? "bg-white shadow-soft text-ink" : "text-muted")}>
          {t.ui.searchPage.list}
        </button>
        <button onClick={() => setMobileView("map")} className={cn("rounded-lg px-3 py-2 text-sm font-semibold", mobileView === "map" ? "bg-white shadow-soft text-ink" : "text-muted")}>
          {t.ui.searchPage.map}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_minmax(380px,0.95fr)]">
        <aside className="hidden lg:block">
          <div className="card p-5 sticky top-24">{filtersUI}</div>
        </aside>

        <div className={cn("min-w-0", mobileView === "map" && "hidden lg:block")}>
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden btn btn-secondary text-sm py-2">
              <ListFilter size={15} /> {t.ui.searchPage.filters}{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <label className="ml-auto inline-flex items-center gap-2 text-sm">
              <span className="text-muted hidden sm:inline">{t.ui.searchPage.sort}</span>
              <Select value={sort} onChange={(value) => setSort(value as SortOption)} compact>
                {(Object.keys(t.ui.searchPage.sortLabels) as SortOption[]).map((key) => (
                  <option key={key} value={key}>{t.ui.searchPage.sortLabels[key]}</option>
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

        <aside className={cn("min-w-0 w-full max-w-full min-h-[520px] lg:sticky lg:top-24", mobileView === "list" && "hidden lg:block")}>
          <div className="card min-w-0 w-full max-w-full overflow-hidden">
            <div className="h-[520px] min-w-0 w-full max-w-full">
              <RegiKahaMap
                professionals={results}
                selectedId={selected?.id}
                onSelect={(professional) => setSelectedId(professional.id)}
                searchCenter={Number.isFinite(filters.latitude) && Number.isFinite(filters.longitude) ? { lat: Number(filters.latitude), lng: Number(filters.longitude) } : undefined}
                radiusKm={filters.radiusKm}
              />
            </div>
            {selected && (
              <div className="border-t hairline p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.searchPage.selectedOnMap}</p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{selected.publicName}</h3>
                    <SelectedMeta professional={selected} />
                  </div>
                  <span className="chip">{selected.averageRating ? `${selected.averageRating}/5` : t.ui.common.new}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`/profesionales/${selected.slug}`} className="btn btn-primary text-sm py-2">{t.ui.actions.viewProfile}</Link>
                  <Link href={`/profesionales/${selected.slug}#solicitar`} className="btn btn-secondary text-sm py-2">{t.ui.actions.requestPreEstimate}</Link>
                  <FavoriteButton compact />
                  <CompareButton compact />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <InfoCard icon={Map} title={t.ui.searchPage.infoCards[0].title} text={t.ui.searchPage.infoCards[0].text} />
        <InfoCard icon={Crosshair} title={t.ui.searchPage.infoCards[1].title} text={t.ui.searchPage.infoCards[1].text} />
        <InfoCard icon={Building2} title={t.ui.searchPage.infoCards[2].title} text={t.ui.searchPage.infoCards[2].text} />
      </section>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto h-full w-[88%] max-w-sm bg-white overflow-y-auto p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-ink">{t.ui.searchPage.filters}</span>
              <button onClick={() => setFiltersOpen(false)} className="grid place-items-center h-9 w-9 rounded-lg hover:bg-canvas" aria-label={t.ui.nav.closeMenu}>
                <X size={20} />
              </button>
            </div>
            {filtersUI}
            <button onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full mt-6">
              {t.ui.searchPage.showResults} {results.length} {results.length === 1 ? t.ui.common.result : t.ui.common.results}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function SelectedMeta({ professional }: { professional: Professional }) {
  const { locale } = useI18n();
  const geoCopy = searchGeoDictionaries[locale];
  const content = useContent();
  const displayProfessional = useLocalizedProfessional(professional);
  const primaryCategory = displayProfessional.categoryIds[0]
    ? content.categories[displayProfessional.categoryIds[0]]?.name
    : undefined;

  return (
    <p className="text-sm text-muted">
      {[
        primaryCategory,
        displayProfessional.city || displayProfessional.serviceArea,
        Number.isFinite(professional.distanceKm) ? geoCopy.distanceAway(Number(professional.distanceKm)) : null,
      ].filter(Boolean).join(" · ")}
    </p>
  );
}

function NoCoverageState() {
  const t = useT();
  return (
    <div className="card p-8 text-center">
      <MapPin size={28} className="mx-auto text-forest-600" />
      <h2 className="mt-3 font-bold text-ink">{t.ui.searchPage.noCoverageTitle}</h2>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        {t.ui.searchPage.noCoverageText}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link href="/publicar-proyecto" className="btn btn-primary text-sm">{t.ui.actions.publishProjectFree}</Link>
        <Link href="/registro" className="btn btn-secondary text-sm">{t.ui.actions.imProZone}</Link>
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
