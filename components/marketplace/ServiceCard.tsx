import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceItem, Professional } from "@/lib/types";
import { formatPriceFrom, priceTypeLabel } from "@/lib/utils";

export function ServiceCard({ service, pro }: { service: ServiceItem; pro: Professional }) {
  return (
    <Link
      href={`/profesionales/${pro.slug}/${service.slug}`}
      className="card card-hover group flex flex-col p-5 h-full"
    >
      <h3 className="font-semibold text-ink group-hover:text-forest-700 transition-colors">{service.title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3 flex-1">{service.description}</p>
      <div className="mt-4 pt-4 border-t hairline flex items-center justify-between">
        <div className="text-sm">
          {service.priceType !== "fixed" && <span className="text-muted">{priceTypeLabel(service.priceType)} </span>}
          <span className="font-bold text-ink">{formatPriceFrom(service.priceFrom)}</span>
          {service.priceType === "fixed" && <span className="text-muted text-xs"> · precio cerrado</span>}
        </div>
        <ArrowRight size={16} className="text-forest-400 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
