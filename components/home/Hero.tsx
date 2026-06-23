"use client";

import Link from "next/link";
import { BadgeCheck, Star, Sparkles, ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { getPlatformStats } from "@/lib/data";
import { site } from "@/lib/site";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { useT } from "@/lib/i18n/context";

const heroSlides = [
  { src: "/images/photos/ventanas.webp", alt: "" },
  { src: "/images/photos/suelos.webp", alt: "" },
  { src: "/images/photos/carpinteria.webp", alt: "" },
  { src: "/images/photos/puertas.webp", alt: "" },
  { src: "/images/photos/pavimentacion.webp", alt: "" },
];

export function Hero() {
  const stats = getPlatformStats();
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-grid-soft bg-grid opacity-[0.6] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="container-x relative pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <BadgeCheck size={15} /> {t.hero.eyebrow}
            </span>
            <h1 className="mt-4 text-[2.3rem] sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-ink text-balance">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl">{t.hero.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/publicar-proyecto" className="btn btn-primary text-base">
                {t.ui.actions.publishProjectFree} <ArrowRight size={18} />
              </Link>
              <Link href="/mapa" className="btn btn-secondary text-base">
                {t.ui.actions.searchMap}
              </Link>
              <Link href="/registro" className="btn btn-ghost text-base">
                {t.actions.imPro}
              </Link>
            </div>

            <div className="mt-8">
              <SearchBar />
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated ring-1 ring-forest-600/10">
              <HeroSlideshow slides={heroSlides} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute -left-6 top-10 card shadow-elevated p-3.5 w-52 animate-fade-up">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-forest-500/12 text-forest-600">
                  <Star size={18} fill="currentColor" />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink leading-none">{stats.reviewsCount > 0 ? `${stats.averageRating}/5` : t.ui.common.noRatings}</p>
                  <p className="text-xs text-muted mt-0.5">{t.heroExtra.avgRating}</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-5 -bottom-7 left-10 rounded-2xl bg-forest-900 text-white p-5 shadow-elevated ring-1 ring-white/10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-200">
                <Sparkles size={13} /> {t.ui.homeSections.founders.eyebrow}
              </span>
              <p className="mt-1.5 text-sm font-bold leading-snug">
                {t.ui.homeSections.founders.titleBefore} {site.founderSlots} {t.ui.cards.categoryCountPlural} {t.ui.badges.verified.toLowerCase()} {t.ui.homeSections.founders.titleHighlight}
              </p>
              <Link href="/registro/profesional" className="btn btn-white mt-3 w-full text-sm">
                {t.ui.homeSections.founders.join} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
