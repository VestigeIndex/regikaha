import type { Metadata } from "next";
import { LocalizedPageHeader } from "@/components/site/LocalizedPageHeader";
import { BuildersActions, BuildersCards } from "@/components/marketplace/LocalizedMarketSections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Regi Kaha para constructoras",
  description:
    "Publica necesidades de subcontrata, busca empresas por especialidad en el mapa y compara disponibilidad, documentación y experiencia.",
  path: "/constructoras",
});

export default function ConstructorasPage() {
  return (
    <>
      <LocalizedPageHeader id="builders"><BuildersActions /></LocalizedPageHeader>
      <BuildersCards />
    </>
  );
}
