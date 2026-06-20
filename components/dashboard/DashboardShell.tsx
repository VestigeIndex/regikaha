"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Calculator, ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, Receipt, Star, User, Wrench, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import {
  isPanelPathAllowed,
  normalizeRole,
  panelPathForRole,
  roleBillingPaths,
  type AccountRole,
} from "@/lib/accounts";
import { useI18n } from "@/lib/i18n/context";
import { dashboardDictionaries, type DashboardCopy } from "@/lib/i18n/dashboard";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SessionState {
  user: { email: string; name?: string | null; role: AccountRole };
}

function navForRole(role: AccountRole, copy: DashboardCopy): NavItem[] {
  if (role === "admin") return [];
  const nav: NavItem[] = [
    { label: copy.nav.overview, href: panelPathForRole(role), icon: <LayoutDashboard size={18} /> },
  ];
  if (role === "professional") {
    nav.push(
      { label: copy.nav.requests, href: "/panel/solicitudes", icon: <Inbox size={18} /> },
      { label: copy.nav.profile, href: "/panel/perfil", icon: <User size={18} /> },
      { label: copy.nav.services, href: "/panel/servicios", icon: <Wrench size={18} /> },
      { label: copy.nav.reviews, href: "/panel/resenas", icon: <Star size={18} /> },
    );
  }
  if (role !== "client") nav.push({ label: copy.nav.tools, href: "/panel/herramientas", icon: <Calculator size={18} /> });
  const billingPath = roleBillingPaths[role];
  if (billingPath) nav.push({ label: copy.nav.subscription, href: billingPath, icon: <Receipt size={18} /> });
  return nav;
}

export function DashboardShell({ children, nav: providedNav, badge }: { children: React.ReactNode; nav?: NavItem[]; badge?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useI18n();
  const copy = dashboardDictionaries[locale];
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.authenticated) {
          router.replace(`/conectar?next=${encodeURIComponent(pathname)}`);
          return;
        }
        const role = normalizeRole(data.user?.role);
        if (role === "admin" && !pathname.startsWith("/admin")) {
          router.replace("/admin");
          return;
        }
        if (role !== "admin" && !isPanelPathAllowed(role, pathname)) {
          router.replace(panelPathForRole(role));
          return;
        }
        setSession({ user: { ...data.user, role } });
      })
      .catch(() => router.replace(`/conectar?next=${encodeURIComponent(pathname)}`));
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  const nav = useMemo(
    () => providedNav || (session ? navForRole(session.user.role, copy) : []),
    [copy, providedNav, session],
  );

  async function logout() {
    await fetch("/api/logout", { method: "POST", cache: "no-store", credentials: "same-origin" }).catch(() => undefined);
    window.location.assign("/");
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-canvas grid place-items-center px-4" role="status" aria-live="polite">
        <div className="text-center">
          <Logo />
          <p className="mt-5 text-sm text-muted">{copy.loading}</p>
        </div>
      </div>
    );
  }

  const role = session.user.role;
  const roleLabel = badge || (role === "admin" ? "Admin" : copy.roles[role]);
  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b hairline px-5 py-5">
        <Logo />
        <div className="mt-3 flex items-center gap-2">
          <span className="chip bg-mint text-forest-800">RegiKaha · {roleLabel}</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label={copy.navigation}>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-forest-600 text-white shadow-soft" : "text-ink/75 hover:bg-forest-500/8 hover:text-forest-800",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className={active ? "text-white" : "text-forest-500"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t hairline p-3">
        <div className="px-3.5 py-2">
          <p className="text-xs font-semibold text-ink">{copy.account}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{session.user.name || session.user.email}</p>
        </div>
        <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-ink/75 hover:bg-forest-500/8 hover:text-forest-800">
          <LogOut size={16} /> {copy.logout}
        </button>
        <Link href="/" className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-muted hover:text-forest-700">
          <ExternalLink size={16} /> {copy.backToSite}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-screen border-r hairline bg-white lg:sticky lg:top-0 lg:block">{sidebar}</aside>

        <div className="glass sticky top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden">
          <Logo />
          <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-canvas" aria-label={copy.openMenu}>
            <Menu size={22} />
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <div className="animate-fade-in relative h-full w-72 max-w-[85%] bg-white">
              <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg hover:bg-canvas" aria-label={copy.closeMenu}>
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

      <nav className="dashboard-mobile-nav lg:hidden" aria-label={copy.navigation}>
        {nav.slice(0, 5).map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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

export function StatCard({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="grid place-items-center h-10 w-10 rounded-xl bg-forest-500/12 text-forest-600">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-ink leading-none">{value}</p>
      <p className="text-sm text-muted mt-1.5">{label}</p>
      {hint && <p className="text-xs text-forest-700 mt-1">{hint}</p>}
    </div>
  );
}
