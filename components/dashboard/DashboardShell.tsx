"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  /** Elemento de icono ya creado (p. ej. <Inbox size={18} />). */
  icon: ReactNode;
}

export function DashboardShell({
  nav,
  badge,
  children,
}: {
  nav: NavItem[];
  badge: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b hairline">
        <Logo />
        <div className="mt-3 flex items-center gap-2">
          <span className="chip bg-mint text-forest-800">{badge}</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/panel" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-forest-600 text-white shadow-soft" : "text-ink/75 hover:bg-forest-500/8 hover:text-forest-800",
              )}
            >
              <span className={active ? "text-white" : "text-forest-500"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t hairline">
        <Link href="/" className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm text-muted hover:text-forest-700">
          <ExternalLink size={16} /> Volver a la web
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block sticky top-0 h-screen bg-white border-r hairline">{sidebar}</aside>

        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-40 glass flex items-center justify-between px-4 h-14">
          <Logo />
          <button onClick={() => setOpen(true)} className="grid place-items-center h-10 w-10 rounded-lg hover:bg-canvas" aria-label="Abrir menú">
            <Menu size={22} />
          </button>
        </div>

        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <div className="relative w-72 max-w-[85%] h-full bg-white animate-fade-in">
              <button onClick={() => setOpen(false)} className="absolute top-4 right-3 grid place-items-center h-9 w-9 rounded-lg hover:bg-canvas" aria-label="Cerrar">
                <X size={20} />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <main className="min-w-0 pb-24 lg:pb-0">
          <div className="container-x py-6 sm:py-8 lg:py-10">{children}</div>
        </main>
      </div>

      <nav className="dashboard-mobile-nav lg:hidden" aria-label="Navegación principal del panel">
        {nav.slice(0, 5).map((item) => {
          const active = pathname === item.href || (item.href !== "/panel" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.href} href={item.href} className={cn("dashboard-mobile-link", active && "is-active")} aria-current={active ? "page" : undefined}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/** Cabecera de página del panel. */
export function DashboardHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="text-muted mt-1">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

/** Tarjeta de métrica reutilizable para los paneles. */
export function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="grid place-items-center h-10 w-10 rounded-xl bg-forest-500/12 text-forest-600">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-ink leading-none">{value}</p>
      <p className="text-sm text-muted mt-1.5">{label}</p>
      {hint && <p className="text-xs text-forest-700 mt-1">{hint}</p>}
    </div>
  );
}
