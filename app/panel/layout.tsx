import type { Metadata } from "next";
import { LayoutDashboard, Inbox, User, Wrench, Star } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Panel del profesional",
  robots: { index: false, follow: false },
};

const nav: NavItem[] = [
  { label: "Resumen", href: "/panel", icon: <LayoutDashboard size={18} /> },
  { label: "Solicitudes", href: "/panel/solicitudes", icon: <Inbox size={18} /> },
  { label: "Mi perfil", href: "/panel/perfil", icon: <User size={18} /> },
  { label: "Mis servicios", href: "/panel/servicios", icon: <Wrench size={18} /> },
  { label: "Valoraciones", href: "/panel/resenas", icon: <Star size={18} /> },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={nav} badge="RegiNova Pro · Fundador">
      {children}
    </DashboardShell>
  );
}
