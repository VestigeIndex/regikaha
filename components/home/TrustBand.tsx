"use client";

import { BadgeCheck, Star, Scale, HeartHandshake } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function TrustBand() {
  const t = useT();
  const items = [
    { icon: BadgeCheck, title: t.trust.verified, text: t.trustExtra.verifiedDesc },
    { icon: Star, title: t.trust.realReviews, text: t.trustExtra.realReviewsDesc },
    { icon: Scale, title: t.trust.noPaidRanking, text: t.trustExtra.noPaidRankingDesc },
    { icon: HeartHandshake, title: t.trust.freeForClients, text: t.trustExtra.freeForClientsDesc },
  ];

  return (
    <section className="border-y hairline bg-canvas">
      <div className="container-x py-7">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          {items.map((it) => (
            <div key={it.title} className="flex items-start gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-forest-500/12 text-forest-600 shrink-0">
                <it.icon size={19} />
              </span>
              <div>
                <p className="font-semibold text-ink text-[0.95rem]">{it.title}</p>
                <p className="text-sm text-muted leading-snug mt-0.5">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
