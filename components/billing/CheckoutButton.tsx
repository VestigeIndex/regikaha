"use client";

import type { BillingInterval, ProfessionalPlanId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface CheckoutButtonProps {
  plan: ProfessionalPlanId;
  interval: BillingInterval;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({ plan, interval, children, className }: CheckoutButtonProps) {
  function reviewContract() {
    window.location.href = `/suscripcion/confirmar?plan=${plan}&interval=${interval}`;
  }

  return (
    <button type="button" onClick={reviewContract} className={cn(className)}>
      {children}
    </button>
  );
}
