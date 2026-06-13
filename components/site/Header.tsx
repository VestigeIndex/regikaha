"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
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
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-[0.925rem] font-medium text-ink/80 hover:text-forest-700 rounded-lg hover:bg-forest-500/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link href="/buscar" className="btn btn-secondary">
            <Search size={16} />
            Buscar
          </Link>
          <Link href="/registro" className="btn btn-primary">
            Soy profesional
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid place-items-center h-10 w-10 rounded-lg text-ink hover:bg-forest-500/8"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white border-t hairline overflow-y-auto animate-fade-in">
          <div className="container-x py-5 flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium text-ink hover:bg-forest-500/6 rounded-xl"
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-[var(--hairline)] my-3" />
            <Link href="/buscar" onClick={() => setOpen(false)} className="btn btn-secondary w-full">
              <Search size={16} /> Buscar profesionales
            </Link>
            <Link href="/registro" onClick={() => setOpen(false)} className="btn btn-primary w-full mt-2">
              Soy profesional
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
