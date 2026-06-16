import Link from "next/link";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";
import type { Professional } from "@/lib/types";
import { getCategoryById } from "@/lib/data/categories";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badges";
import { RatingInline } from "@/components/ui/Stars";
import { formatPriceFrom } from "@/lib/utils";

export function ProfessionalCard({ pro }: { pro: Professional }) {
  const categoryNames = pro.categoryIds.map((id) => getCategoryById(id)?.name).filter(Boolean) as string[];
  const country = pro.country || "España";

  return (
    <article className="card card-hover flex flex-col p-5 h-full">
      <div className="flex items-start gap-3.5">
        <Avatar name={pro.publicName} color={pro.logoColor} src={pro.logoImage} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profesionales/${pro.slug}`}
              className="font-semibold text-ink hover:text-forest-700 transition-colors truncate"
            >
              {pro.publicName}
            </Link>
            {pro.verificationStatus === "verified" && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-[0.82rem] text-muted mt-0.5">{pro.typeLabel}</p>
          <p className="text-[0.82rem] text-muted inline-flex items-center gap-1 mt-1">
            <MapPin size={13} className="text-forest-500" />
            {pro.city}, {pro.province}, {country}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <RatingInline value={pro.averageRating} count={pro.reviewCount} />
      </div>

      <p className="mt-3 text-sm text-ink/80 leading-relaxed line-clamp-2">{pro.shortTagline}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {categoryNames.slice(0, 3).map((name) => (
          <span key={name} className="chip">{name}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[0.8rem] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={14} className="text-forest-500" />
          {pro.completedProjects} proyectos
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} className="text-forest-500" />
          Responde en {pro.responseTimeHours} h
        </span>
      </div>

      <div className="mt-4 pt-4 border-t hairline flex items-center justify-between gap-2">
        <div className="text-sm">
          <span className="text-muted">Desde </span>
          <span className="font-bold text-ink">{formatPriceFrom(pro.priceFrom)}</span>
        </div>
        <Link
          href={`/profesionales/${pro.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:gap-1.5 transition-all"
        >
          Ver perfil <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
