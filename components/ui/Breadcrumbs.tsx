import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-1 text-sm text-muted">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-forest-300" />}
          {item.path && i < items.length - 1 ? (
            <Link href={item.path} className="hover:text-forest-700 transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? "text-ink font-medium" : ""}>{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
