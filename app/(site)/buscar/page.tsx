import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SearchClient } from "@/components/marketplace/SearchClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Buscar profesionales y subcontratas en el mapa",
  description:
    "Busca profesionales, empresas y subcontratas verificadas para reformas, obras e instalaciones en Europa. Compara en el mapa y pide pre-presupuestos iniciales no vinculantes.",
  path: "/buscar",
});

export default function BuscarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Buscador con mapa"
        title="Compara profesionales y subcontratas verificadas cerca de tu proyecto"
        description="Filtra por país, ciudad, categoría, tipo de profesional, valoración e idioma. Publica tu proyecto gratis si aún no hay cobertura en tu zona."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Buscar profesionales" }]}
      />
      <Suspense fallback={<div className="container-x py-16 text-center text-muted">Cargando buscador…</div>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
