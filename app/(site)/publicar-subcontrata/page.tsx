import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ProjectRequestForm } from "@/components/marketplace/ProjectRequestForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Publicar necesidad de subcontrata",
  description:
    "Constructoras, estudios y empresas pueden publicar necesidades de subcontrata por especialidad, ciudad, documentación y disponibilidad.",
  path: "/publicar-subcontrata",
});

export default function PublicarSubcontrataPage() {
  return (
    <>
      <PageHeader
        eyebrow="B2B y constructoras"
        title="Publica una necesidad de subcontrata"
        description="Indica especialidad, ciudad de obra, fechas, equipo necesario y documentación requerida. RegiKaha activa captación y comparación de subcontratas verificables."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Publicar subcontrata" }]}
      />
      <section className="container-x py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <ProjectRequestForm mode="b2b" />
        <aside className="card p-6 lg:sticky lg:top-24">
          <h2 className="font-bold text-ink">Para obras y empresas</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>Especialidades por gremio, ciudad y disponibilidad.</li>
            <li>Documentación, seguros y certificaciones preparadas para verificación.</li>
            <li>Tareas de captación si no hay oferta suficiente en la zona.</li>
            <li>Preparado para bolsa de proveedores y comparación B2B.</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
