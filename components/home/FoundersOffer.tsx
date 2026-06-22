"use client";

import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { site } from "@/lib/site";
import { useT } from "@/lib/i18n/context";
import { FounderAvailability } from "@/components/billing/FounderAvailability";

export function FoundersOffer() {
  const t = useT();

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-ink text-white shadow-elevated">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/80 via-ink to-ink" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-forest-500/20 blur-3xl" />
        <div className="relative p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-500/20 text-mint px-3 py-1 text-xs font-semibold ring-1 ring-forest-500/30">
              <Sparkles size={14} /> {t.ui.homeSections.founders.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl lg:text-[2.3rem] font-bold tracking-tight text-balance">
              {t.ui.homeSections.founders.titleBefore} {site.founderSlots} {t.ui.cards.categoryCountPlural}{" "}
              {t.ui.badges.verified.toLowerCase()}{" "}
              <span className="text-mint">{t.ui.homeSections.founders.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed max-w-xl">
              {t.ui.homeSections.founders.textBeforeMonthly} {site.founderPrice.monthly}{" "}
              {t.ui.homeSections.founders.textBetweenPrices} {site.founderPrice.yearly}.{" "}
              {t.ui.homeSections.founders.textAfterYearly}
            </p>

            <div className="mt-6">
              <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5">
                <FounderAvailability compact />
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/registro" className="btn btn-white text-base">{t.ui.homeSections.founders.join}</Link>
              <Link href="/fundadores" className="btn text-base text-white ring-1 ring-white/25 hover:bg-white/10">
                {t.ui.homeSections.founders.conditions}
              </Link>
            </div>
          </div>

          <ul className="space-y-3">
            {t.ui.homeSections.founders.benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 rounded-xl bg-white/8 ring-1 ring-white/10 px-4 py-3">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-forest-500 text-white shrink-0">
                  <Check size={14} />
                </span>
                <span className="text-sm text-white/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
