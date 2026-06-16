"use client";

import { useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export function CompareButton({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const [selected, setSelected] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setSelected((value) => !value)}
      className={cn(
        compact ? "grid h-9 w-9 place-items-center rounded-lg" : "btn btn-secondary text-sm py-2",
        selected ? "bg-mint text-forest-800" : "bg-white text-muted hover:text-forest-700",
      )}
      aria-pressed={selected}
      aria-label={selected ? t.ui.actions.removeCompare : t.ui.actions.compare}
      title={selected ? t.ui.actions.comparing : t.ui.actions.compare}
    >
      <GitCompareArrows size={compact ? 16 : 15} />
      {!compact && (selected ? t.ui.actions.comparing : t.ui.actions.compare)}
    </button>
  );
}
