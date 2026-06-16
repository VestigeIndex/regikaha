"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceItem, Professional } from "@/lib/types";
import { useI18n, useT } from "@/lib/i18n/context";
import { useLocalizedService } from "@/lib/i18n/useLocalizedContent";

function formatEuro(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function ServiceCard({ service, pro }: { service: ServiceItem; pro: Professional }) {
  const { locale } = useI18n();
  const t = useT();
  const displayService = useLocalizedService(service);
  return (
    <Link
      href={`/profesionales/${pro.slug}/${displayService.slug}`}
      className="card card-hover group flex flex-col p-5 h-full"
    >
      <h3 className="font-semibold text-ink group-hover:text-forest-700 transition-colors">{displayService.title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3 flex-1">{displayService.description}</p>
      <div className="mt-4 pt-4 border-t hairline flex items-center justify-between">
        <div className="text-sm">
          {displayService.priceType !== "fixed" && <span className="text-muted">{t.ui.format.priceTypes[displayService.priceType]} </span>}
          <span className="font-bold text-ink">{formatEuro(displayService.priceFrom, locale)}</span>
          {displayService.priceType === "fixed" && <span className="text-muted text-xs"> · {t.ui.cards.serviceFixedPrice}</span>}
        </div>
        <ArrowRight size={16} className="text-forest-400 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
