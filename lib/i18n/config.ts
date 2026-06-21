/**
 * Configuración i18n de Regi Kaha — nivel europeo.
 *
 * Cubre los idiomas operativos de los países objetivo:
 * España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos,
 * Bélgica, Irlanda y Reino Unido.
 *
 * Cada idioma debe tener el diccionario COMPLETO (sin fallback): la completitud
 * se fuerza por tipos en los diccionarios, de modo que si falta una clave el
 * build falla.
 */

export const locales = [
  "es", "fr", "it", "pt", "de", "nl", "en",
] as const;

export type Locale = (typeof locales)[number];

/** Idioma por defecto del mercado inicial. Se detecta el del navegador en cliente. */
export const defaultLocale: Locale = "es";

export interface LocaleMeta {
  code: Locale;
  /** Nombre del idioma en su propia lengua. */
  native: string;
  /** Nombre en inglés (para accesibilidad). */
  english: string;
  /** Código ISO 3166 usado por flag-icons para renderizar SVG real. */
  flagCountry: string;
  /** Dirección del texto. */
  dir: "ltr" | "rtl";
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  es: { code: "es", native: "Español", english: "Spanish", flagCountry: "es", dir: "ltr" },
  fr: { code: "fr", native: "Français", english: "French", flagCountry: "fr", dir: "ltr" },
  it: { code: "it", native: "Italiano", english: "Italian", flagCountry: "it", dir: "ltr" },
  pt: { code: "pt", native: "Português", english: "Portuguese", flagCountry: "pt", dir: "ltr" },
  de: { code: "de", native: "Deutsch", english: "German", flagCountry: "de", dir: "ltr" },
  nl: { code: "nl", native: "Nederlands", english: "Dutch", flagCountry: "nl", dir: "ltr" },
  en: { code: "en", native: "English", english: "English", flagCountry: "gb", dir: "ltr" },
};

export const localeList: LocaleMeta[] = locales.map((l) => localeMeta[l]);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
