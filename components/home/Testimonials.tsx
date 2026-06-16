"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publishedReviews, getProfessionalById } from "@/lib/data";
import { useT } from "@/lib/i18n/context";
import { useContent } from "@/lib/i18n/useLocalizedContent";

const featured = publishedReviews
  .filter((r) => r.rating >= 4 && r.comment.length > 60)
  .slice(0, 7)
  .map((r) => {
    const pro = getProfessionalById(r.professionalId);
    return { ...r, proName: pro?.publicName, proColor: pro?.logoColor ?? "#198C68" };
  });

export function Testimonials() {
  const t = useT();
  const content = useContent();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = featured.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section className="bg-canvas border-y hairline">
      <div className="container-x py-16 lg:py-20">
        <SectionHeading
          eyebrow={t.ui.homeSections.testimonials.eyebrow}
          title={t.ui.homeSections.testimonials.title}
          description={t.ui.homeSections.testimonials.description}
          align="center"
        />

        <div
          className="mt-12 max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div className="slide-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {featured.map((r) => {
                const localized = content.reviews[r.id];
                return (
                <figure key={r.id} className="w-full shrink-0 px-1">
                  <div className="card p-7 sm:p-9 text-center relative">
                    <Quote size={40} className="mx-auto text-forest-200" />
                    <Stars value={r.rating} size={18} className="justify-center mt-4" />
                    <blockquote className="mt-4 text-lg sm:text-xl text-ink leading-relaxed text-balance">
                      “{localized.comment}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center justify-center gap-3">
                      <Avatar name={localized.clientName} color={r.proColor} size={40} />
                      <div className="text-left">
                        <p className="font-semibold text-ink text-sm">{localized.clientName}</p>
                        <p className="text-xs text-muted">{localized.serviceLabel} · {r.proName ?? t.ui.cards.reviewProfessionalFallback}</p>
                      </div>
                    </figcaption>
                  </div>
                </figure>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="grid place-items-center h-10 w-10 rounded-full bg-white ring-1 ring-forest-600/15 text-forest-700 hover:bg-mint transition-colors"
              aria-label={t.ui.homeSections.testimonials.previous}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${t.ui.homeSections.testimonials.goTo} ${i + 1}`}
                  className={
                    "h-2 rounded-full transition-all " +
                    (i === index ? "w-6 bg-forest-600" : "w-2 bg-forest-300/60 hover:bg-forest-400")
                  }
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="grid place-items-center h-10 w-10 rounded-full bg-white ring-1 ring-forest-600/15 text-forest-700 hover:bg-mint transition-colors"
              aria-label={t.ui.homeSections.testimonials.next}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
