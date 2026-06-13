import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases de Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un precio "desde" en euros (sin decimales para precios redondos). */
export function formatPriceFrom(value: number): string {
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
  return formatted;
}

/** Etiqueta legible para el tipo de precio de un servicio. */
export function priceTypeLabel(type: "fixed" | "from" | "hour" | "m2" | "project"): string {
  switch (type) {
    case "fixed":
      return "precio cerrado";
    case "from":
      return "desde";
    case "hour":
      return "/ hora";
    case "m2":
      return "/ m²";
    case "project":
      return "por proyecto";
  }
}

/** Convierte un texto a slug URL-safe en español. */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Devuelve "hace X" en español a partir de una fecha ISO. */
export function timeAgo(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "hoy";
  if (days < 30) return `hace ${days} ${days === 1 ? "día" : "días"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
  const years = Math.floor(months / 12);
  return `hace ${years} ${years === 1 ? "año" : "años"}`;
}

/** Pluraliza una palabra simple en español. */
export function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm;
}
