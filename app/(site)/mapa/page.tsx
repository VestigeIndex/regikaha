import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { MapSearchPage } from "@/components/marketplace/MapSearchPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mapa de profesionales y subcontratas verificadas",
  description:
    "Explora en el mapa profesionales, empresas y subcontratas verificadas para reformas, obras, instalaciones y mantenimiento en Europa.",
  path: "/mapa",
});

export default function MapaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mapa europeo"
        title="Busca profesionales cerca de ti"
        description="Explora profesionales, empresas y subcontratas verificadas por zona, categoría, valoración y disponibilidad. Si no hay cobertura, puedes publicar tu proyecto y activamos captación local."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Mapa" }]}
      />
      <Suspense fallback={<div className="container-x py-16 text-center text-muted">Preparando mapa…</div>}>
        <MapSearchPage mode="map" />
      </Suspense>
    </>
  );
}
