import type { PortfolioItem } from "@/lib/types";
import { MapPin } from "lucide-react";

/**
 * Tarjeta de trabajo realizado. Muestra el resultado "después" y, al pasar el
 * cursor, la imagen "antes" para comparar (sin JS, con CSS group-hover).
 */
export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="card card-hover group overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-canvas-alt">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.afterImage}
          alt={`${item.title} — resultado`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.beforeImage}
          alt={`${item.title} — antes`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span className="absolute top-3 left-3 chip bg-white/90 backdrop-blur">
          {item.category}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 text-white text-[0.68rem] px-2 py-0.5 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
          Pasa el cursor: antes
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink leading-snug">{item.title}</h3>
        <p className="mt-1.5 text-sm text-muted line-clamp-2 leading-relaxed">{item.description}</p>
        <p className="mt-2.5 text-xs text-muted inline-flex items-center gap-1">
          <MapPin size={13} className="text-forest-500" />
          {item.location}
        </p>
      </div>
    </article>
  );
}
