import { Suspense } from "react";
import type { Metadata } from "next";
import { LocalizedPageHeader } from "@/components/site/LocalizedPageHeader";
import { SearchClient } from "@/components/marketplace/SearchClient";
import { SearchFallback } from "@/components/marketplace/LocalizedMarketSections";
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
      <LocalizedPageHeader id="search" />
      <Suspense fallback={<SearchFallback kind="search" />}>
        <SearchClient />
      </Suspense>
    </>
  );
}
