import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories, publicProfessionals, getServicesByProfessional } from "@/lib/data";
import { activeMarkets } from "@/lib/market";
import { locales } from "@/lib/i18n/config";
import { indexablePlaces, localityPath, localServicePath, primaryLocaleByCountry } from "@/lib/seo-local";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "daily" },
    { path: "/buscar", priority: 0.9, freq: "daily" },
    { path: "/categorias", priority: 0.8, freq: "weekly" },
    { path: "/como-funciona", priority: 0.6, freq: "monthly" },
    { path: "/para-clientes", priority: 0.7, freq: "monthly" },
    { path: "/para-profesionales", priority: 0.8, freq: "monthly" },
    { path: "/precios", priority: 0.8, freq: "monthly" },
    { path: "/suscripcion", priority: 0.8, freq: "monthly" },
    { path: "/suscripcion/fundadores", priority: 0.7, freq: "weekly" },
    { path: "/fundadores", priority: 0.8, freq: "weekly" },
    { path: "/mercados", priority: 0.8, freq: "weekly" },
    { path: "/trabajos", priority: 0.6, freq: "weekly" },
    { path: "/sobre", priority: 0.5, freq: "monthly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/contacto", priority: 0.4, freq: "yearly" },
    { path: "/registro", priority: 0.7, freq: "monthly" },
    { path: "/registro/cliente", priority: 0.6, freq: "monthly" },
    { path: "/registro/profesional", priority: 0.7, freq: "monthly" },
    { path: "/registro/empresa", priority: 0.6, freq: "monthly" },
    { path: "/registro/subcontrata", priority: 0.6, freq: "monthly" },
    { path: "/conectar", priority: 0.5, freq: "monthly" },
    { path: "/b2b", priority: 0.6, freq: "monthly" },
    { path: "/regi-b1l", priority: 0.8, freq: "weekly" },
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
      });
      for (const category of categories) {
        entries.push({
          url: `${site.url}${localServicePath(locale, category.slug, place)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: primary ? 0.7 : 0.5,
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
