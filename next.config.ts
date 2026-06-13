import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: genera /out con HTML puro, ideal para Cloudflare Pages.
  // Todo el sitio es estático (rutas dinámicas con generateStaticParams),
  // así que no requiere servidor ni adaptador.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    // Usamos <img> con SVG locales; en export las imágenes no se optimizan.
    // Al conectar R2/CDN se podrá cambiar por next/image con loader.
    unoptimized: true,
  },
};

export default nextConfig;
