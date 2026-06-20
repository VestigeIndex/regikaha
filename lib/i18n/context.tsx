"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, defaultLocale, isLocale, localeMeta } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";
import { homeDictionaries, type HomeDict } from "./home";
import { uiDictionaries, type UiDict } from "./ui";

/** Diccionario completo (base + extensión de home). */
export type FullDict = Dictionary & HomeDict & { ui: UiDict };

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: FullDict;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "regikaha-locale";

function explicitLocale(): Locale | null {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const fromPath = window.location.pathname.split("/").filter(Boolean)[0];
    if (fromPath && isLocale(fromPath)) return fromPath;
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && isLocale(fromUrl)) return fromUrl;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    /* almacenamiento no disponible */
  }
  return null;
}

function browserLocale(): Locale {
  const candidates = typeof navigator === "undefined" ? [] : [navigator.language, ...(navigator.languages || [])];
  for (const value of candidates) {
    const locale = value?.slice(0, 2).toLowerCase();
    if (locale && isLocale(locale)) return locale;
  }
  return defaultLocale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Detecta el idioma en el cliente tras montar (compatible con export estático).
  useEffect(() => {
    const explicit = explicitLocale();
    if (explicit) {
      setLocaleState(explicit);
      return;
    }

    let cancelled = false;
    fetch("/api/locale", { headers: { accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("locale unavailable")))
      .then((data) => {
        if (!cancelled && isLocale(String(data.locale || ""))) setLocaleState(data.locale);
      })
      .catch(() => {
        if (!cancelled) setLocaleState(browserLocale());
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      if (window.location.pathname.startsWith("/regi-b1l") || window.location.pathname.startsWith("/regi-works")) return;
      document.documentElement.lang = locale;
      document.documentElement.dir = localeMeta[locale].dir;
    } catch {
      /* noop */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts[0] && isLocale(parts[0]) && parts[0] !== l) {
        parts[0] = l;
        window.location.assign(`/${parts.join("/")}${window.location.search}${window.location.hash}`);
        return;
      }
    } catch {
      /* noop */
    }
    setLocaleState(l);
  }, []);

  const t: FullDict = { ...dictionaries[locale], ...homeDictionaries[locale], ui: uiDictionaries[locale] };

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
