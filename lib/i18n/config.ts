/**
 * Configuración i18n de RegiKaha — nivel europeo.
 *
 * Cubre las 24 lenguas oficiales de la Unión Europea. Cada idioma debe tener
 * el diccionario COMPLETO (sin fallback): la completitud se fuerza por tipos
 * en `dictionaries.ts` (cada locale se tipa como `Dictionary`), de modo que si
 * falta una clave el build falla.
 */

export const locales = [
  "bg", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "hu",
  "ga", "it", "lv", "lt", "mt", "pl", "pt", "ro", "sk", "sl", "es", "sv",
] as const;

export type Locale = (typeof locales)[number];

/** Idioma por defecto (base del contenido). Se detecta el del navegador en cliente. */
export const defaultLocale: Locale = "en";

export interface LocaleMeta {
  code: Locale;
  /** Nombre del idioma en su propia lengua. */
  native: string;
  /** Nombre en inglés (para accesibilidad). */
  english: string;
  /** Bandera (emoji) representativa. */
  flag: string;
  /** Dirección del texto. */
  dir: "ltr" | "rtl";
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  bg: { code: "bg", native: "Български", english: "Bulgarian", flag: "🇧🇬", dir: "ltr" },
  hr: { code: "hr", native: "Hrvatski", english: "Croatian", flag: "🇭🇷", dir: "ltr" },
  cs: { code: "cs", native: "Čeština", english: "Czech", flag: "🇨🇿", dir: "ltr" },
  da: { code: "da", native: "Dansk", english: "Danish", flag: "🇩🇰", dir: "ltr" },
  nl: { code: "nl", native: "Nederlands", english: "Dutch", flag: "🇳🇱", dir: "ltr" },
  en: { code: "en", native: "English", english: "English", flag: "🇪🇺", dir: "ltr" },
  et: { code: "et", native: "Eesti", english: "Estonian", flag: "🇪🇪", dir: "ltr" },
  fi: { code: "fi", native: "Suomi", english: "Finnish", flag: "🇫🇮", dir: "ltr" },
  fr: { code: "fr", native: "Français", english: "French", flag: "🇫🇷", dir: "ltr" },
  de: { code: "de", native: "Deutsch", english: "German", flag: "🇩🇪", dir: "ltr" },
  el: { code: "el", native: "Ελληνικά", english: "Greek", flag: "🇬🇷", dir: "ltr" },
  hu: { code: "hu", native: "Magyar", english: "Hungarian", flag: "🇭🇺", dir: "ltr" },
  ga: { code: "ga", native: "Gaeilge", english: "Irish", flag: "🇮🇪", dir: "ltr" },
  it: { code: "it", native: "Italiano", english: "Italian", flag: "🇮🇹", dir: "ltr" },
  lv: { code: "lv", native: "Latviešu", english: "Latvian", flag: "🇱🇻", dir: "ltr" },
  lt: { code: "lt", native: "Lietuvių", english: "Lithuanian", flag: "🇱🇹", dir: "ltr" },
  mt: { code: "mt", native: "Malti", english: "Maltese", flag: "🇲🇹", dir: "ltr" },
  pl: { code: "pl", native: "Polski", english: "Polish", flag: "🇵🇱", dir: "ltr" },
  pt: { code: "pt", native: "Português", english: "Portuguese", flag: "🇵🇹", dir: "ltr" },
  ro: { code: "ro", native: "Română", english: "Romanian", flag: "🇷🇴", dir: "ltr" },
  sk: { code: "sk", native: "Slovenčina", english: "Slovak", flag: "🇸🇰", dir: "ltr" },
  sl: { code: "sl", native: "Slovenščina", english: "Slovenian", flag: "🇸🇮", dir: "ltr" },
  es: { code: "es", native: "Español", english: "Spanish", flag: "🇪🇸", dir: "ltr" },
  sv: { code: "sv", native: "Svenska", english: "Swedish", flag: "🇸🇪", dir: "ltr" },
};

export const localeList: LocaleMeta[] = locales.map((l) => localeMeta[l]);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
