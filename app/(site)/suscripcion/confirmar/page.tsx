import type { Metadata } from "next";
import { Suspense } from "react";
import { SubscriptionContractModal } from "@/components/billing/SubscriptionContractModal";

export const metadata: Metadata = {
  title: "Confirmar suscripción | RegiKaha",
  description: "Revisa y acepta el contrato digital antes de activar tu suscripción profesional.",
  robots: { index: false, follow: false },
};

export default function ConfirmSubscriptionPage() {
  return (
    <section className="min-h-screen bg-canvas px-3 py-4 sm:px-5 sm:py-8 lg:px-8">
      <Suspense fallback={<div className="card mx-auto h-40 max-w-4xl animate-pulse bg-white" />}>
        <SubscriptionContractModal />
      </Suspense>
    </section>
  );
}
