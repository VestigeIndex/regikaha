import type { Metadata } from "next";
import { Scale, BadgeCheck, HeartHandshake, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";
import { getPlatformStats } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Sobre RegiKaha",
  description:
    "RegiKaha conecta clientes con profesionales verificados para reformas y servicios técnicos en mercados europeos seleccionados. Nuestra misión: que contratar una reforma sea transparente, justo y sin riesgos.",
  path: "/sobre",
});

const values = [
  { icon: Scale, title: "Justo por diseño", text: "Ningún profesional paga por aparecer primero. El orden lo decide el mérito." },
  { icon: BadgeCheck, title: "Verificación real", text: "Comprobamos identidad y actividad antes de mostrar el sello de verificado." },
  { icon: HeartHandshake, title: "Confianza mutua", text: "Reseñas verificadas que no se compran ni se borran si son legítimas." },
  { icon: MapPin, title: "Mercados por países", text: "Búsqueda por países activos con cobertura nacional, regional y local." },
];

export default function SobrePage() {
  const stats = getPlatformStats();
  return (
    <>
      <PageHeader
        eyebrow="Sobre RegiKaha"
        title="Hacemos que contratar una reforma sea transparente y justo"
        description="RegiKaha nace para resolver un problema real en los mercados donde opera: contratar reformas y servicios técnicos a ciegas, sin saber si el profesional es de fiar ni cuánto debería costar."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Sobre RegiKaha" }]}
      />

      <section className="container-x py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading eyebrow="Nuestra misión" title="Comparar antes de contratar, sin riesgos" />
            <p className="mt-4 text-muted leading-relaxed">
              Creemos que cualquier persona o empresa debería poder comparar profesionales por su
              trabajo real, no por quién paga más publicidad. Por eso construimos un marketplace donde
              la confianza se gana con verificación, portfolio y valoraciones reales.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              No somos una empresa de reformas, ni un directorio, ni un sistema de leads abusivo.
              Somos una plataforma justa donde los clientes eligen con información y los buenos
              profesionales destacan por mérito.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: `${stats.verifiedCount}+`, l: "Profesionales verificados" },
              { v: `${stats.categoriesCount}`, l: "Categorías" },
              { v: `${stats.averageRating}/5`, l: "Valoración media" },
              { v: "100%", l: "Reseñas verificadas" },
            ].map((s) => (
              <div key={s.l} className="card p-6 text-center">
                <p className="text-3xl font-bold text-gradient">{s.v}</p>
                <p className="text-sm text-muted mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas border-y hairline">
        <div className="container-x py-16">
          <SectionHeading eyebrow="Nuestros valores" title="En qué creemos" align="center" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 60}>
                <div className="card p-6 h-full">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-forest-500/12 text-forest-600">
                    <v.icon size={21} />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Únete a ${site.name}`}
        text="Como cliente, compara gratis. Como profesional, destaca por tu trabajo."
        primary={{ label: "Buscar profesionales", href: "/buscar" }}
        secondary={{ label: "Soy profesional", href: "/registro" }}
      />
    </>
  );
}
