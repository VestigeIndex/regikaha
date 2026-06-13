import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // RegiNova usa SVG generados localmente en /public en la fase inicial.
    // Cuando se conecte R2 / CDN, añadir aquí los remotePatterns.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
