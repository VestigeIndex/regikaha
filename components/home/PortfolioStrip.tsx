"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioCard } from "@/components/marketplace/PortfolioCard";
import { featuredPortfolio } from "@/lib/data/portfolio";
import { useT } from "@/lib/i18n/context";

export function PortfolioStrip() {
  const t = useT();
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow={t.ui.homeSections.portfolio.eyebrow}
          title={t.ui.homeSections.portfolio.title}
          description={t.ui.homeSections.portfolio.description}
        />
        <Link href="/trabajos" className="btn btn-secondary shrink-0">
          {t.ui.homeSections.portfolio.viewPortfolio} <ArrowRight size={16} />
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPortfolio.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
