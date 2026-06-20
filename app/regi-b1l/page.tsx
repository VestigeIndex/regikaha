import type { Metadata } from "next";
import { RegiB1LApp } from "@/components/regi-b1l/RegiB1LApp";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Regi B1L — Gestión profesional de obra",
  description: "Herramientas de clientes, obras, presupuestos, documentos, materiales y equipo para profesionales de la construcción.",
  alternates: { canonical: "https://regikaha.com/regi-b1l" },
  manifest: "/regi-b1l/manifest.webmanifest",
  robots: { index: true, follow: true },
  icons: { icon: "/regi-b1l/icon.svg", apple: "/regi-b1l/icon.svg" },
  openGraph: {
    type: "website",
    url: "https://regikaha.com/regi-b1l",
    title: "Regi B1L — Gestión profesional de obra",
    description: "Clientes, obras, presupuestos, documentos, materiales y equipo para profesionales de la construcción.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Regi B1L" }],
  },
};

export default function RegiB1LPage() {
  return <>
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Regi B1L",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://regikaha.com/regi-b1l",
      description: "Herramienta profesional para gestionar oportunidades, clientes, obras, presupuestos, documentos, materiales, proveedores y equipos.",
      inLanguage: ["es", "en", "fr", "de", "it", "pt", "nl", "ca", "ar", "zh"],
      offers: [
        { "@type": "Offer", name: "Plan Local", price: "19.95", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Plan Europa", price: "49.95", priceCurrency: "EUR" },
      ],
    }} />
    <RegiB1LApp />
  </>;
}
