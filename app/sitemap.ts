import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories, publicProfessionals, getServicesByProfessional } from "@/lib/data";
import { activeMarkets } from "@/lib/market";
import { locales } from "@/lib/i18n/config";
import { indexablePlaces, localityPath, localServicePath, localizedAlternates, primaryLocaleByCountry } from "@/lib/seo-local";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "daily" },
    { path: "/buscar", priority: 0.9, freq: "daily" },
    { path: "/profesionales", priority: 0.9, freq: "daily" },
    { path: "/mapa", priority: 0.8, freq: "daily" },
    { path: "/publicar-proyecto", priority: 0.9, freq: "monthly" },
    { path: "/categorias", priority: 0.8, freq: "weekly" },
    { path: "/como-funciona", priority: 0.6, freq: "monthly" },
    { path: "/para-clientes", priority: 0.7, freq: "monthly" },
    { path: "/para-profesionales", priority: 0.8, freq: "monthly" },
    { path: "/precios", priority: 0.8, freq: "monthly" },
    { path: "/suscripcion", priority: 0.8, freq: "monthly" },
    { path: "/suscripcion/fundadores", priority: 0.7, freq: "weekly" },
    { path: "/fundadores", priority: 0.8, freq: "weekly" },
    { path: "/mercados", priority: 0.8, freq: "weekly" },
    { path: "/paises", priority: 0.8, freq: "weekly" },
    { path: "/verificacion", priority: 0.6, freq: "monthly" },
    { path: "/seguridad", priority: 0.5, freq: "monthly" },
    { path: "/trabajos", priority: 0.6, freq: "weekly" },
    { path: "/sobre", priority: 0.5, freq: "monthly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/contacto", priority: 0.4, freq: "yearly" },
    { path: "/b2b", priority: 0.6, freq: "monthly" },
    { path: "/constructoras", priority: 0.7, freq: "monthly" },
    { path: "/subcontratas", priority: 0.7, freq: "monthly" },
    { path: "/publicar-subcontrata", priority: 0.7, freq: "monthly" },
    { path: "/regi-works", priority: 0.8, freq: "weekly" },
    { path: "/legal/aviso-legal", priority: 0.2, freq: "yearly" },
    { path: "/legal/privacidad", priority: 0.2, freq: "yearly" },
    { path: "/legal/cookies", priority: 0.2, freq: "yearly" },
    { path: "/legal/terminos-clientes", priority: 0.2, freq: "yearly" },
    { path: "/legal/terminos-profesionales", priority: 0.2, freq: "yearly" },
    { path: "/legal/terminos-empresas", priority: 0.2, freq: "yearly" },
    { path: "/legal/terminos-subcontratas", priority: 0.2, freq: "yearly" },
    { path: "/legal/uso-aceptable", priority: 0.2, freq: "yearly" },
    { path: "/legal/reclamaciones", priority: 0.2, freq: "yearly" },
    { path: "/legal/politica-suscripcion", priority: 0.3, freq: "yearly" },
    { path: "/legal/politica-resenas", priority: 0.3, freq: "yearly" },
    { path: "/legal/politica-verificacion", priority: 0.3, freq: "yearly" },
    { path: "/legal/politica-prepresupuestos", priority: 0.3, freq: "yearly" },
    { path: "/legal/politica-contenido", priority: 0.3, freq: "yearly" },
    { path: "/legal/dpa", priority: 0.2, freq: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${site.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  for (const c of categories) {
    entries.push({
      url: `${site.url}/categorias/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const market of activeMarkets) {
    entries.push({
      url: `${site.url}/mercados/${market.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const locale of locales) {
    for (const place of indexablePlaces) {
      const primary = primaryLocaleByCountry[place.countryCode] === locale;
      entries.push({
        url: `${site.url}${localityPath(locale, place)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: primary ? 0.75 : 0.55,
        alternates: { languages: localizedAlternates((l) => localityPath(l, place)) },
      });
      for (const category of categories) {
        entries.push({
          url: `${site.url}${localServicePath(locale, category.slug, place)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: primary ? 0.7 : 0.5,
          alternates: { languages: localizedAlternates((l) => localServicePath(l, category.slug, place)) },
        });
      }
    }
  }

  for (const p of publicProfessionals) {
    entries.push({
      url: `${site.url}/profesionales/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const s of getServicesByProfessional(p.id)) {
      entries.push({
        url: `${site.url}/profesionales/${p.slug}/${s.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
