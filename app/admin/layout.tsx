import type { Metadata } from "next";
import { LayoutDashboard, ShieldCheck, Users, MessageSquareWarning } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

const nav: NavItem[] = [
  { label: "Resumen", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Verificaciones", href: "/admin/verificaciones", icon: <ShieldCheck size={18} /> },
  { label: "Profesionales", href: "/admin/profesionales", icon: <Users size={18} /> },
  { label: "Moderación de reseñas", href: "/admin/resenas", icon: <MessageSquareWarning size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={nav} badge="Administración">
      {children}
    </DashboardShell>
  );
}
