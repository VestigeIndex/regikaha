import type { Metadata } from "next";
import { RegiB1LApp } from "@/components/regi-b1l/RegiB1LApp";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Regi Works — Gestión profesional de obra",
  description: "Herramientas de clientes, obras, presupuestos, documentos, materiales y equipo para profesionales de la construcción.",
  alternates: { canonical: "https://regikaha.com/regi-works" },
  manifest: "/regi-works/manifest.webmanifest",
  robots: { index: false, follow: true },
  icons: { icon: "/regi-works/icon.svg", apple: "/regi-works/icon.svg" },
  openGraph: {
    type: "website",
    url: "https://regikaha.com/regi-works",
    title: "Regi Works — Gestión profesional de obra",
    description: "Clientes, obras, presupuestos, documentos, materiales y equipo para profesionales de la construcción.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Regi Works" }],
  },
};

export default function RegiB1LPage() {
  return <>
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Regi Works",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://regikaha.com/regi-works",
      description: "Herramienta profesional para gestionar oportunidades, clientes, obras, presupuestos, documentos, materiales, proveedores y equipos.",
      inLanguage: ["es", "en", "fr", "de", "it", "pt", "nl"],
      offers: [
        { "@type": "Offer", name: "Plan Local", price: "19.95", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Plan Europa", price: "49.95", priceCurrency: "EUR" },
      ],
    }} />
    <RegiB1LApp />
  </>;
}
