"use client";

import { BadgeCheck, CornerDownRight } from "lucide-react";
import type { Review } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";
import { useT } from "@/lib/i18n/context";
import { useLocalizedReview } from "@/lib/i18n/useLocalizedContent";

function localizedTimeAgo(iso: string, t: ReturnType<typeof useT>): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return t.ui.format.timeAgoToday;
  if (days < 30) {
    const template = days === 1 ? t.ui.format.timeAgoDaysSingular : t.ui.format.timeAgoDaysPlural;
    return template.replace("{count}", String(days));
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    const template = months === 1 ? t.ui.format.timeAgoMonthsSingular : t.ui.format.timeAgoMonthsPlural;
    return template.replace("{count}", String(months));
  }
  const years = Math.floor(months / 12);
  const template = years === 1 ? t.ui.format.timeAgoYearsSingular : t.ui.format.timeAgoYearsPlural;
  return template.replace("{count}", String(years));
}

export function ReviewCard({ review, professionalName }: { review: Review; professionalName?: string }) {
  const t = useT();
  const displayReview = useLocalizedReview(review);
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{displayReview.clientName}</span>
            {displayReview.verified && (
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-forest-700">
                <BadgeCheck size={13} className="text-forest-600" />
                {t.ui.cards.reviewVerified}
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {displayReview.serviceLabel} · {localizedTimeAgo(displayReview.createdAt, t)}
          </p>
        </div>
        <Stars value={displayReview.rating} size={15} />
      </div>

      <p className="mt-3 text-sm text-ink/85 leading-relaxed">{displayReview.comment}</p>

      {displayReview.reply && (
        <div className="mt-3 ml-1 pl-3 border-l-2 border-forest-200">
          <p className="text-xs font-semibold text-forest-700 inline-flex items-center gap-1">
            <CornerDownRight size={13} />
            {t.ui.cards.reviewReplyBy} {professionalName ?? t.ui.cards.reviewProfessionalFallback}
          </p>
          <p className="mt-1 text-sm text-muted leading-relaxed">{displayReview.reply}</p>
        </div>
      )}
    </article>
  );
}
