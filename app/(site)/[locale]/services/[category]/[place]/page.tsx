import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalSeoPage } from "@/components/marketplace/LocalSeoPage";
import { categories, getCategoryBySlug } from "@/lib/data";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import {
  categorySeoImage,
  countryName,
  getPlaceByRouteId,
  localizedCategory,
  localizedMetadata,
  localSeoDictionaries,
  localServicePath,
  placeName,
  seoPlacesForCategory,
} from "@/lib/seo-local";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => categories.flatMap((category) => {
    return seoPlacesForCategory(category.id).map((place) => ({
      locale,
      category: category.slug,
      place: `${place.countryCode.toLowerCase()}-${place.slug}`,
    }));
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string; place: string }> }): Promise<Metadata> {
  const values = await params;
  if (!isLocale(values.locale)) return {};
  const locale = values.locale as Locale;
  const category = getCategoryBySlug(values.category);
  const place = getPlaceByRouteId(values.place);
  if (!category || !place) return {};
  const copy = localSeoDictionaries[locale];
  const translated = localizedCategory(locale, category.id);
  const localName = placeName(place);
  return localizedMetadata({
    locale,
    path: localServicePath(locale, category.slug, place),
    title: copy.categoryTitle(translated.name, localName),
    description: copy.categoryDescription(translated.name, localName, countryName(place.countryCode, locale)),
    image: categorySeoImage(category.id),
    alternatePath: (alternateLocale) => localServicePath(alternateLocale, category.slug, place),
  });
}

export default async function LocalServicePage({ params }: { params: Promise<{ locale: string; category: string; place: string }> }) {
  const values = await params;
  if (!isLocale(values.locale)) notFound();
  const category = getCategoryBySlug(values.category);
  const place = getPlaceByRouteId(values.place);
  if (!category || !place) notFound();
  return <LocalSeoPage locale={values.locale} place={place} category={category} />;
}
