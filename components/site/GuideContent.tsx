"use client";

import Link from "next/link";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

const guides = [
  { href: "/publicar-proyecto", label: "Publicar proyecto" },
  { href: "/buscar", label: "Buscar profesional" },
  { href: "/registro/profesional", label: "Completa tu perfil profesional" },
  { href: "/conectar", label: "Conectar" },
];

export function GuideContent() {
  const { translate } = useDirectTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {guides.map((guide) => (
        <Link
          key={guide.href}
          href={guide.href}
          className="card p-5 flex items-center justify-between hover:shadow-soft transition-shadow"
        >
          <span className="font-semibold text-ink">{translate(guide.label)}</span>
          <span className="text-muted">&rarr;</span>
        </Link>
      ))}
    </div>
  );
}
