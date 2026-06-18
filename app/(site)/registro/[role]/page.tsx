import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AccountRegisterForm } from "@/components/auth/AccountRegisterForm";
import { RegistroForm } from "@/components/marketplace/RegistroForm";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";

const roles = ["cliente", "profesional", "empresa", "subcontrata"] as const;
type RouteRole = (typeof roles)[number];

export function generateStaticParams() {
  return roles.map((role) => ({ role }));
}

const copy: Record<RouteRole, { title: string; description: string; accountRole?: "client" | "company" | "subcontractor" }> = {
  cliente: {
    title: "Registro cliente",
    description: "Crea una cuenta para publicar proyectos, guardar favoritos y gestionar pre-presupuestos.",
    accountRole: "client",
  },
  profesional: {
    title: "Registro profesional",
    description: "Crea tu perfil, publica servicios, define zonas de trabajo y activa tu plan cuando estés listo.",
  },
  empresa: {
    title: "Registro empresa",
    description: "Crea una cuenta de empresa o constructora para publicar necesidades B2B y comparar subcontratas.",
    accountRole: "company",
  },
  subcontrata: {
    title: "Registro subcontrata",
    description: "Crea tu perfil de subcontrata para recibir oportunidades de constructoras y empresas.",
    accountRole: "subcontractor",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params;
  if (!roles.includes(role as RouteRole)) return { title: "Registro no encontrado" };
  const item = copy[role as RouteRole];
  return buildMetadata({ title: item.title, description: item.description, path: `/registro/${role}` });
}

export default async function RegistroRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!roles.includes(role as RouteRole)) notFound();
  const item = copy[role as RouteRole];
  const visual = role === "profesional"
    ? { src: "/images/photos/fachada.webp", alt: "Equipo profesional rehabilitando una fachada", text: "Presenta trabajos reales y activa tu cobertura profesional." }
    : role === "empresa"
      ? { src: "/images/photos/mantenimiento.webp", alt: "Técnico industrial revisando una instalación", text: "Coordina equipos y oportunidades B2B desde un único panel." }
      : role === "subcontrata"
        ? { src: "/images/photos/pavimentacion.webp", alt: "Equipo especializado ejecutando un trabajo de pavimentación", text: "Muestra capacidad, especialidades y zonas disponibles." }
        : null;
  return (
    <>
      <PageHeader
        eyebrow="Registro"
        title={item.title}
        description={item.description}
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Registro", path: "/registro" }, { name: item.title }]}
      >
        {role === "profesional" && (
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 px-3 py-1 text-xs font-semibold text-forest-800">
            <Sparkles size={14} /> Fundadores: 5 meses gratis para los primeros verificados
          </span>
        )}
      </PageHeader>
      {visual && (
        <section className="container-x pt-10 sm:pt-14">
          <div className="relative mx-auto min-h-64 max-w-4xl overflow-hidden rounded-lg sm:min-h-80">
            <img src={visual.src} alt={visual.alt} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 max-w-xl p-6 text-lg font-semibold text-white sm:p-8 sm:text-xl">{visual.text}</p>
          </div>
        </section>
      )}
      <section className="container-x py-10 sm:py-14">
        {role === "profesional" || !item.accountRole ? <RegistroForm /> : <AccountRegisterForm role={item.accountRole} />}
      </section>
    </>
  );
}
