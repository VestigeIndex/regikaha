"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { localeList, localeMeta } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

function Flag({ country, label }: { country: string; label: string }) {
  return (
    <span
      className={cn(
        `fi fi-${country.toLowerCase()}`,
        "inline-flex h-4 w-5 shrink-0 rounded-[3px] bg-cover bg-center shadow-[0_0_0_1px_rgba(15,92,74,0.16)]",
      )}
      aria-label={label}
      role="img"
    />
  );
}

/** Selector de idioma con banderas SVG para los idiomas operativos. */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = localeMeta[locale];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-ink/80 hover:text-forest-700 hover:bg-forest-500/6 transition-colors",
          compact ? "px-2 py-2" : "px-2.5 py-2",
        )}
        aria-label={t.lang.label}
        aria-expanded={open}
      >
        <Globe size={16} className="text-forest-500" />
        <Flag country={current.flagCountry} label={current.english} />
        {!compact && <span className="uppercase text-xs">{current.code}</span>}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 max-h-[70vh] overflow-y-auto rounded-2xl bg-white shadow-elevated ring-1 ring-forest-600/10 p-2 z-50 animate-fade-in">
          <p className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{t.lang.label}</p>
          <ul className="grid grid-cols-1">
            {localeList.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    l.code === locale ? "bg-forest-500/10 text-forest-800 font-medium" : "text-ink/80 hover:bg-forest-500/6",
                  )}
                >
                  <Flag country={l.flagCountry} label={l.english} />
                  <span className="flex-1 text-left">{l.native}</span>
                  {l.code === locale && <Check size={15} className="text-forest-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
