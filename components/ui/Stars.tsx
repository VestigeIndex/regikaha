import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Estrellas de valoración con relleno parcial para decimales. */
export function Stars({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} sobre 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rounded >= i;
        const half = !filled && rounded >= i - 0.5;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-forest-200" fill="currentColor" />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? size / 2 : size }}
              >
                <Star size={size} className="text-amber-500" fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** Valoración compacta: estrellas + número + nº de reseñas. */
export function RatingInline({
  value,
  count,
  size = 15,
}: {
  value: number;
  count: number;
  size?: number;
}) {
  if (count === 0) {
    return <span className="text-sm text-muted">Sin valoraciones todavía</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <Stars value={value} size={size} />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      <span className="text-muted">({count})</span>
    </span>
  );
}
