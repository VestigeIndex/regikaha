import type { Metadata } from "next";
import { SubscriptionResultCard } from "@/components/billing/SubscriptionResultCard";

export const metadata: Metadata = { title: "Suscripción activada | RegiKaha", robots: { index: false, follow: false } };

export default function SubscriptionSuccessPage() {
  return (
    <main className="container-x py-16 sm:py-24">
      <SubscriptionResultCard variant="success" />
    </main>
  );
}
