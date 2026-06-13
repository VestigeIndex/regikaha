import { BadgeCheck, CornerDownRight } from "lucide-react";
import type { Review } from "@/lib/types";
import { Stars } from "@/components/ui/Stars";
import { timeAgo } from "@/lib/utils";

export function ReviewCard({ review, professionalName }: { review: Review; professionalName?: string }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{review.clientName}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-forest-700">
                <BadgeCheck size={13} className="text-forest-600" />
                Reseña verificada
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {review.serviceLabel} · {timeAgo(review.createdAt)}
          </p>
        </div>
        <Stars value={review.rating} size={15} />
      </div>

      <p className="mt-3 text-sm text-ink/85 leading-relaxed">{review.comment}</p>

      {review.reply && (
        <div className="mt-3 ml-1 pl-3 border-l-2 border-forest-200">
          <p className="text-xs font-semibold text-forest-700 inline-flex items-center gap-1">
            <CornerDownRight size={13} />
            Respuesta de {professionalName ?? "el profesional"}
          </p>
          <p className="mt-1 text-sm text-muted leading-relaxed">{review.reply}</p>
        </div>
      )}
    </article>
  );
}
