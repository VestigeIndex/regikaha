import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panel", "/admin", "/api/", "/conectar", "/login", "/registro", "/suscripcion/confirmar", "/suscripcion/exito", "/suscripcion/cancelada"],
      },
    ],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/sitemap-professionals.xml`],
    host: site.url,
  };
}
