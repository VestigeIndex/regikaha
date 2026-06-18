import type { Metadata } from "next";
import Link from "next/link";
import { Building2, BriefcaseBusiness, HardHat, Shield, UserRound } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conecta con RegiKaha",
  description: "Elige si entras como cliente, profesional, empresa, subcontrata o admin para continuar en RegiKaha.",
  path: "/conectar",
});

const options = [
  {
    icon: UserRound,
    title: "Busco un profesional",
    text: "Publica proyectos, guarda favoritos, recibe pre-presupuestos y gestiona conversaciones.",
    cta: "Entrar como cliente",
    login: "/login?role=client&next=/panel/cliente",
    register: "/registro/cliente",
  },
  {
    icon: HardHat,
    title: "Ofrezco servicios",
    text: "Crea tu perfil, publica servicios, recibe solicitudes y gestiona tu cartera.",
    cta: "Entrar como profesional",
    login: "/login?role=professional&next=/panel/profesional",
    register: "/registro/profesional",
  },
  {
    icon: Building2,
    title: "Soy constructora o empresa",
    text: "Publica necesidades de subcontrata, compara equipos y gestiona solicitudes.",
    cta: "Entrar como empresa",
    login: "/login?role=company&next=/panel/empresa",
    register: "/registro/empresa",
  },
  {
    icon: BriefcaseBusiness,
    title: "Soy subcontrata",
    text: "Recibe oportunidades de constructoras y empresas en tus zonas de servicio.",
    cta: "Entrar como subcontrata",
    login: "/login?role=subcontractor&next=/panel/subcontrata",
    register: "/registro/subcontrata",
  },
] as const;

export default function ConectarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conectar"
        title="Conecta con RegiKaha"
        description="¿Qué necesitas hacer? Elige tu tipo de cuenta para entrar al panel correcto o crear una cuenta nueva."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Conectar" }]}
      />
      <section className="container-x py-14">
        <div className="grid gap-4 lg:grid-cols-2">
          {options.map((option) => (
            <article key={option.title} className="card p-6">
              <option.icon size={24} className="text-forest-600" />
              <h2 className="mt-4 text-xl font-bold text-ink">{option.title}</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">{option.text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={option.login} className="btn btn-primary text-sm">{option.cta}</Link>
                <Link href={option.register} className="btn btn-secondary text-sm">Crear cuenta</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest-700">
            <Shield size={15} /> Acceso admin
          </Link>
        </div>
      </section>
    </>
  );
}
