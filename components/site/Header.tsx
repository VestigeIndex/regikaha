"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogIn, Menu, Search, UserRound, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { initialsFromUser, panelPathForRole } from "@/lib/accounts";
import { useI18n } from "@/lib/i18n/context";
import { headerDictionaries } from "@/lib/i18n/header";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "search", href: "/buscar" },
  { key: "map", href: "/mapa" },
  { key: "categories", href: "/categorias" },
  { key: "howItWorks", href: "/como-funciona" },
  { key: "forPros", href: "/para-profesionales" },
  { key: "pricing", href: "/precios" },
] as const;

const navLinkClass = "whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-none text-ink/75 transition hover:bg-forest-500/7 hover:text-forest-800 2xl:px-3.5";

const roleLabels: Record<string, string> = {
  client: "Panel cliente",
  professional: "Panel profesional",
  company: "Panel empresa",
  subcontractor: "Panel subcontrata",
};

export function Header() {
  const { t, locale } = useI18n();
  const headerCopy = headerDictionaries[locale];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setMe(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST", cache: "no-store", credentials: "same-origin" }).catch(() => undefined);
    setMe({ authenticated: false });
    setAccountOpen(false);
    window.location.href = "/";
  }

  async function switchRole(role: string) {
    const res = await fetch("/api/session/active-role", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ role }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) window.location.href = data.panelPath || panelPathForRole(role);
  }

  const authenticated = !!me?.authenticated;
  const panelHref = me?.panelPath || panelPathForRole(me?.user?.activeRole || me?.user?.role);
  const availableRoles: string[] = (me?.user?.availableRoles || []).filter((r: string) => r !== "admin" && r !== "superadmin");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-forest-600/10 transition-all",
        scrolled ? "bg-white/95 shadow-soft backdrop-blur-xl" : "bg-white/90 backdrop-blur-xl",
      )}
    >
      <div className="container-x grid h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 xl:grid-cols-[190px_minmax(0,1fr)_auto] xl:gap-4">
        <div className="flex min-w-0 items-center xl:w-[190px]">
          <Logo className="max-w-[180px]" />
        </div>

        <nav className="hidden min-w-0 items-center justify-center gap-0.5 xl:flex" aria-label={t.ui.nav.openMenu}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {t.ui.nav[item.key]}
            </Link>
          ))}
          <Link href="/ayuda" className={navLinkClass}>{headerCopy.help}</Link>
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-2 xl:flex">
          <LanguageSwitcher />
          {authenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="inline-flex h-11 items-center gap-2 rounded-full px-2.5 pr-4 text-sm font-semibold text-ink/80 transition hover:bg-forest-500/7"
                aria-expanded={accountOpen}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-600 text-xs font-bold text-white">
                  {initialsFromUser(me.user || {})}
                </span>
                <span className="whitespace-nowrap">{headerCopy.account}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-elevated ring-1 ring-forest-600/10">
                  <p className="px-3 py-2 text-xs text-muted truncate">{me.user?.email}</p>
                  <Link href={panelHref} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-forest-500/6">{headerCopy.myPanel}</Link>
                  {availableRoles.length > 1 && (
                    <div className="my-1 border-t border-forest-600/10 pt-1">
                      {availableRoles.map((role) => (
                        <button key={role} type="button" onClick={() => switchRole(role)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-forest-500/6">
                          {roleLabels[role] || role}
                        </button>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-forest-500/6">
                    {headerCopy.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/conectar" className="btn btn-ghost h-11 whitespace-nowrap px-4">
              <LogIn size={16} /> {headerCopy.signIn}
            </Link>
          )}
          <Link href="/publicar-proyecto" className="btn btn-primary h-11 whitespace-nowrap px-5 shadow-sm">
            {t.ui.nav.publishProjectFree}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl text-ink hover:bg-forest-500/8"
            aria-label={open ? t.ui.nav.closeMenu : t.ui.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden absolute inset-x-0 top-[72px] z-40 h-[calc(100dvh-72px)] bg-white border-t hairline overflow-y-auto animate-fade-in">
          <div className="container-x py-5 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium text-ink hover:bg-forest-500/6 rounded-xl"
              >
                {t.ui.nav[item.key]}
              </Link>
            ))}
            <Link href="/ayuda" onClick={() => setOpen(false)} className="px-3 py-3 text-base font-medium text-ink hover:bg-forest-500/6 rounded-xl">{headerCopy.help}</Link>
            <div className="h-px bg-[var(--hairline)] my-3" />
            {authenticated ? (
              <>
                <Link href={panelHref} onClick={() => setOpen(false)} className="btn btn-secondary w-full">
                  <UserRound size={16} /> {headerCopy.myPanel}
                </Link>
                <button type="button" onClick={logout} className="btn btn-ghost w-full mt-2">
                  {headerCopy.logout}
                </button>
              </>
            ) : (
              <Link href="/conectar" onClick={() => setOpen(false)} className="btn btn-secondary w-full">
                <LogIn size={16} /> {headerCopy.signIn}
              </Link>
            )}
            <Link href="/buscar" onClick={() => setOpen(false)} className="btn btn-secondary w-full">
              <Search size={16} /> {t.actions.search}
            </Link>
            <Link href="/publicar-proyecto" onClick={() => setOpen(false)} className="btn btn-primary w-full mt-2">
              {t.ui.nav.publishProjectFree}
            </Link>
            <Link href="/registro/profesional" onClick={() => setOpen(false)} className="btn btn-secondary w-full mt-2">
              {t.actions.imPro}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
