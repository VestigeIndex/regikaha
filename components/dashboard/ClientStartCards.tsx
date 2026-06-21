"use client";

import Link from "next/link";
import { ArrowRight, Inbox, Search, Star } from "lucide-react";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

const cards = [
  { href: "/publicar-proyecto", icon: Inbox, hint: "Publicar proyecto" },
  { href: "/buscar", icon: Search, hint: "Buscar profesional" },
  { href: "/panel/cliente/resenas", icon: Star, hint: "Ver reseñas" },
];

export function ClientStartCards() {
  const { translate } = useDirectTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="card p-5 flex items-center justify-between hover:shadow-soft transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-500/12 text-forest-600">
              <card.icon size={20} />
            </span>
            <span className="text-sm font-semibold text-ink">{translate(card.hint)}</span>
          </div>
          <ArrowRight size={16} className="text-muted group-hover:text-forest-600 transition-colors" />
        </Link>
      ))}
    </div>
  );
}
