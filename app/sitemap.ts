import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories, publicProfessionals, getServicesByProfessional } from "@/lib/data";

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
    { path: "/fundadores", priority: 0.8, freq: "weekly" },
    { path: "/trabajos", priority: 0.6, freq: "weekly" },
    { path: "/sobre", priority: 0.5, freq: "monthly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/contacto", priority: 0.4, freq: "yearly" },
    { path: "/registro", priority: 0.7, freq: "monthly" },
    { path: "/legal/aviso-legal", priority: 0.2, freq: "yearly" },
    { path: "/legal/privacidad", priority: 0.2, freq: "yearly" },
    { path: "/legal/cookies", priority: 0.2, freq: "yearly" },
    { path: "/legal/terminos-clientes", priority: 0.2, freq: "yearly" },
    { path: "/legal/terminos-profesionales", priority: 0.2, freq: "yearly" },
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
