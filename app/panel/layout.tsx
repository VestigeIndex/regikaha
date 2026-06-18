import type { Metadata } from "next";
import { Building2, BriefcaseBusiness, HardHat, Heart, Inbox, LayoutDashboard, Receipt, Star, User, UserRound, Wrench } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Panel del profesional",
  robots: { index: false, follow: false },
};

const nav: NavItem[] = [
  { label: "Entrada", href: "/panel", icon: <LayoutDashboard size={18} /> },
  { label: "Cliente", href: "/panel/cliente", icon: <UserRound size={18} /> },
  { label: "Profesional", href: "/panel/profesional", icon: <HardHat size={18} /> },
  { label: "Empresa", href: "/panel/empresa", icon: <Building2 size={18} /> },
  { label: "Subcontrata", href: "/panel/subcontrata", icon: <BriefcaseBusiness size={18} /> },
  { label: "Suscripción", href: "/panel/profesional/facturacion", icon: <Receipt size={18} /> },
  { label: "Solicitudes", href: "/panel/solicitudes", icon: <Inbox size={18} /> },
  { label: "Mi perfil", href: "/panel/perfil", icon: <User size={18} /> },
  { label: "Mis servicios", href: "/panel/servicios", icon: <Wrench size={18} /> },
  { label: "Valoraciones", href: "/panel/resenas", icon: <Star size={18} /> },
  { label: "Favoritos", href: "/panel/cliente", icon: <Heart size={18} /> },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={nav} badge="RegiKaha Pro · Fundador">
      {children}
    </DashboardShell>
  );
}
