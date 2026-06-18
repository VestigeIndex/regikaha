"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { activeMarkets, countryFlagEmoji } from "@/lib/market";
import { citySearchLocations } from "@/lib/data/locations";
import { marketsDictionaries } from "@/lib/i18n/markets";
import { useI18n } from "@/lib/i18n/context";

function countryName(code: string, locale: string, fallback: string) {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) || fallback;
  } catch {
    return fallback;
  }
}

export function ActiveMarkets() {
  const { locale } = useI18n();
  const copy = marketsDictionaries[locale].home;

  return (
    <section className="container-x py-14">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <p className="eyebrow"><MapPin size={15} /> {copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink text-balance">{copy.title}</h2>
          <p className="mt-4 text-muted leading-relaxed">{copy.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="chip">{activeMarkets.length} {copy.statsCountries}</span>
            <span className="chip">{citySearchLocations.length} {copy.statsCities}</span>
          </div>
          <Link href="/mercados" className="btn btn-secondary mt-7">
            {copy.viewAll} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {activeMarkets.map((market) => {
            const name = countryName(market.code, locale, market.name);
            const cities = citySearchLocations.filter((city) => city.countryCode === market.code);
            return (
              <Link
                key={market.code}
                href={`/mercados/${market.slug}`}
                className="card card-hover p-4 group"
                aria-label={`${copy.openMarket}: ${name}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-5 w-7 items-center justify-center rounded-[3px] text-[18px] leading-none shadow-[0_0_0_1px_rgba(15,92,74,0.16)]"
                    aria-hidden="true"
                  >
                    {countryFlagEmoji(market.flagCountry)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink group-hover:text-forest-700 transition-colors">{name}</h3>
                    <p className="mt-0.5 text-xs text-muted">{cities.length} {copy.statsCities}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted line-clamp-2">
                  {cities.slice(0, 3).map((city) => city.city).join(", ")}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
