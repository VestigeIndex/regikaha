import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug, categories, getProfessionalsByCategory, getServicesByCategory,
  getProfessionalById,
} from "@/lib/data";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";
import { LocalizedCategoryPage } from "@/components/marketplace/LocalizedCategoryPage";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada" };
  return {
    title: `${category.name} — Profesionales verificados en España`,
    description: `${category.description} Compara precios orientativos, portfolio y valoraciones reales en RegiKaha. Pide presupuesto gratis.`,
    alternates: { canonical: `/categorias/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const pros = getProfessionalsByCategory(category.id);
  const servicesList = getServicesByCategory(category.id).slice(0, 4);
  const related = categories.filter((c) => c.id !== category.id && c.featured).slice(0, 4);
  const serviceProfessionals = Object.fromEntries(
    servicesList
      .map((service) => [service.professionalId, getProfessionalById(service.professionalId)] as const)
      .filter((entry): entry is readonly [string, NonNullable<ReturnType<typeof getProfessionalById>>] => Boolean(entry[1])),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Categorías", path: "/categorias" },
          { name: category.name, path: `/categorias/${category.slug}` },
        ])}
      />
      <LocalizedCategoryPage
        category={category}
        pros={pros}
        servicesList={servicesList}
        related={related}
        serviceProfessionals={serviceProfessionals}
      />
    </>
  );
}
