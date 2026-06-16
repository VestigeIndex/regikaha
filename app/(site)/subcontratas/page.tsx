import type { Metadata } from "next";
import { LocalizedPageHeader } from "@/components/site/LocalizedPageHeader";
import { SubcontractorsActions, SubcontractorsCards } from "@/components/marketplace/LocalizedMarketSections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Subcontratas verificables",
  description:
    "Registra tu empresa o equipo técnico como subcontrata para recibir oportunidades B2B por ciudad, especialidad y disponibilidad.",
  path: "/subcontratas",
});

export default function SubcontratasPage() {
  return (
    <>
      <LocalizedPageHeader id="subcontractors"><SubcontractorsActions /></LocalizedPageHeader>
      <SubcontractorsCards />
    </>
  );
}
