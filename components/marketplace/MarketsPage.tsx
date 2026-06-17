"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Map, MapPin, Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { categories } from "@/lib/data/categories";
import { citySearchLocations } from "@/lib/data/locations";
import { activeMarkets, getActiveMarketBySlug } from "@/lib/market";
import { marketsDictionaries } from "@/lib/i18n/markets";
import { useI18n } from "@/lib/i18n/context";
import { useContent } from "@/lib/i18n/useLocalizedContent";
import { cn } from "@/lib/utils";

function countryName(code: string, locale: string, fallback: string) {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) || fallback;
  } catch {
    return fallback;
  }
}

function citiesForMarket(code: string, citySlugs: readonly string[]) {
  return citySearchLocations.filter((city) => city.countryCode === code && (citySlugs as readonly string[]).includes(city.slug));
}

export function MarketsIndexPage() {
  const { locale } = useI18n();
  const copy = marketsDictionaries[locale];

  return (
    <>
      <PageHeader
        eyebrow={copy.index.eyebrow}
        title={copy.index.title}
        description={copy.index.description}
        breadcrumbs={[{ name: copy.index.breadcrumb }]}
      />
      <section className="container-x py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMarkets.map((market) => {
            const name = countryName(market.code, locale, market.name);
            const cities = citiesForMarket(market.code, market.citySlugs);
            return (
              <Link key={market.code} href={`/mercados/${market.slug}`} className="card card-hover p-5">
                <div className="flex items-center gap-3">
                  <span className={cn("fi rounded-[3px] shadow-[0_0_0_1px_rgba(15,92,74,0.16)]", `fi-${market.flagCountry}`)} aria-hidden="true" />
                  <h2 className="font-bold text-ink">{name}</h2>
                </div>
                <p className="mt-3 text-sm text-muted">{cities.map((city) => city.city).join(", ")}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
                  {copy.home.openMarket} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

export function MarketDetailPage({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  const content = useContent();
  const copy = marketsDictionaries[locale];
  const market = getActiveMarketBySlug(slug);
  if (!market) return null;

  const name = countryName(market.code, locale, market.name);
  const countryLocationSlug = market.code.toLowerCase();
  const cities = citiesForMarket(market.code, market.citySlugs);
  const featuredCategories = categories.filter((category) => category.featured).slice(0, 9);

  return (
    <>
      <PageHeader
        eyebrow={copy.detail.eyebrow}
        title={`${copy.detail.titlePrefix} ${name}`}
        description={`${copy.detail.descriptionPrefix} ${name} ${copy.detail.descriptionSuffix}`}
        breadcrumbs={[{ name: copy.index.breadcrumb, path: "/mercados" }, { name }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href={`/buscar?loc=${countryLocationSlug}`} className="btn btn-primary">
            <Search size={16} /> {copy.detail.searchCountry}
          </Link>
          <Link href={`/mapa?loc=${countryLocationSlug}`} className="btn btn-secondary">
            <Map size={16} /> {copy.detail.viewMap}
          </Link>
          <Link href="/publicar-proyecto" className="btn btn-ghost">
            {copy.detail.publishProject}
          </Link>
        </div>
      </PageHeader>

      <section className="container-x py-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-ink">{copy.detail.citiesTitle}</h2>
            <p className="mt-2 text-muted">{copy.detail.citiesText}</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {cities.length === 0 && <p className="text-sm text-muted">{copy.detail.noCities}</p>}
              {cities.map((city) => (
                <Link key={city.slug} href={`/buscar?loc=${city.slug}`} className="card card-hover p-4">
                  <span className="inline-flex items-center gap-2 font-semibold text-ink">
                    <MapPin size={16} className="text-forest-600" /> {city.city}
                  </span>
                  <p className="mt-1 text-sm text-muted">{city.province || name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink">{copy.detail.categoriesTitle}</h2>
            <p className="mt-2 text-muted">{copy.detail.categoriesText}</p>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {featuredCategories.map((category) => (
                <Link key={category.id} href={`/buscar?cat=${category.id}&loc=${countryLocationSlug}`} className="card card-hover p-4">
                  <h3 className="font-semibold text-ink">{content.categories[category.id].name}</h3>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{content.categories[category.id].shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <InfoCard icon={BadgeCheck} title={copy.detail.clientsTitle} text={copy.detail.clientsText} href="/publicar-proyecto" label={copy.detail.publishProject} />
          <InfoCard icon={Building2} title={copy.detail.prosTitle} text={copy.detail.prosText} href="/registro" label={t.ui.register.createProfile} />
        </aside>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  href,
  label,
}: {
  icon: typeof BadgeCheck;
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <article className="card p-6">
      <Icon size={22} className="text-forest-600" />
      <h2 className="mt-3 font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-muted leading-relaxed">{text}</p>
      <Link href={href} className="btn btn-primary w-full mt-5">{label}</Link>
    </article>
  );
}
