"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import type { PlaceSearchResult } from "@/lib/geo/types";
import { searchPlaces } from "@/lib/geo/search";
import { cn } from "@/lib/utils";

export type PlaceAutocompleteMode = "project" | "professional" | "company" | "subcontractor" | "search";

interface PlaceAutocompleteProps {
  country?: string;
  value?: string;
  mode?: PlaceAutocompleteMode;
  namePrefix?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  allowCountryWide?: boolean;
  allowPostalCode?: boolean;
  className?: string;
  inputClassName?: string;
  onChange?: (place: PlaceSearchResult | null, label: string) => void;
  onTextChange?: (label: string) => void;
}

const defaultPlaceholder: Record<PlaceAutocompleteMode, string> = {
  project: "Ciudad, pueblo o código postal",
  professional: "Ciudad o zona principal de trabajo",
  company: "Ciudad o zona de operación",
  subcontractor: "Ciudad o zona disponible",
  search: "Buscar ciudad, pueblo o código postal",
};

function preferredCity(place: PlaceSearchResult | null, fallback: string) {
  if (!place) return fallback.trim();
  return (place.localityName || place.admin2Name || place.admin1Name || place.name || fallback).trim();
}

export function PlaceAutocomplete({
  country = "",
  value = "",
  mode = "search",
  namePrefix = "place",
  placeholder,
  label,
  required,
  allowCountryWide = mode === "search",
  allowPostalCode = true,
  className,
  inputClassName,
  onChange,
  onTextChange,
}: PlaceAutocompleteProps) {
  const id = useId();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState(value);
  const [selected, setSelected] = useState<PlaceSearchResult | null>(null);
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  useEffect(() => {
    const text = query.trim();
    if (text.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: text, limit: "8" });
        if (country) params.set("country", country);
        const response = await fetch(`/api/geo/search?${params.toString()}`);
        if (!response.ok) throw new Error("Geo search failed");
        const data = await response.json();
        const nextResults = Array.isArray(data.results) ? data.results : [];
        if (!cancelled) setResults(nextResults.length ? nextResults : searchPlaces({ q: text, country, limit: 8 }));
      } catch {
        if (!cancelled) setResults(searchPlaces({ q: text, country, limit: 8 }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 240);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [country, query]);

  const visibleResults = useMemo(() => {
    return results.filter((place) => {
      if (!allowCountryWide && place.placeType === "country") return false;
      if (!allowPostalCode && place.placeType === "postal_code") return false;
      return true;
    });
  }, [allowCountryWide, allowPostalCode, results]);

  const hiddenCity = preferredCity(selected, query);
  const hiddenRegion = selected?.admin1Name || selected?.admin2Name || "";
  const hiddenCountry = selected?.countryCode || country;

  function updateText(next: string) {
    setQuery(next);
    setSelected(null);
    setOpen(true);
    onTextChange?.(next);
    onChange?.(null, next);
  }

  function choose(place: PlaceSearchResult) {
    const nextLabel = place.label;
    setSelected(place);
    setQuery(nextLabel);
    setOpen(false);
    onTextChange?.(preferredCity(place, nextLabel));
    onChange?.(place, nextLabel);
  }

  function clear() {
    setSelected(null);
    setQuery("");
    setResults([]);
    setOpen(false);
    onTextChange?.("");
    onChange?.(null, "");
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </label>
      )}
      <div className={cn("relative", label && "mt-1.5")}>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-500" />
        <input
          id={id}
          value={query}
          onChange={(event) => updateText(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || defaultPlaceholder[mode]}
          required={required}
          className={cn("reg-input pl-9 pr-10", inputClassName)}
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading && <Loader2 size={15} className="animate-spin text-muted" />}
          {query && (
            <button
              type="button"
              onClick={clear}
              className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-white hover:text-ink"
              aria-label="Borrar ubicación"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <input type="hidden" name={`${namePrefix}Id`} value={selected?.id || ""} />
      <input type="hidden" name={`${namePrefix}Slug`} value={selected?.slug || ""} />
      <input type="hidden" name={`${namePrefix}Country`} value={hiddenCountry} />
      <input type="hidden" name="city" value={hiddenCity} />
      <input type="hidden" name="region" value={hiddenRegion} />
      <input type="hidden" name={`${namePrefix}PostalCode`} value={selected?.postalCode || ""} />
      <input type="hidden" name={`${namePrefix}Latitude`} value={selected?.latitude ?? ""} />
      <input type="hidden" name={`${namePrefix}Longitude`} value={selected?.longitude ?? ""} />
      <input type="hidden" name={`${namePrefix}Label`} value={query} />

      {open && query.trim().length >= 2 && (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl bg-white p-2 shadow-elevated ring-1 ring-forest-600/10">
          {visibleResults.length > 0 ? (
            <ul className="space-y-1">
              {visibleResults.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => choose(place)}
                    className="flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left hover:bg-mint"
                  >
                    <MapPin size={16} className="mt-0.5 shrink-0 text-forest-600" />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{place.name}</span>
                      <span className="block text-xs text-muted">{place.label}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl bg-canvas px-3 py-2 text-sm text-muted">
              {loading ? "Buscando ubicación..." : "No hay coincidencias exactas. Puedes mantener el texto escrito."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
