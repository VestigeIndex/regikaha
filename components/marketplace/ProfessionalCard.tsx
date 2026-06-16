"use client";

import Link from "next/link";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";
import type { Professional } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badges";
import { RatingInline } from "@/components/ui/Stars";
import { useI18n, useT } from "@/lib/i18n/context";
import { useContent, useLocalizedProfessional } from "@/lib/i18n/useLocalizedContent";

function formatEuro(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function ProfessionalCard({ pro }: { pro: Professional }) {
  const { locale } = useI18n();
  const t = useT();
  const content = useContent();
  const displayPro = useLocalizedProfessional(pro);
  const categoryNames = displayPro.categoryIds
    .map((id) => content.categories[id]?.name)
    .filter(Boolean) as string[];
  const country = displayPro.country || t.ui.professionalCard.countryFallback;

  return (
    <article className="card card-hover flex flex-col p-5 h-full">
      <div className="flex items-start gap-3.5">
        <Avatar name={displayPro.publicName} color={displayPro.logoColor} src={displayPro.logoImage} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profesionales/${displayPro.slug}`}
              className="font-semibold text-ink hover:text-forest-700 transition-colors truncate"
            >
              {displayPro.publicName}
            </Link>
            {displayPro.verificationStatus === "verified" && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-[0.82rem] text-muted mt-0.5">{displayPro.typeLabel}</p>
          <p className="text-[0.82rem] text-muted inline-flex items-center gap-1 mt-1">
            <MapPin size={13} className="text-forest-500" />
            {displayPro.city}, {displayPro.province}, {country}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <RatingInline value={displayPro.averageRating} count={displayPro.reviewCount} />
      </div>

      <p className="mt-3 text-sm text-ink/80 leading-relaxed line-clamp-2">{displayPro.shortTagline}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {categoryNames.slice(0, 3).map((name) => (
          <span key={name} className="chip">{name}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[0.8rem] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={14} className="text-forest-500" />
          {displayPro.completedProjects} {t.ui.professionalCard.projects}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} className="text-forest-500" />
          {t.ui.professionalCard.respondsIn} {displayPro.responseTimeHours} {t.ui.professionalCard.hours}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t hairline flex items-center justify-between gap-2">
        <div className="text-sm">
          <span className="text-muted">{t.ui.professionalCard.from} </span>
          <span className="font-bold text-ink">{formatEuro(displayPro.priceFrom, locale)}</span>
        </div>
        <Link
          href={`/profesionales/${displayPro.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:gap-1.5 transition-all"
        >
          {t.ui.actions.viewProfile} <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
