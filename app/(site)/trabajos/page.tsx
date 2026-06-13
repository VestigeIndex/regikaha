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
    "Galería de trabajos realizados por profesionales verificados de RegiNova: reformas, baños, cocinas, fachadas, energía solar y más. Resultados reales, antes y después.",
  path: "/trabajos",
});

export default function TrabajosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Trabajos realizados por profesionales verificados"
        description="Resultados reales de proyectos completados. Pasa el cursor sobre cada imagen para ver el antes."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Trabajos realizados" }]}
      />

      <section className="container-x py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

      <CtaBand
        title="¿Tu próximo proyecto?"
        text="Compara profesionales verificados y pide presupuesto gratis."
        primary={{ label: "Buscar profesionales", href: "/buscar" }}
      />
    </>
  );
}
