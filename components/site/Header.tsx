"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "search", href: "/buscar" },
  { label: "Mapa", href: "/mapa" },
  { key: "categories", href: "/categorias" },
  { key: "howItWorks", href: "/como-funciona" },
  { key: "forPros", href: "/para-profesionales" },
  { key: "pricing", href: "/precios" },
] as const;

export function Header() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
              {"label" in item ? item.label : t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-1.5">
          <LanguageSwitcher />
          <Link href="/buscar" className="btn btn-secondary">
            <Search size={16} />
            {t.actions.search}
          </Link>
          <Link href="/publicar-proyecto" className="btn btn-primary">
            Publicar proyecto gratis
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid place-items-center h-10 w-10 rounded-lg text-ink hover:bg-forest-500/8"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
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
                {"label" in item ? item.label : t.nav[item.key]}
              </Link>
            ))}
            <div className="h-px bg-[var(--hairline)] my-3" />
            <Link href="/buscar" onClick={() => setOpen(false)} className="btn btn-secondary w-full">
              <Search size={16} /> {t.actions.search}
            </Link>
            <Link href="/publicar-proyecto" onClick={() => setOpen(false)} className="btn btn-primary w-full mt-2">
              Publicar proyecto gratis
            </Link>
            <Link href="/registro" onClick={() => setOpen(false)} className="btn btn-secondary w-full mt-2">
              {t.actions.imPro}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
