import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FairRanking } from "@/components/home/FairRanking";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BadgeCheck, IdCard, FileCheck2, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cómo funciona",
  description:
    "Así funciona RegiNova: los clientes buscan, comparan y piden presupuesto gratis; los profesionales verificados destacan por mérito. Verificación real y reseñas verificadas.",
  path: "/como-funciona",
});

const verification = [
  { icon: IdCard, title: "Identidad y NIF/CIF", text: "Comprobamos identidad y datos fiscales del profesional." },
  { icon: FileCheck2, title: "Actividad y documentación", text: "Email, teléfono y, si aplica, colegiación o certificados." },
  { icon: ShieldCheck, title: "Seguros y certificados", text: "Validamos los que el profesional declara aportar." },
  { icon: BadgeCheck, title: "Sello de verificado", text: "Solo entonces se muestra la insignia en el perfil." },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cómo funciona"
        title="Simple para clientes, justo para profesionales"
        description="RegiNova conecta a clientes con profesionales verificados de reformas y servicios técnicos. Sin rankings comprados y con valoraciones reales."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Cómo funciona" }]}
      />

      <HowItWorks />

      <section className="bg-canvas border-y hairline">
        <div className="container-x py-16">
          <SectionHeading
            eyebrow="Verificación"
            title="Qué significa “profesional verificado”"
            description="La verificación es lo que hace de RegiNova un marketplace de confianza. Esto es lo que comprobamos antes de mostrar el sello."
            align="center"
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {verification.map((v, i) => (
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

      <FairRanking />

      <CtaBand
        title="¿Listo para empezar?"
        primary={{ label: "Buscar profesionales", href: "/buscar" }}
        secondary={{ label: "Soy profesional", href: "/registro" }}
      />
    </>
  );
}
