import type { Metadata } from "next";
import Link from "next/link";
import { Building2, BriefcaseBusiness, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "B2B constructoras y subcontratas",
  description: "Regi Kaha B2B conecta constructoras, empresas y administradores con subcontratas verificables en mercados europeos seleccionados.",
  path: "/b2b",
});

export default function B2BPage() {
  return (
    <>
      <PageHeader
        eyebrow="B2B"
        title="Constructoras, empresas y subcontratas conectadas por cobertura real"
        description="Publica necesidades de subcontrata, compara equipos por especialidad y activa captación donde todavía no haya oferta suficiente."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "B2B" }]}
      />
      <section className="container-x py-14 grid gap-4 lg:grid-cols-3">
        {[
          { icon: Building2, title: "Constructoras y empresas", text: "Publica paquetes de trabajo, zonas, documentación requerida y disponibilidad.", href: "/registro/empresa", cta: "Crear cuenta empresa" },
          { icon: BriefcaseBusiness, title: "Subcontratas", text: "Define especialidades, equipo, certificaciones, radio de servicio y disponibilidad.", href: "/registro/subcontrata", cta: "Crear cuenta subcontrata" },
          { icon: ClipboardList, title: "Necesidad B2B", text: "No obligamos a tener cuenta al principio: puedes publicar una necesidad y crear cuenta después.", href: "/publicar-subcontrata", cta: "Publicar subcontrata" },
        ].map((item) => (
          <article key={item.title} className="card p-6">
            <item.icon size={24} className="text-forest-600" />
            <h2 className="mt-4 text-xl font-bold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">{item.text}</p>
            <Link href={item.href} className="btn btn-primary text-sm mt-5">{item.cta}</Link>
          </article>
        ))}
      </section>
    </>
  );
}
