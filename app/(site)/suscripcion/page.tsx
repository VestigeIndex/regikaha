import type { Metadata } from "next";
import { SubscriptionPlanChooser } from "@/components/billing/SubscriptionPlanChooser";
import { SubscriptionPageHeader } from "@/components/billing/SubscriptionPageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Suscripción profesional",
  description: "Elige cobertura, revisa el contrato digital y activa tu acceso profesional en RegiKaha.",
  path: "/suscripcion",
});

export default function SubscriptionPage() {
  return (
    <>
      <SubscriptionPageHeader />
      <section className="container-x py-10 sm:py-14"><SubscriptionPlanChooser /></section>
    </>
  );
}
