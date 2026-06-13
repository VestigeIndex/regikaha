import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  getCategoryBySlug, categories, getProfessionalsByCategory, getServicesByCategory,
  getProfessionalById,
} from "@/lib/data";
import { getCategoryIcon } from "@/lib/icons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";
import { site } from "@/lib/site";

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

  const Icon = getCategoryIcon(category.icon);
  const pros = getProfessionalsByCategory(category.id);
  const servicesList = getServicesByCategory(category.id).slice(0, 4);
  const related = categories.filter((c) => c.id !== category.id && c.featured).slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Categorías", path: "/categorias" },
          { name: category.name, path: `/categorias/${category.slug}` },
        ])}
      />

      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-hero border-b hairline">
        <div className="absolute inset-0 bg-grid-soft bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="container-x relative py-12 lg:py-16">
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Categorías", path: "/categorias" },
              { name: category.name },
            ]}
          />
          <div className="mt-6 flex items-start gap-4 max-w-3xl">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-forest-600 text-white shadow-soft shrink-0">
              <Icon size={26} />
            </span>
            <div>
              <h1 className="text-[2rem] sm:text-4xl font-bold tracking-tight text-ink text-balance">
                {category.name}
              </h1>
              <p className="mt-3 text-lg text-muted leading-relaxed">{category.description}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {category.popularServices.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
          <div className="mt-7">
            <Link href={`/buscar?cat=${category.id}`} className="btn btn-primary">
              Ver {pros.length} {pros.length === 1 ? "profesional" : "profesionales"} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Profesionales */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-ink">Profesionales de {category.name.toLowerCase()}</h2>
            <p className="text-sm text-muted mt-1">Ordenados por mérito: valoración, experiencia y respuesta.</p>
          </div>
          <Link href={`/buscar?cat=${category.id}`} className="btn btn-secondary shrink-0">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {pros.length === 0 ? (
          <p className="mt-8 text-muted">Pronto habrá profesionales verificados en esta categoría.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pros.slice(0, 6).map((pro, i) => (
              <Reveal key={pro.id} delay={(i % 3) * 70}>
                <ProfessionalCard pro={pro} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Servicios populares */}
      {servicesList.length > 0 && (
        <section className="bg-canvas border-y hairline">
          <div className="container-x py-14">
            <h2 className="text-2xl font-bold text-ink">Servicios populares</h2>
            <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {servicesList.map((s) => {
                const pro = getProfessionalById(s.professionalId);
                return pro ? <ServiceCard key={s.id} service={s} pro={pro} /> : null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ¿Por qué RegiKaha? */}
      <section className="container-x py-14">
        <div className="rounded-3xl bg-gradient-brand text-white p-8 sm:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-balance">Contrata {category.name.toLowerCase()} con confianza</h2>
            <p className="mt-3 text-white/85 leading-relaxed">
              En RegiKaha todos los profesionales compiten por mérito. Compara antes de contratar y
              decide con información real.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {["Profesionales verificados", "Valoraciones reales", "Precios orientativos", "Sin rankings comprados"].map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-white/90">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-white/15 shrink-0"><Check size={14} /></span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categorías relacionadas */}
      <section className="container-x pb-16">
        <h2 className="text-xl font-bold text-ink mb-6">Otras categorías</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((c) => (
            <CategoryCard key={c.id} category={c} variant="compact" />
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          ¿Eres profesional de {category.name.toLowerCase()}?{" "}
          <Link href="/registro" className="font-semibold text-forest-700 hover:underline">
            Únete a {site.name}
          </Link>{" "}
          y consigue clientes.
        </p>
      </section>
    </>
  );
}
