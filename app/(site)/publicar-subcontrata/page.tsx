import type { Metadata } from "next";
import { LocalizedPageHeader } from "@/components/site/LocalizedPageHeader";
import { PublishSubcontractBody } from "@/components/marketplace/LocalizedMarketSections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Publicar necesidad de subcontrata",
  description:
    "Constructoras, estudios y empresas pueden publicar necesidades de subcontrata por especialidad, ciudad, documentación y disponibilidad.",
  path: "/publicar-subcontrata",
});

export default function PublicarSubcontrataPage() {
  return (
    <>
      <LocalizedPageHeader id="publishSubcontract" />
      <PublishSubcontractBody />
    </>
  );
}
