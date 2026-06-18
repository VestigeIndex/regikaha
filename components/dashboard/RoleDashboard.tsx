import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, Heart, Inbox, MapPin, MessageSquare, Receipt, Settings, Star, UserRound } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import type { AccountRole } from "@/lib/accounts";

const roleContent: Record<Exclude<AccountRole, "admin">, {
  title: string;
  subtitle: string;
  stats: { label: string; value: string | number; hint?: string; icon: ReactNode }[];
  actions: { label: string; href: string }[];
  sections: { title: string; items: string[] }[];
}> = {
  client: {
    title: "Panel cliente",
    subtitle: "Gestiona proyectos, favoritos, pre-presupuestos y reseñas desde un solo sitio.",
    stats: [
      { label: "Proyectos", value: 0, hint: "Publica gratis el primero", icon: <Inbox size={19} /> },
      { label: "Favoritos", value: 0, icon: <Heart size={19} /> },
      { label: "Mensajes", value: 0, icon: <MessageSquare size={19} /> },
      { label: "Reseñas pendientes", value: 0, icon: <Star size={19} /> },
    ],
    actions: [
      { label: "Publicar proyecto gratis", href: "/publicar-proyecto" },
      { label: "Buscar profesionales", href: "/buscar" },
    ],
    sections: [
      { title: "Mis proyectos", items: ["Estado de solicitudes", "Profesionales encontrados", "Pre-presupuestos orientativos", "Archivos y fotos"] },
      { title: "Cuenta", items: ["Favoritos", "Mensajes", "Reseñas pendientes", "Configuración"] },
    ],
  },
  professional: {
    title: "Panel profesional",
    subtitle: "Completa tu perfil, servicios, portfolio, zonas de operación y plan.",
    stats: [
      { label: "Solicitudes", value: "Ver", hint: "Panel existente", icon: <Inbox size={19} /> },
      { label: "Servicios", value: "Editar", icon: <BriefcaseBusiness size={19} /> },
      { label: "Zonas", value: "Configurar", icon: <MapPin size={19} /> },
      { label: "Plan", value: "Activo", icon: <Receipt size={19} /> },
    ],
    actions: [
      { label: "Resumen profesional", href: "/panel" },
      { label: "Mi perfil", href: "/panel/perfil" },
      { label: "Mis servicios", href: "/panel/servicios" },
    ],
    sections: [
      { title: "Herramientas", items: ["Solicitudes", "Mensajes", "Servicios", "Portfolio", "Valoraciones"] },
      { title: "Crecimiento", items: ["Verificación", "Zonas de servicio", "Plan/facturación", "SEO local"] },
    ],
  },
  company: {
    title: "Panel empresa",
    subtitle: "Publica necesidades B2B, guarda candidatos y gestiona solicitudes de subcontrata.",
    stats: [
      { label: "Necesidades B2B", value: 0, hint: "Publica la primera", icon: <Building2 size={19} /> },
      { label: "Candidatos", value: 0, icon: <UserRound size={19} /> },
      { label: "Mensajes", value: 0, icon: <MessageSquare size={19} /> },
      { label: "Plan", value: "Preparado", icon: <Receipt size={19} /> },
    ],
    actions: [
      { label: "Publicar necesidad", href: "/publicar-subcontrata" },
      { label: "Buscar subcontratas", href: "/subcontratas" },
    ],
    sections: [
      { title: "Operativa", items: ["Solicitudes B2B", "Candidatos", "Favoritos", "Mensajes"] },
      { title: "Empresa", items: ["Zonas de búsqueda", "Equipo", "Facturación/plan", "Configuración"] },
    ],
  },
  subcontractor: {
    title: "Panel subcontrata",
    subtitle: "Gestiona oportunidades B2B, disponibilidad, zonas, documentación y plan.",
    stats: [
      { label: "Oportunidades", value: 0, hint: "Se activan por zona", icon: <BriefcaseBusiness size={19} /> },
      { label: "Mensajes", value: 0, icon: <MessageSquare size={19} /> },
      { label: "Zonas", value: "Configurar", icon: <MapPin size={19} /> },
      { label: "Verificación", value: "Pendiente", icon: <Settings size={19} /> },
    ],
    actions: [
      { label: "Ver oportunidades", href: "/subcontratas" },
      { label: "Completar perfil", href: "/registro/subcontrata" },
    ],
    sections: [
      { title: "Trabajo", items: ["Oportunidades B2B", "Mensajes", "Disponibilidad", "Servicios"] },
      { title: "Perfil", items: ["Zonas", "Certificaciones", "Seguro/factura", "Plan"] },
    ],
  },
};

export function RoleDashboard({ role }: { role: Exclude<AccountRole, "admin"> }) {
  const content = roleContent[role];
  return (
    <>
      <DashboardHeader
        title={content.title}
        subtitle={content.subtitle}
        action={
          <div className="flex flex-wrap gap-2">
            {content.actions.map((action) => (
              <Link key={action.href} href={action.href} className="btn btn-secondary text-sm">
                {action.label} <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {content.stats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} hint={stat.hint} />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {content.sections.map((section) => (
          <section key={section.title} className="card p-6">
            <h2 className="font-bold text-ink">{section.title}</h2>
            <ul className="mt-4 space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
