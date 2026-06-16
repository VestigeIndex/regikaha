import type { Metadata } from "next";
import { LocalizedPageHeader } from "@/components/site/LocalizedPageHeader";
import { PublishProjectBody } from "@/components/marketplace/LocalizedMarketSections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Publicar proyecto gratis",
  description:
    "Publica tu reforma, reparación, instalación u obra gratis y recibe pre-presupuestos iniciales no vinculantes de profesionales verificados.",
  path: "/publicar-proyecto",
});

export default function PublicarProyectoPage() {
  return (
    <>
      <LocalizedPageHeader id="publishProject" />
      <PublishProjectBody />
    </>
  );
}
