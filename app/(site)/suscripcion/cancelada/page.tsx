import type { Metadata } from "next";
import { SubscriptionResultCard } from "@/components/billing/SubscriptionResultCard";

export const metadata: Metadata = { title: "Suscripción no completada | RegiKaha", robots: { index: false, follow: false } };

export default function SubscriptionCancelledPage() {
  return (
    <main className="container-x py-16 sm:py-24">
      <SubscriptionResultCard variant="cancelled" />
    </main>
  );
}
