import type { Metadata } from "next";
import { RegiB1LApp } from "@/components/regi-b1l/RegiB1LApp";
import { RegiWorksIntro } from "@/components/regi-b1l/RegiWorksIntro";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Regi Works — Gestión profesional de obra",
  description: "Organiza oportunidades, clientes, obras, visitas, presupuestos, documentos, materiales y equipo desde móvil y escritorio.",
  alternates: { canonical: "https://regikaha.com/regi-works" },
  manifest: "/regi-works/manifest.webmanifest",
  robots: { index: true, follow: true },
  icons: { icon: "/regi-works/icon.svg", apple: "/regi-works/icon.svg" },
};

export default function RegiWorksPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Regi Works", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: "https://regikaha.com/regi-works", description: "Espacio profesional para gestionar oportunidades, clientes, obras, presupuestos, documentos, materiales, proveedores y equipos.", inLanguage: ["es", "en", "fr", "de", "it", "pt", "nl"] }} />
      <RegiWorksIntro />
      <RegiB1LApp />
    </>
  );
}
