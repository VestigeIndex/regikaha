"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, Search } from "lucide-react";
import { PlaceAutocomplete } from "@/components/geo/PlaceAutocomplete";
import type { PlaceSearchResult } from "@/lib/geo/types";
import { useI18n } from "@/lib/i18n/context";
import { marketsDictionaries } from "@/lib/i18n/markets";

export function MarketCoverageFinder({ country, countryName }: { country: string; countryName: string }) {
  const { locale } = useI18n();
  const copy = marketsDictionaries[locale].detail;
  const [place, setPlace] = useState<PlaceSearchResult | null>(null);

  const params = place
    ? new URLSearchParams({
        country,
        city: place.localityName || place.name,
        lat: String(place.latitude),
        lng: String(place.longitude),
        radiusKm: "25",
      })
    : null;

  return (
    <div className="mt-5 rounded-lg border hairline bg-canvas p-4 sm:p-5">
      <PlaceAutocomplete
        country={country}
        mode="search"
        allowCountryWide={false}
        label={countryName}
        onChange={(next) => setPlace(next)}
      />
      <a
        href="https://www.geonames.org/"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        {copy.geoDataAttribution}
      </a>
      {place && params ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="mr-auto min-w-0 text-sm font-semibold text-ink">{place.label}</p>
          <Link href={`/buscar?${params.toString()}`} className="btn btn-primary text-sm">
            <Search size={15} /> {copy.searchCountry}
          </Link>
          <Link href={`/mapa?${params.toString()}`} className="btn btn-secondary text-sm">
            <Map size={15} /> {copy.viewMap}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
