import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SubscriptionPlanChooser } from "@/components/billing/SubscriptionPlanChooser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Suscripción profesional",
  description: "Elige cobertura, revisa el contrato digital y activa tu acceso profesional en RegiKaha.",
  path: "/suscripcion",
});

export default function SubscriptionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Suscripción profesional"
        title="Activa visibilidad y herramientas profesionales"
        description="Elige un plan futuro, revisa precio y renovación, acepta el contrato y activa tu suscripción. Pagar no compra ranking ni sustituye la verificación documental."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Suscripción" }]}
      />
      <section className="container-x py-10 sm:py-14"><SubscriptionPlanChooser /></section>
    </>
  );
}
