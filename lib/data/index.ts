import type {
  Professional,
  SearchFilters,
  SortOption,
} from "@/lib/types";
import { categories, featuredCategories, getCategoryById, getCategoryBySlug } from "./categories";
import { locations, getLocationBySlug } from "./locations";
import {
  professionals,
  publicProfessionals,
  getProfessionalById,
  getProfessionalBySlug,
} from "./professionals";
import { services, getServicesByProfessional, getServiceBySlug, getServicesByCategory } from "./services";
import { reviews, getReviewsByProfessional, publishedReviews, pendingReviews } from "./reviews";
import { portfolioItems, getPortfolioByProfessional } from "./portfolio";

export {
  categories,
  featuredCategories,
  getCategoryById,
  getCategoryBySlug,
  locations,
  getLocationBySlug,
  professionals,
  publicProfessionals,
  getProfessionalById,
  getProfessionalBySlug,
  services,
  getServicesByProfessional,
  getServiceBySlug,
  getServicesByCategory,
  reviews,
  getReviewsByProfessional,
  publishedReviews,
  pendingReviews,
  portfolioItems,
  getPortfolioByProfessional,
};

/**
 * RANKING JUSTO — el núcleo ético de RegiKaha.
 *
 * La puntuación de mérito NO incluye ningún factor de pago, plan ni puja.
 * Combina exclusivamente señales de calidad y servicio:
 *  - valoración media (verificada)
 *  - volumen de reseñas (confianza)
 *  - proyectos completados (experiencia real)
 *  - rapidez de respuesta
 *  - estado de verificación
 *
 * Ningún profesional puede pagar para subir. Esta función es la única fuente
 * de orden por defecto en listados y búsquedas.
 */
export function meritScore(p: Professional): number {
  if (!p.activeStatus) return -1;

  // Calidad (0–50): valoración media ponderada por número de reseñas.
  const ratingComponent = (p.averageRating / 5) * 40;
  const reviewConfidence = Math.min(p.reviewCount / 50, 1) * 10;

  // Experiencia (0–20): proyectos completados (saturado) + años.
  const projectsComponent = Math.min(p.completedProjects / 400, 1) * 14;
  const experienceComponent = Math.min(p.yearsExperience / 20, 1) * 6;

  // Servicio (0–15): rapidez de respuesta (menos horas = mejor).
  const responseComponent = Math.max(0, 1 - p.responseTimeHours / 24) * 15;

  // Confianza (0–15): verificación e indicadores declarados.
  let trustComponent = 0;
  if (p.verificationStatus === "verified") trustComponent += 9;
  else if (p.verificationStatus === "limited") trustComponent += 2;
  if (p.insuranceDeclared) trustComponent += 3;
  if (p.invoiceDeclared) trustComponent += 3;

  return (
    ratingComponent +
    reviewConfidence +
    projectsComponent +
    experienceComponent +
    responseComponent +
    trustComponent
  );
}

function matchesFilters(p: Professional, f: SearchFilters): boolean {
  if (f.categoryId && !p.categoryIds.includes(f.categoryId)) return false;
  if (f.locationSlug && p.locationSlug !== f.locationSlug) return false;
  if (f.verifiedOnly && p.verificationStatus !== "verified") return false;
  if (f.withInsurance && !p.insuranceDeclared) return false;
  if (f.withInvoice && !p.invoiceDeclared) return false;
  if (f.urgentOnly && !p.offersUrgent) return false;
  if (f.withPortfolio && getPortfolioByProfessional(p.id).length === 0) return false;
  if (typeof f.minRating === "number" && p.averageRating < f.minRating) return false;
  if (typeof f.maxPriceFrom === "number" && p.priceFrom > f.maxPriceFrom) return false;
  if (typeof f.minYearsExperience === "number" && p.yearsExperience < f.minYearsExperience) return false;
  if (f.professionalType && p.type !== f.professionalType) return false;
  if (f.language && !p.languages.some((l) => l.toLowerCase() === f.language!.toLowerCase())) return false;

  if (f.query) {
    const q = f.query.toLowerCase().trim();
    const haystack = [
      p.publicName,
      p.shortTagline,
      p.description,
      p.city,
      p.province,
      ...p.specialties,
      ...p.categoryIds.map((id) => getCategoryById(id)?.name ?? ""),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  return true;
}

function sortProfessionals(list: Professional[], sort: SortOption): Professional[] {
  const sorted = [...list];
  switch (sort) {
    case "rating":
      sorted.sort((a, b) => b.averageRating - a.averageRating || meritScore(b) - meritScore(a));
      break;
    case "price":
      sorted.sort((a, b) => a.priceFrom - b.priceFrom || meritScore(b) - meritScore(a));
      break;
    case "projects":
      sorted.sort((a, b) => b.completedProjects - a.completedProjects);
      break;
    case "response":
      sorted.sort((a, b) => a.responseTimeHours - b.responseTimeHours);
      break;
    case "experience":
      sorted.sort((a, b) => b.yearsExperience - a.yearsExperience);
      break;
    case "relevance":
    default:
      sorted.sort((a, b) => meritScore(b) - meritScore(a));
      break;
  }
  return sorted;
}

export interface SearchResult {
  results: Professional[];
  total: number;
}

/** Busca profesionales públicos aplicando filtros y orden por mérito. */
export function searchProfessionals(
  filters: SearchFilters = {},
  sort: SortOption = "relevance",
): SearchResult {
  const filtered = publicProfessionals.filter((p) => matchesFilters(p, filters));
  return { results: sortProfessionals(filtered, sort), total: filtered.length };
}

/** Profesionales destacados de la home: top por mérito, solo verificados. */
export function getTopProfessionals(limit = 6): Professional[] {
  return publicProfessionals
    .filter((p) => p.verificationStatus === "verified")
    .sort((a, b) => meritScore(b) - meritScore(a))
    .slice(0, limit);
}

export function getProfessionalsByCategory(categoryId: string, limit?: number): Professional[] {
  const list = publicProfessionals
    .filter((p) => p.categoryIds.includes(categoryId))
    .sort((a, b) => meritScore(b) - meritScore(a));
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

/** Recuento de profesionales públicos por categoría (para listados). */
export function countByCategory(categoryId: string): number {
  return publicProfessionals.filter((p) => p.categoryIds.includes(categoryId)).length;
}

/** Estadísticas agregadas para bandas de confianza y home. */
export function getPlatformStats() {
  const verified = professionals.filter((p) => p.verificationStatus === "verified");
  const totalProjects = verified.reduce((sum, p) => sum + p.completedProjects, 0);
  const avgRating =
    verified.reduce((sum, p) => sum + p.averageRating, 0) / Math.max(verified.length, 1);
  return {
    verifiedCount: verified.length,
    categoriesCount: categories.length,
    reviewsCount: publishedReviews.length,
    projectsCount: totalProjects,
    averageRating: Math.round(avgRating * 10) / 10,
    foundersRemaining: 300 - professionals.filter((p) => p.founderMember).length,
  };
}

export const languageOptions = ["Español", "Catalán", "Valenciano", "Euskera", "Gallego", "Inglés", "Francés", "Alemán"];
