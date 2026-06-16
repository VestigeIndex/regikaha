"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({ compact = false }: { compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setSaved((value) => !value)}
      className={cn(
        compact ? "grid h-9 w-9 place-items-center rounded-lg" : "btn btn-secondary text-sm py-2",
        saved ? "bg-mint text-forest-800" : "bg-white text-muted hover:text-forest-700",
      )}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de favoritos" : "Guardar profesional"}
      title={saved ? "Guardado" : "Guardar"}
    >
      <Heart size={compact ? 16 : 15} fill={saved ? "currentColor" : "none"} />
      {!compact && (saved ? "Guardado" : "Guardar")}
    </button>
  );
}
