import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { featuredCategories, countByCategory } from "@/lib/data";

export function FeaturedCategories() {
  return (
    <section className="container-x py-16 lg:py-20">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow="Categorías"
          title="Encuentra al profesional según lo que necesitas"
          description="Reformas, instalaciones, mantenimiento y servicios técnicos. Todas las categorías con profesionales verificados."
        />
        <Link href="/categorias" className="btn btn-secondary shrink-0">
          Ver todas <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {featuredCategories.map((category) => (
          <CategoryCard key={category.id} category={category} count={countByCategory(category.id)} />
        ))}
      </div>
    </section>
  );
}
