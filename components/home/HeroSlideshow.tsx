"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface Slide {
  src: string;
  alt: string;
}

/**
 * Slideshow cinematográfico: crossfade entre fotos reales con efecto Ken Burns
 * (zoom/pan lento), que da sensación de vídeo sin cargar vídeo. Respeta
 * prefers-reduced-motion (se queda fijo en la primera imagen).
 */
export function HeroSlideshow({ slides, interval = 5000 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i === index ? undefined : true}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn("h-full w-full object-cover", i === index && "kenburns")}
          />
        </div>
      ))}
      {/* puntos */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`#${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}
