"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function FinalCTA() {
  const t = useT();
  return (
    <section className="container-x pb-20">
      <div className="rounded-3xl border hairline bg-canvas p-8 sm:p-12 text-center">
        <h2 className="text-3xl lg:text-[2.3rem] font-bold tracking-tight text-ink text-balance max-w-2xl mx-auto">
          {t.finalCta.title}
        </h2>
        <p className="mt-4 text-muted leading-relaxed max-w-xl mx-auto">{t.finalCta.text}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/publicar-proyecto" className="btn btn-primary text-base">
            Publicar proyecto gratis <ArrowRight size={18} />
          </Link>
          <Link href="/mapa" className="btn btn-secondary text-base">
            Buscar en el mapa
          </Link>
          <Link href="/registro" className="btn btn-secondary text-base">
            {t.actions.joinPro}
          </Link>
        </div>
      </div>
    </section>
  );
}
