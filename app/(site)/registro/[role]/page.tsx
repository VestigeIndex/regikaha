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
      <section className="container-x py-14">
        {role === "profesional" || !item.accountRole ? <RegistroForm /> : <AccountRegisterForm role={item.accountRole} />}
      </section>
    </>
  );
}
