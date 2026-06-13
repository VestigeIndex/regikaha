import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioCard } from "@/components/marketplace/PortfolioCard";
import { featuredPortfolio } from "@/lib/data/portfolio";

export function PortfolioStrip() {
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow="Trabajos realizados"
          title="Resultados reales, antes y después"
          description="Proyectos completados por profesionales verificados de RegiNova. Pasa el cursor para ver el antes."
        />
        <Link href="/trabajos" className="btn btn-secondary shrink-0">
          Ver portfolio <ArrowRight size={16} />
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredPortfolio.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
