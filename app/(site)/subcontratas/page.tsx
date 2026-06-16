import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, BriefcaseBusiness, CalendarClock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Subcontratas verificables",
  description:
    "Registra tu empresa o equipo técnico como subcontrata para recibir oportunidades B2B por ciudad, especialidad y disponibilidad.",
  path: "/subcontratas",
});

export default function SubcontratasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Para subcontratas"
        title="Recibe oportunidades B2B por especialidad y zona"
        description="Crea un perfil de empresa, muestra equipo disponible, documentación, seguros, certificaciones y trabajos realizados para constructoras y empresas."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Subcontratas" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/registro" className="btn btn-primary">Registrar mi empresa</Link>
          <Link href="/mapa" className="btn btn-secondary">Ver mapa</Link>
        </div>
      </PageHeader>
      <section className="container-x py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BriefcaseBusiness, title: "Perfil empresa", text: "Especialidades, equipo, zonas de trabajo y experiencia." },
          { icon: ShieldCheck, title: "Documentación", text: "Seguros, certificados y licencias preparados para verificación." },
          { icon: CalendarClock, title: "Disponibilidad", text: "Indica capacidad y fechas para nuevas obras." },
          { icon: BadgeCheck, title: "Fundadores", text: "Acceso inicial con condiciones de lanzamiento y visibilidad por mérito." },
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
