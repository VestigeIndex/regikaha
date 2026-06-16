import Link from "next/link";
import type { Metadata } from "next";
import { Building2, ClipboardList, FileCheck2, Map } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "RegiKaha para constructoras",
  description:
    "Publica necesidades de subcontrata, busca empresas por especialidad en el mapa y compara disponibilidad, documentación y experiencia.",
  path: "/constructoras",
});

export default function ConstructorasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Constructoras y empresas"
        title="Encuentra subcontratas verificables para tus obras"
        description="Publica partidas, especialidades y zonas de obra. RegiKaha te ayuda a activar oferta local y comparar proveedores por documentación, experiencia y disponibilidad."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Constructoras" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/publicar-subcontrata" className="btn btn-primary">Publicar necesidad de subcontrata</Link>
          <Link href="/mapa" className="btn btn-secondary">Buscar en el mapa</Link>
        </div>
      </PageHeader>
      <section className="container-x py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, title: "Publica partidas", text: "Electricidad, fontanería, pladur, fachadas, cubiertas, PRL, maquinaria y más." },
          { icon: Map, title: "Mapa por zona", text: "Localiza empresas y subcontratas por ciudad, radio y especialidad." },
          { icon: FileCheck2, title: "Documentación", text: "Prepara verificación de seguros, certificados, licencias y experiencia." },
          { icon: Building2, title: "Bolsa futura", text: "Guarda proveedores favoritos para próximas obras y proyectos." },
        ].map((item) => (
          <article key={item.title} className="card p-5">
            <item.icon size={21} className="text-forest-600" />
            <h2 className="mt-3 font-bold text-ink">{item.title}</h2>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
