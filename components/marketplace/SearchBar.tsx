"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, LayoutGrid } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { citySearchLocations, countrySearchLocations } from "@/lib/data/locations";
import { useI18n, useT } from "@/lib/i18n/context";
import { useContent } from "@/lib/i18n/useLocalizedContent";
import { cn } from "@/lib/utils";

function locationLabel(
  location: (typeof citySearchLocations)[number] | (typeof countrySearchLocations)[number],
  locale: string,
) {
  const countries = new Intl.DisplayNames([locale], { type: "region" });
  const country = countries.of(location.countryCode) || location.country;
  if (location.scope === "country") return country;
  return location.city ? `${location.city}, ${country}` : country;
}

export function SearchBar({ variant = "hero" }: { variant?: "hero" | "inline" }) {
  const router = useRouter();
  const { locale } = useI18n();
  const t = useT();
  const content = useContent();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("cat", cat);
    if (loc) params.set("loc", loc);
    router.push(`/buscar${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full rounded-2xl bg-white p-2.5 shadow-elevated ring-1 ring-forest-600/10",
        "grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]",
        variant === "hero" ? "" : "shadow-soft",
      )}
    >
      <label className="flex items-center gap-2 rounded-xl bg-canvas px-3.5 py-3">
        <Search size={18} className="text-forest-500 shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchBar.what}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted text-ink"
          aria-label={t.searchBar.what}
        />
      </label>

      <label className="flex items-center gap-2 rounded-xl bg-canvas px-3.5 py-3">
        <MapPin size={18} className="text-forest-500 shrink-0" />
        <select
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="w-full bg-transparent text-sm outline-none text-ink cursor-pointer"
          aria-label={t.searchBar.where}
        >
          <option value="">{t.ui.searchPage.allEurope}</option>
          <optgroup label={t.ui.searchPage.countryGroup}>
            {countrySearchLocations.map((l) => (
              <option key={l.slug} value={l.slug}>{locationLabel(l, locale)}</option>
            ))}
          </optgroup>
          <optgroup label={t.ui.searchPage.cityRegionGroup}>
            {citySearchLocations.map((l) => (
              <option key={l.slug} value={l.slug}>{locationLabel(l, locale)}</option>
            ))}
          </optgroup>
        </select>
      </label>

      <label className="flex items-center gap-2 rounded-xl bg-canvas px-3.5 py-3">
        <LayoutGrid size={18} className="text-forest-500 shrink-0" />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="w-full bg-transparent text-sm outline-none text-ink cursor-pointer"
          aria-label={t.searchBar.category}
        >
          <option value="">{t.searchBar.category}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{content.categories[c.id].name}</option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn btn-primary md:px-7 justify-center">
        {t.searchBar.button}
      </button>
    </form>
  );
}
