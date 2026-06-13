/**
 * Modelo de datos de RegiKaha.
 *
 * Estos tipos reflejan las entidades del marketplace y están diseñados para
 * mapearse 1:1 con tablas de base de datos (Cloudflare D1 / PostgreSQL) en el
 * futuro. La fase inicial usa datos mock servidos desde `lib/data`, pero el
 * resto de la app consume SIEMPRE estas interfaces, de modo que migrar a una
 * base de datos real no requiere tocar la UI.
 */

export type VerificationStatus = "pending" | "verified" | "limited" | "suspended";

export type ProfessionalType =
  | "empresa_reformas"
  | "autonomo"
  | "estudio_arquitectura"
  | "ingenieria"
  | "multiservicio"
  | "instalador";

export type PriceType = "fixed" | "from" | "hour" | "m2" | "project";

export type QuoteStatus = "new" | "contacted" | "quoted" | "won" | "lost" | "closed";

export type ReviewStatus = "published" | "pending" | "rejected";

export type Urgency = "flexible" | "this_month" | "urgent";

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Nombre en singular para títulos de profesional ("electricista"). */
  professionalNoun: string;
  /** Forma usada en rutas SEO de profesionales ("electricistas"). */
  professionalNounPlural: string;
  shortDescription: string;
  description: string;
  /** Nombre del icono de lucide-react. */
  icon: string;
  image: string;
  popularServices: string[];
  featured: boolean;
}

export interface Location {
  slug: string;
  city: string;
  province: string;
  autonomousCommunity: string;
}

export interface ServiceItem {
  id: string;
  professionalId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  priceFrom: number;
  priceType: PriceType;
  estimatedTime: string;
  includes: string[];
  excludes: string[];
  process: string[];
  faqs: { q: string; a: string }[];
  serviceArea: string;
  isActive: boolean;
}

export interface PortfolioItem {
  id: string;
  professionalId: string;
  title: string;
  category: string;
  description: string;
  location: string;
  /** Imagen "antes" (placeholder SVG en fase inicial). */
  beforeImage: string;
  /** Imagen "después". */
  afterImage: string;
  galleryImages: string[];
  completionDate: string;
}

export interface Review {
  id: string;
  professionalId: string;
  clientId: string;
  clientName: string;
  quoteRequestId: string | null;
  serviceLabel: string;
  rating: number;
  qualityRating: number;
  priceRating: number;
  communicationRating: number;
  punctualityRating: number;
  professionalismRating: number;
  comment: string;
  reply: string | null;
  status: ReviewStatus;
  verified: boolean;
  createdAt: string;
}

export interface Professional {
  id: string;
  userId: string;
  slug: string;
  type: ProfessionalType;
  typeLabel: string;
  publicName: string;
  legalName: string;
  nifCif: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  autonomousCommunity: string;
  locationSlug: string;
  serviceArea: string;
  serviceRadiusKm: number;
  categoryIds: string[];
  specialties: string[];
  yearsExperience: number;
  languages: string[];
  verificationStatus: VerificationStatus;
  insuranceDeclared: boolean;
  invoiceDeclared: boolean;
  offersUrgent: boolean;
  certifications: string[];
  averageRating: number;
  reviewCount: number;
  completedProjects: number;
  /** Tiempo medio de respuesta en horas. */
  responseTimeHours: number;
  /** Precio orientativo "desde" del profesional, para filtros. */
  priceFrom: number;
  description: string;
  shortTagline: string;
  logoColor: string;
  coverImage: string;
  founderMember: boolean;
  activeStatus: boolean;
  joinedAt: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  categoryId: string;
  serviceId: string | null;
  professionalId: string | null;
  location: string;
  description: string;
  budgetRange: string;
  urgency: Urgency;
  status: QuoteStatus;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  professionalId: string;
  professionalName: string;
  submittedAt: string;
  status: VerificationStatus;
  checks: {
    identity: boolean;
    nifCif: boolean;
    email: boolean;
    phone: boolean;
    insurance: boolean;
    portfolio: boolean;
  };
  notes: string;
}

export interface Subscription {
  id: string;
  professionalId: string;
  plan: "monthly" | "yearly" | "founder";
  status: "trial" | "active" | "past_due" | "canceled";
  priceEur: number;
  startedAt: string;
  renewsAt: string;
}

/** Filtros aplicables en el buscador de profesionales. */
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  locationSlug?: string;
  minRating?: number;
  verifiedOnly?: boolean;
  withInsurance?: boolean;
  withInvoice?: boolean;
  urgentOnly?: boolean;
  withPortfolio?: boolean;
  language?: string;
  professionalType?: ProfessionalType;
  maxPriceFrom?: number;
  minYearsExperience?: number;
}

export type SortOption =
  | "relevance"
  | "rating"
  | "price"
  | "projects"
  | "response"
  | "experience";
