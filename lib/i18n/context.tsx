"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, defaultLocale, isLocale, localeMeta } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";
import { homeDictionaries, type HomeDict } from "./home";

/** Diccionario completo (base + extensión de home). */
export type FullDict = Dictionary & HomeDict;

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: FullDict;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "regikaha-locale";

function detectInitial(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && isLocale(fromUrl)) return fromUrl;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
    const nav = navigator.language?.slice(0, 2).toLowerCase();
    if (nav && isLocale(nav)) return nav;
  } catch {
    /* almacenamiento no disponible */
  }
  return defaultLocale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Detecta el idioma en el cliente tras montar (compatible con export estático).
  useEffect(() => {
    setLocaleState(detectInitial());
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = locale;
      document.documentElement.dir = localeMeta[locale].dir;
    } catch {
      /* noop */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
  }, []);

  const t: FullDict = { ...dictionaries[locale], ...homeDictionaries[locale] };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de I18nProvider");
  return ctx;
}

/** Acceso directo al diccionario del idioma activo: `const t = useT(); t.nav.search`. */
export function useT(): FullDict {
  return useI18n().t;
}
