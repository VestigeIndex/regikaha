import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Map, MapPin, Search } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { categories, getProfessionalsByCategory } from "@/lib/data";
import type { Category } from "@/lib/types";
import type { Place } from "@/lib/geo/types";
import type { Locale } from "@/lib/i18n/config";
import {
  categorySeoImage,
  countryName,
  localizedCategory,
  localSeoDictionaries,
  localServicePath,
  localityPath,
  placeName,
  indexablePlaces,
} from "@/lib/seo-local";
import { site } from "@/lib/site";

function placeTypeLabel(place: Place, locale: Locale) {
  const type = ["city", "town", "village", "commune"].includes(place.placeType) ? place.placeType : "other";
  return localSeoDictionaries[locale].locationType[type as keyof typeof localSeoDictionaries[Locale]["locationType"]];
}

function nearbyPlaces(place: Place) {
  return indexablePlaces
    .filter((candidate) => candidate.countryCode === place.countryCode && candidate.id !== place.id)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.population || 0) - Number(a.population || 0))
    .slice(0, 8);
}

export function LocalSeoPage({ locale, place, category }: { locale: Locale; place: Place; category?: Category }) {
  const copy = localSeoDictionaries[locale];
  const localName = placeName(place);
  const country = countryName(place.countryCode, locale);
  const categoryCopy = category ? localizedCategory(locale, category.id) : null;
  const title = categoryCopy ? copy.categoryTitle(categoryCopy.name, localName) : copy.professionalsTitle(localName);
  const description = categoryCopy
    ? copy.categoryDescription(categoryCopy.name, localName, country)
    : copy.professionalsDescription(localName, country);
  const image = category ? categorySeoImage(category.id) : "/images/photos/ventanas.webp";
  const searchHref = category
    ? `/buscar?cat=${encodeURIComponent(category.id)}&loc=${encodeURIComponent(place.slug)}`
    : `/buscar?loc=${encodeURIComponent(place.slug)}`;
  const mapHref = category
    ? `/mapa?cat=${encodeURIComponent(category.id)}&loc=${encodeURIComponent(place.slug)}`
    : `/mapa?loc=${encodeURIComponent(place.slug)}`;
  const nearby = nearbyPlaces(place);
  const related = category ? categories.filter((item) => item.id !== category.id).slice(0, 8) : categories;
  const faqs = categoryCopy ? copy.faqs(categoryCopy.name, localName) : [];
  const currentPath = category ? localServicePath(locale, category.slug, place) : localityPath(locale, place);
  const breadcrumbItems = [
    { name: copy.home, path: "/" },
    { name: copy.professionals, path: localityPath(locale, place) },
    ...(categoryCopy ? [{ name: categoryCopy.name, path: currentPath }] : []),
  ];
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": category ? "Service" : "CollectionPage",
      name: title,
      description,
      url: `${site.url}${currentPath}`,
      inLanguage: locale,
      areaServed: {
        "@type": "AdministrativeArea",
        name: localName,
        containedInPlace: { "@type": "Country", name: country },
        geo: { "@type": "GeoCoordinates", latitude: place.latitude, longitude: place.longitude },
      },
      ...(categoryCopy ? { serviceType: categoryCopy.name, provider: { "@type": "Organization", name: site.name, url: site.url } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${site.url}${item.path}`,
      })),
    },
  ];
  if (faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
    });
  }

  return (
    <>
      <JsonLd data={schemas} />
      <section className="relative flex min-h-[420px] items-end overflow-hidden bg-ink">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" width="1600" height="900" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="container-x relative py-10 text-white sm:py-14">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/75" aria-label="Breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <span key={`${item.path}-${item.name}`} className="inline-flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {index === breadcrumbItems.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path} className="hover:text-white">{item.name}</Link>}
              </span>
            ))}
          </nav>
          <p className="text-sm font-bold uppercase text-white/80">{category ? copy.marketEyebrow : copy.professionalsEyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={searchHref} className="btn bg-white text-ink hover:bg-white/90"><Search size={17} /> {copy.search}</Link>
            <Link href={mapHref} className="btn border border-white/45 bg-transparent text-white hover:bg-white/10"><Map size={17} /> {copy.map}</Link>
            <Link href="/publicar-proyecto" className="btn btn-primary"><FileText size={17} /> {copy.publish}</Link>
          </div>
        </div>
      </section>

      <section className="border-b hairline bg-white">
        <div className="container-x grid gap-6 py-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-forest-700">{placeTypeLabel(place, locale)} · {place.admin1Name || country}</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{copy.coverageTitle}</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted">{copy.coverageText(localName)}</p>
          </div>
          <Link href="/registro/profesional" className="btn btn-secondary"><BadgeCheck size={17} /> {copy.join}</Link>
        </div>
      </section>

      {categoryCopy ? (
        <>
          <section className="container-x py-12 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-2xl font-bold text-ink">{categoryCopy.name} · {localName}</h2>
                <p className="mt-4 leading-relaxed text-muted">{categoryCopy.description}</p>
                <h3 className="mt-8 text-lg font-bold text-ink">{copy.popularTitle}</h3>
                <ul className="mt-4 divide-y hairline border-y hairline">
                  {categoryCopy.popularServices.map((service) => <li key={service} className="flex items-center gap-3 py-3 text-ink/85"><BadgeCheck size={17} className="shrink-0 text-forest-600" /> {service}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">{copy.processTitle}</h2>
                <ol className="mt-5 space-y-5">
                  {copy.process.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-600 text-sm font-bold text-white">{index + 1}</span>
                      <p className="pt-1 text-ink/85">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="border-y hairline bg-canvas">
            <div className="container-x py-12">
              <h2 className="text-2xl font-bold text-ink">{copy.relatedTitle}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => {
                  const translated = localizedCategory(locale, item.id);
                  return <Link key={item.id} href={localServicePath(locale, item.slug, place)} className="rounded-lg border hairline bg-white p-4 transition hover:border-forest-500 hover:shadow-soft"><span className="font-semibold text-ink">{translated.name}</span><span className="mt-2 flex items-center gap-1 text-sm text-forest-700">{copy.search} <ArrowRight size={14} /></span></Link>;
                })}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="container-x py-12 lg:py-16">
          <h2 className="text-2xl font-bold text-ink">{copy.categoriesTitle}</h2>
          <p className="mt-2 max-w-3xl text-muted">{copy.categoriesText}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => {
              const translated = localizedCategory(locale, item.id);
              const available = getProfessionalsByCategory(item.id).filter((professional) => professional.countryCode === place.countryCode).length;
              return (
                <Link key={item.id} href={localServicePath(locale, item.slug, place)} className="rounded-lg border hairline p-5 transition hover:border-forest-500 hover:shadow-soft">
                  <h3 className="font-bold text-ink">{translated.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{translated.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">{copy.search} <ArrowRight size={14} /></span>
                  {available > 0 && <span className="sr-only">{available}</span>}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="container-x py-12">
        <h2 className="text-2xl font-bold text-ink">{copy.nearbyTitle}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {nearby.map((item) => <Link key={item.id} href={localityPath(locale, item)} className="inline-flex items-center gap-2 rounded-lg border hairline px-3 py-2 text-sm text-ink/80 hover:border-forest-500 hover:text-forest-700"><MapPin size={14} /> {placeName(item)}</Link>)}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="border-t hairline bg-canvas">
          <div className="container-x py-12">
            <h2 className="text-2xl font-bold text-ink">{copy.faqTitle}</h2>
            <div className="mt-6 max-w-4xl divide-y hairline border-y hairline">
              {faqs.map((faq) => <article key={faq.q} className="py-5"><h3 className="font-bold text-ink">{faq.q}</h3><p className="mt-2 leading-relaxed text-muted">{faq.a}</p></article>)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
