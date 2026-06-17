import type { Metadata } from "next";
import { MarketsIndexPage } from "@/components/marketplace/MarketsPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mercados activos",
  description:
    "RegiKaha opera inicialmente en España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos, Bélgica, Irlanda y Reino Unido, con búsqueda nacional, ciudades iniciales y categorías principales.",
  path: "/mercados",
});

export default function MercadosPage() {
  return <MarketsIndexPage />;
}
