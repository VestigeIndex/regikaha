import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { getTopProfessionals } from "@/lib/data";

export function FeaturedProfessionals() {
  const pros = getTopProfessionals(6);
  return (
    <section className="bg-canvas border-y hairline">
      <div className="container-x py-16 lg:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeading
            eyebrow="Mejor valorados"
            title="Profesionales destacados por mérito"
            description="Ordenados por valoración, experiencia y rapidez de respuesta. Nunca por pago."
          />
          <Link href="/buscar" className="btn btn-secondary shrink-0">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pros.map((pro) => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </div>
      </div>
    </section>
  );
}
