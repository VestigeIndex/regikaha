import Link from "next/link";
import { BadgeCheck, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { getPlatformStats } from "@/lib/data";
import { brandImages } from "@/lib/images";

export function Hero() {
  const stats = getPlatformStats();
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-grid-soft bg-grid opacity-[0.6] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="container-x relative pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <BadgeCheck size={15} /> Profesionales verificados en toda España
            </span>
            <h1 className="mt-4 text-[2.3rem] sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-ink text-balance">
              Compara profesionales verificados para{" "}
              <span className="text-gradient">reformas y servicios técnicos</span>
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl">
              Encuentra empresas de reformas, técnicos, instaladores, arquitectos e ingenieros por
              precio, calidad, zona de trabajo, portfolio y valoraciones reales.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/buscar" className="btn btn-primary text-base">
                Buscar profesionales <ArrowRight size={18} />
              </Link>
              <Link href="/registro" className="btn btn-secondary text-base">
                Soy profesional
              </Link>
            </div>

            <div className="mt-8">
              <SearchBar />
            </div>
          </div>

          {/* Visual lateral con tarjetas de confianza */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated ring-1 ring-forest-600/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandImages.hero.src}
                alt={brandImages.hero.alt}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -left-6 top-10 card shadow-elevated p-3.5 w-52 animate-fade-up">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-forest-500/12 text-forest-600">
                  <Star size={18} fill="currentColor" />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink leading-none">{stats.averageRating}/5</p>
                  <p className="text-xs text-muted mt-0.5">Valoración media</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-5 bottom-12 card shadow-elevated p-3.5 w-56 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-2">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-forest-500/12 text-forest-600">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink leading-tight">Sin rankings comprados</p>
                  <p className="text-xs text-muted mt-0.5">Solo mérito y reputación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
