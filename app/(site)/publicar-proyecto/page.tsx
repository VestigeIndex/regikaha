import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ProjectRequestForm } from "@/components/marketplace/ProjectRequestForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Publicar proyecto gratis",
  description:
    "Publica tu reforma, reparación, instalación u obra gratis y recibe pre-presupuestos iniciales no vinculantes de profesionales verificados.",
  path: "/publicar-proyecto",
});

export default function PublicarProyectoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gratis para clientes"
        title="Publica tu proyecto y recibe pre-presupuestos iniciales"
        description="Cuéntanos qué necesitas, indica ciudad, categoría, urgencia y rango orientativo. RegiKaha detecta cobertura y activa profesionales o captación local."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Publicar proyecto" }]}
      />
      <section className="container-x py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <ProjectRequestForm />
        <aside className="card p-6 lg:sticky lg:top-24">
          <h2 className="font-bold text-ink">Cómo funciona</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            <li><strong className="text-ink">1.</strong> Publicas la necesidad con datos aproximados.</li>
            <li><strong className="text-ink">2.</strong> La plataforma detecta zona, categoría y cobertura.</li>
            <li><strong className="text-ink">3.</strong> Si hay profesionales, pueden responder con estimaciones iniciales.</li>
            <li><strong className="text-ink">4.</strong> Si no hay cobertura, se crea una tarea de captación local.</li>
          </ol>
          <p className="mt-5 rounded-xl bg-mint/70 p-4 text-sm text-forest-800">
            Los pre-presupuestos no son precios cerrados: sirven para comparar opciones antes de visita técnica o medición.
          </p>
        </aside>
      </section>
    </>
  );
}
