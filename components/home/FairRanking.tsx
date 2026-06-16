"use client";

import { Scale, XCircle, CheckCircle2 } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function FairRanking() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-gradient-brand text-white">
      <div className="absolute inset-0 bg-grid-soft bg-grid opacity-10" />
      <div className="container-x relative py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mint">
              <Scale size={15} /> {t.ui.homeSections.fairRanking.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl lg:text-[2.4rem] font-bold tracking-tight text-balance">
              {t.ui.homeSections.fairRanking.title}
            </h2>
            {t.ui.homeSections.fairRanking.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-white/85 leading-relaxed max-w-xl">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 p-5 backdrop-blur">
              <p className="font-semibold text-white/90 mb-3">{t.ui.homeSections.fairRanking.noTitle}</p>
              <ul className="space-y-2.5">
                {t.ui.homeSections.fairRanking.noList.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/85">
                    <XCircle size={17} className="text-white/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-5 text-ink shadow-elevated">
              <p className="font-semibold mb-3">{t.ui.homeSections.fairRanking.yesTitle}</p>
              <ul className="space-y-2.5">
                {t.ui.homeSections.fairRanking.yesList.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                    <CheckCircle2 size={17} className="text-forest-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
