import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalSeoPage } from "@/components/marketplace/LocalSeoPage";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import {
  getPlaceByRouteId,
  indexablePlaces,
  localizedMetadata,
  localityPath,
  localSeoDictionaries,
  placeName,
  countryName,
} from "@/lib/seo-local";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => indexablePlaces.map((place) => ({ locale, place: `${place.countryCode.toLowerCase()}-${place.slug}` })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; place: string }> }): Promise<Metadata> {
  const values = await params;
  if (!isLocale(values.locale)) return {};
  const locale = values.locale as Locale;
  const place = getPlaceByRouteId(values.place);
  if (!place) return {};
  const copy = localSeoDictionaries[locale];
  const name = placeName(place);
  return localizedMetadata({
    locale,
    path: localityPath(locale, place),
    title: copy.professionalsTitle(name),
    description: copy.professionalsDescription(name, countryName(place.countryCode, locale)),
    image: "/images/photos/ventanas.webp",
    alternatePath: (alternateLocale) => localityPath(alternateLocale, place),
  });
}

export default async function LocalProfessionalsPage({ params }: { params: Promise<{ locale: string; place: string }> }) {
  const values = await params;
  if (!isLocale(values.locale)) notFound();
  const place = getPlaceByRouteId(values.place);
  if (!place) notFound();
  return <LocalSeoPage locale={values.locale} place={place} />;
}
