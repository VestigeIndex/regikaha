"use client";

import { useState } from "react";
import type { BillingInterval, ProfessionalPlanId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface CheckoutButtonProps {
  plan: ProfessionalPlanId;
  interval: BillingInterval;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({ plan, interval, children, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 && data.redirectTo) {
        window.location.href = data.redirectTo;
        return;
      }
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar el pago");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={cn(className, loading && "opacity-70 cursor-wait")}
      >
        {loading ? "Abriendo Stripe..." : children}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
