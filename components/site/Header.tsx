"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogIn, Menu, Search, UserRound, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { initialsFromUser, panelPathForRole } from "@/lib/accounts";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "search", href: "/buscar" },
  { key: "map", href: "/mapa" },
  { key: "categories", href: "/categorias" },
  { key: "howItWorks", href: "/como-funciona" },
  { key: "forPros", href: "/para-profesionales" },
  { key: "pricing", href: "/precios" },
] as const;

export function Header() {
  const t = useT();
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
    fetch("/api/me")
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
    await fetch("/api/logout", { method: "POST" }).catch(() => undefined);
    setMe({ authenticated: false });
    setAccountOpen(false);
    window.location.href = "/";
  }

  const authenticated = !!me?.authenticated;
  const panelHref = panelPathForRole(me?.user?.role);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled ? "glass shadow-soft" : "bg-white/70 backdrop-blur-md border-b border-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-[0.925rem] font-medium text-ink/80 hover:text-forest-700 rounded-lg hover:bg-forest-500/5 transition-colors"
            >
              {t.ui.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-1.5">
          <LanguageSwitcher />
          {authenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink/80 hover:bg-forest-500/6"
                aria-expanded={accountOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-600 text-xs font-bold text-white">
                  {initialsFromUser(me.user || {})}
                </span>
                Cuenta
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-elevated ring-1 ring-forest-600/10">
                  <p className="px-3 py-2 text-xs text-muted truncate">{me.user?.email}</p>
                  <Link href={panelHref} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-forest-500/6">Ir a mi panel</Link>
                  <button type="button" onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-forest-500/6">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/conectar" className="btn btn-ghost">
              <LogIn size={16} /> Conectar
            </Link>
          )}
          <Link href="/buscar" className="btn btn-secondary">
            <Search size={16} />
            {t.actions.search}
          </Link>
          <Link href="/publicar-proyecto" className="btn btn-primary">
            {t.ui.nav.publishProjectFree}
          </Link>
          {!authenticated && (
            <Link href="/registro/profesional" className="btn btn-secondary">
              Soy profesional
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid place-items-center h-10 w-10 rounded-lg text-ink hover:bg-forest-500/8"
            aria-label={open ? t.ui.nav.closeMenu : t.ui.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white border-t hairline overflow-y-auto animate-fade-in">
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
            <div className="h-px bg-[var(--hairline)] my-3" />
            {authenticated ? (
              <>
                <Link href={panelHref} onClick={() => setOpen(false)} className="btn btn-secondary w-full">
                  <UserRound size={16} /> Ir a mi panel
                </Link>
                <button type="button" onClick={logout} className="btn btn-ghost w-full mt-2">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/conectar" onClick={() => setOpen(false)} className="btn btn-secondary w-full">
                <LogIn size={16} /> Conectar
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
