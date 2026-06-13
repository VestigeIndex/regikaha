import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { getCategoryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function CategoryCard({
  category,
  count,
  variant = "default",
}: {
  category: Category;
  count?: number;
  variant?: "default" | "compact";
}) {
  const Icon = getCategoryIcon(category.icon);
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className={cn(
        "card card-hover group relative flex flex-col overflow-hidden",
        variant === "compact" ? "p-4" : "p-5",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="grid place-items-center h-11 w-11 rounded-xl text-forest-700 bg-mint ring-1 ring-forest-600/12 group-hover:bg-forest-600 group-hover:text-white transition-colors"
        >
          <Icon size={21} />
        </span>
        <ArrowUpRight size={18} className="text-forest-300 group-hover:text-forest-600 transition-colors" />
      </div>
      <h3 className="mt-4 font-semibold text-ink">{category.name}</h3>
      {variant === "default" && (
        <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2">{category.shortDescription}</p>
      )}
      {typeof count === "number" && (
        <p className="mt-3 text-xs font-medium text-forest-700">
          {count} {count === 1 ? "profesional" : "profesionales"}
        </p>
      )}
    </Link>
  );
}
