"use client";

import { useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompareButton({ compact = false }: { compact?: boolean }) {
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
      aria-label={selected ? "Quitar de comparación" : "Comparar profesional"}
      title={selected ? "En comparación" : "Comparar"}
    >
      <GitCompareArrows size={compact ? 16 : 15} />
      {!compact && (selected ? "Comparando" : "Comparar")}
    </button>
  );
}
