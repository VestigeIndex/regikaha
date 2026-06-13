import type { Metadata } from "next";
import Link from "next/link";
import { Gift, BadgeCheck, GitCompare, Hammer, Star, MapPin, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Para clientes",
  description:
    "Encuentra profesionales verificados para tu reforma, obra o instalación. Compara trabajos realizados, precios orientativos, valoraciones reales y zona de servicio. Gratis y sin compromiso.",
  path: "/para-clientes",
});

const benefits = [
  { icon: Gift, title: "Gratis para clientes", text: "Buscar, comparar y pedir presupuesto sin coste ni compromiso." },
  { icon: BadgeCheck, title: "Profesionales verificados", text: "Identidad, NIF/CIF y actividad comprobados por RegiKaha." },
  { icon: GitCompare, title: "Comparación transparente", text: "Precio, calidad, portfolio y valoraciones, lado a lado." },
  { icon: Hammer, title: "Trabajos reales", text: "Mira el antes y el después de proyectos completados." },
  { icon: Star, title: "Reseñas verificadas", text: "Opiniones de clientes con un servicio realizado." },
  { icon: MapPin, title: "Filtros por zona y especialidad", text: "Encuentra al profesional adecuado cerca de ti." },
];

export default function ParaClientesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Para clientes"
        title="Encuentra profesionales verificados para tu reforma, obra o instalación"
        description="RegiKaha te permite comparar profesionales antes de contratar. Consulta trabajos realizados, precios orientativos, valoraciones reales, especialidades y zona de servicio."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Para clientes" }]}
      >
        <Link href="/buscar" className="btn btn-primary text-base">Buscar profesionales</Link>
      </PageHeader>

      <section className="container-x py-16">
        <SectionHeading
          eyebrow="No contrates a ciegas"
          title="Compara antes de empezar tu obra o reforma"
          description="Antes de contratar, compara trabajos realizados, precios orientativos, reseñas y especialidades. RegiKaha te ayuda a elegir con más información y menos riesgo."
          align="center"
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 70}>
              <div className="card card-hover p-6 h-full">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-forest-500/12 text-forest-600">
                  <b.icon size={21} />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-canvas border-y hairline">
        <div className="container-x py-16">
          <SectionHeading eyebrow="Cómo funciona" title="Tu proyecto en 4 pasos" align="center" />
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: 1, t: "Busca el servicio", d: "Filtra por categoría, zona y valoración." },
              { n: 2, t: "Compara perfiles", d: "Revisa portfolio, precios y reseñas reales." },
              { n: 3, t: "Pide presupuesto", d: "Contacta gratis con los que más te encajen." },
              { n: 4, t: "Elige con confianza", d: "Decide con información y sin riesgo." },
            ].map((s) => (
              <li key={s.n} className="card p-6">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-forest-600 text-white font-bold">{s.n}</span>
                <h3 className="mt-4 font-semibold text-ink">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
            <FileText size={16} className="text-forest-500" />
            Solicitar presupuesto es siempre gratis y sin compromiso.
          </div>
        </div>
      </section>

      <CtaBand
        title="Empieza comparando profesionales verificados"
        primary={{ label: "Buscar profesionales", href: "/buscar" }}
        secondary={{ label: "Ver categorías", href: "/categorias" }}
      />
    </>
  );
}
