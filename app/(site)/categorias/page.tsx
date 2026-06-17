import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { categories, countByCategory } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Categorías de profesionales",
  description:
    "Explora todas las categorías de RegiKaha: reformas, baños y cocinas, electricidad, fontanería, pintura, climatización, energía solar, arquitectura y más. Profesionales verificados por país, región y ciudad en mercados activos.",
  path: "/categorias",
});

export default function CategoriasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Categorías"
        title="Todas las categorías de profesionales verificados"
        description="Desde reformas integrales hasta peritajes técnicos. Encuentra al especialista que necesitas por país, región o ciudad."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Categorías" }]}
      />
      <section className="container-x py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={(i % 4) * 60}>
              <CategoryCard category={category} count={countByCategory(category.id)} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
