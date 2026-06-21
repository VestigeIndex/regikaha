import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { PortfolioCard } from "@/components/marketplace/PortfolioCard";
import { Reveal } from "@/components/ui/Reveal";
import { portfolioItems, getProfessionalById } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Trabajos realizados",
  description:
    "Galería de trabajos que los profesionales de Regi Kaha publican con información del proyecto, ubicación aproximada y especialidad.",
  path: "/trabajos",
});

export default function TrabajosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Trabajos publicados por profesionales"
        description="Solo mostramos portfolios asociados a perfiles activos. Las galerías aparecen cuando el profesional aporta sus propios proyectos."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Trabajos realizados" }]}
      />

      <section className="container-x py-14">
        {portfolioItems.length === 0 ? (
          <div className="mx-auto max-w-2xl py-10 text-center">
            <h2 className="text-xl font-bold text-ink">Aún no hay portfolios públicos en producción</h2>
            <p className="mt-3 text-muted">Estamos revisando los primeros perfiles antes de publicar sus trabajos. Puedes publicar tu proyecto gratis y activaremos la búsqueda en tu zona.</p>
            <Link href="/publicar-proyecto" className="btn btn-primary mt-6">Publicar proyecto</Link>
          </div>
        ) : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item, i) => {
            const pro = getProfessionalById(item.professionalId);
            return (
              <Reveal key={item.id} delay={(i % 3) * 70}>
                <div>
                  <PortfolioCard item={item} />
                  {pro && (
                    <Link
                      href={`/profesionales/${pro.slug}`}
                      className="mt-2 inline-block text-sm text-muted hover:text-forest-700"
                    >
                      por <span className="font-medium text-forest-700">{pro.publicName}</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>}
      </section>

      <CtaBand
        title="¿Tu próximo proyecto?"
        text="Compara profesionales verificados y pide presupuesto gratis."
        primary={{ label: "Buscar profesionales", href: "/buscar" }}
      />
    </>
  );
}
