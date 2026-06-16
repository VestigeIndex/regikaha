"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { getTopProfessionals } from "@/lib/data";
import { useT } from "@/lib/i18n/context";

export function FeaturedProfessionals() {
  const t = useT();
  const pros = getTopProfessionals(6);
  return (
    <section className="bg-canvas border-y hairline">
      <div className="container-x py-16 lg:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeading
            eyebrow={t.ui.homeSections.featuredProfessionals.eyebrow}
            title={t.ui.homeSections.featuredProfessionals.title}
            description={t.ui.homeSections.featuredProfessionals.description}
          />
          <Link href="/buscar" className="btn btn-secondary shrink-0">
            {t.ui.homeSections.featuredProfessionals.viewAll} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pros.map((pro) => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </div>
      </div>
    </section>
  );
}
