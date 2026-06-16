"use client";

import { BadgeCheck, ShieldCheck, FileText, Clock, AlertTriangle } from "lucide-react";
import type { VerificationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

/** Insignia "Verificado" — el sello de confianza del marketplace. */
export function VerifiedBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        "bg-forest-500/12 text-forest-800 ring-1 ring-forest-500/30",
        size === "sm" ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-1 text-xs",
      )}
    >
      <BadgeCheck size={size === "sm" ? 13 : 15} className="text-forest-600" />
      {t.ui.badges.verified}
    </span>
  );
}

const statusMap: Record<VerificationStatus, { label: string; cls: string }> = {
  verified: { label: "Verificado", cls: "bg-forest-500/12 text-forest-800 ring-forest-500/30" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-800 ring-amber-300/60" },
  limited: { label: "Verificación limitada", cls: "bg-slate-100 text-slate-700 ring-slate-300/60" },
  suspended: { label: "Suspendido", cls: "bg-red-100 text-red-700 ring-red-300/60" },
};

export function StatusBadge({ status }: { status: VerificationStatus }) {
  const t = useT();
  const s = statusMap[status];
  const labels = t.ui.badges;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", s.cls)}>
      {status === "verified" && <BadgeCheck size={14} />}
      {status === "pending" && <Clock size={14} />}
      {status === "limited" && <AlertTriangle size={14} />}
      {status === "suspended" && <AlertTriangle size={14} />}
      {labels[status]}
    </span>
  );
}

/** Píldora informativa de un atributo declarado (seguro, factura...). */
export function TrustChip({ icon, label }: { icon: "insurance" | "invoice"; label: string }) {
  const Icon = icon === "insurance" ? ShieldCheck : FileText;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-xs font-medium text-forest-800 ring-1 ring-forest-600/14">
      <Icon size={14} className="text-forest-600" />
      {label}
    </span>
  );
}
