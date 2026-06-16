import type { Metadata } from "next";
import { site } from "./site";
import type { Professional, ServiceItem, Category } from "./types";
import { europeMarket } from "./market";

/** Construye metadata coherente para cualquier página. */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const url = opts.path ? `${site.url}${opts.path}` : site.url;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: opts.title,
      description: opts.description,
      url,
      locale: "es_ES",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: ["/og-image.svg"],
    },
  };
}

/** Schema.org Organization para el layout raíz. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    description: site.description,
    areaServed: "EU",
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email: site.email, availableLanguage: ["es", "en"] },
    ],
  };
}

/** Schema LocalBusiness / HomeAndConstructionBusiness para un profesional. */
export function professionalSchema(p: Professional, categoryNames: string[]) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: p.publicName,
    description: p.shortTagline,
    url: `${site.url}/profesionales/${p.slug}`,
    areaServed: p.serviceArea,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.city,
      addressRegion: p.province,
      addressCountry: p.countryCode || europeMarket.primaryCountryCode,
    },
    knowsAbout: categoryNames,
    knowsLanguage: p.languages,
  };
  if (p.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.averageRating,
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return schema;
}

/** Schema Service para una página de servicio. */
export function serviceSchema(s: ServiceItem, p: Professional) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    areaServed: s.serviceArea,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: p.publicName,
      url: `${site.url}/profesionales/${p.slug}`,
    },
    offers: {
      "@type": "Offer",
      price: s.priceFrom,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };
}

/** Schema FAQPage a partir de pares pregunta/respuesta. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Schema BreadcrumbList. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

/** SEO title para la página de un profesional. */
export function professionalSeoTitle(p: Professional, primaryCategory?: Category): string {
  const cat = primaryCategory?.name ?? "Profesional verificado";
  const country = p.country || europeMarket.primaryCountry;
  return `${p.publicName} — ${cat} en ${p.city}, ${country} | Verificado | ${site.name}`;
}
