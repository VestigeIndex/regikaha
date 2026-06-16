"use client";

import type { CoverageStatus } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

const styles: Record<CoverageStatus, string> = {
  fuerte: "bg-forest-700 text-white border-forest-700",
  activa: "bg-forest-600 text-white border-forest-600",
  inicial: "bg-mint text-forest-800 border-forest-600/20",
  verificando: "bg-blue-50 text-blue-800 border-blue-200",
  "sin-cobertura": "bg-slate-100 text-slate-700 border-slate-200",
};

export function CoverageBadge({ status, className }: { status: CoverageStatus; className?: string }) {
  const t = useT();
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", styles[status], className)}>
      {t.ui.badges.coverage[status]}
    </span>
  );
}
