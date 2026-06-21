import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: genera /out con HTML puro, ideal para Cloudflare Pages.
  // Todo el sitio es estático (rutas dinámicas con generateStaticParams),
  // así que no requiere servidor ni adaptador.
  output: "export",
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    // Export estático: next/image emite etiquetas sin optimización dinámica.
    // Las imágenes públicas quedan servidas directamente desde Pages/CDN.
    unoptimized: true,
  },
};

export default nextConfig;
