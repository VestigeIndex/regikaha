"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { getCategoryIcon } from "@/lib/icons";
import { useT } from "@/lib/i18n/context";
import { useLocalizedCategory } from "@/lib/i18n/useLocalizedContent";
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
  const t = useT();
  const displayCategory = useLocalizedCategory(category);
  const Icon = getCategoryIcon(displayCategory.icon);
  return (
    <Link
      href={`/categorias/${displayCategory.slug}`}
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
      <h3 className="mt-4 font-semibold text-ink">{displayCategory.name}</h3>
      {variant === "default" && (
        <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2">{displayCategory.shortDescription}</p>
      )}
      {typeof count === "number" && (
        <p className="mt-3 text-xs font-medium text-forest-700">
          {count} {count === 1 ? t.ui.cards.categoryCountSingular : t.ui.cards.categoryCountPlural}
        </p>
      )}
    </Link>
  );
}
