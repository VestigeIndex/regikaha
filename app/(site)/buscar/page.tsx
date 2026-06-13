import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SearchClient } from "@/components/marketplace/SearchClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Buscar profesionales verificados",
  description:
    "Busca y compara profesionales verificados de reformas, instalaciones y servicios técnicos en España. Filtra por categoría, zona, valoración y características. Gratis para clientes.",
  path: "/buscar",
});

export default function BuscarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Buscar profesionales"
        title="Compara profesionales verificados para tu proyecto"
        description="Filtra por categoría, ubicación, valoración y características. Resultados ordenados por mérito, nunca por pago."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Buscar profesionales" }]}
      />
      <Suspense fallback={<div className="container-x py-16 text-center text-muted">Cargando buscador…</div>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
