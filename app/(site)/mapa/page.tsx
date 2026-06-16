import { Suspense } from "react";
import type { Metadata } from "next";
import { LocalizedPageHeader } from "@/components/site/LocalizedPageHeader";
import { MapSearchPage } from "@/components/marketplace/MapSearchPage";
import { SearchFallback } from "@/components/marketplace/LocalizedMarketSections";
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
      <LocalizedPageHeader id="map" />
      <Suspense fallback={<SearchFallback kind="map" />}>
        <MapSearchPage mode="map" />
      </Suspense>
    </>
  );
}
