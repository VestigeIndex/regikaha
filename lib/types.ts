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
export type ProjectStatus =
  | "draft"
  | "published"
  | "receiving_pre_estimates"
  | "in_conversation"
  | "technical_visit_pending"
  | "final_quote_received"
  | "accepted"
  | "in_progress"
  | "finished"
  | "review_pending"
  | "cancelled";

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
  label: string;
  scope: "europe" | "country" | "city";
  countryCode: string;
  country: string;
  city?: string;
  province?: string;
  autonomousCommunity?: string;
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
  countryCode?: string;
  country?: string;
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
  logoImage?: string | null;
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

export interface ProjectRequest {
  id: string;
  clientId?: string | null;
  clientType: "particular" | "empresa" | "comunidad" | "administrador_fincas";
  country: string;
  city: string;
  postalCode?: string;
  categoryId: string;
  subcategory?: string;
  description: string;
  urgency: Urgency;
  budgetRange?: string;
  propertyType?: string;
  approximateMeasures?: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface B2BProjectRequest {
  id: string;
  companyId?: string | null;
  country: string;
  city: string;
  requiredSpecialty: string;
  projectType: string;
  startDate?: string;
  duration?: string;
  teamSize?: string;
  requiredDocuments: string[];
  description: string;
  budgetRange?: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface PreEstimate {
  id: string;
  projectId: string;
  professionalId: string;
  priceFrom: number;
  priceTo: number;
  currency: "EUR";
  estimatedTime: string;
  requiresVisit: boolean;
  visitType: "no_visit" | "free_visit" | "paid_visit" | "video_call" | "technical_measurement";
  materialsIncluded: "yes" | "no" | "to_confirm";
  laborIncluded: "yes" | "no" | "to_confirm";
  notes: string;
  status: "draft" | "sent" | "accepted" | "discarded";
  createdAt: string;
}

export interface CoverageStatusRecord {
  id: string;
  country: string;
  city: string;
  categoryId: string;
  status: "sin-cobertura" | "verificando" | "inicial" | "activa" | "fuerte";
  professionalsCount: number;
  demandCount: number;
  lastUpdated: string;
}

export interface LeadSource {
  id: string;
  source: string;
  professionalName: string;
  categoryId: string;
  city: string;
  country: string;
  status: "nuevo" | "contactado" | "interesado" | "registrado" | "verificacion_pendiente" | "activo" | "rechazado";
  notes?: string;
  campaign?: string;
  relatedDemandId?: string;
}

export interface GrowthTask {
  id: string;
  type: "captar_profesionales" | "captar_subcontratas" | "seo" | "moderacion";
  country: string;
  city: string;
  categoryId: string;
  priority: 1 | 2 | 3;
  status: "open" | "in_progress" | "done";
  assignedTo?: string;
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
  plan: "autonomo_monthly" | "autonomo_yearly" | "europa_monthly" | "europa_yearly" | "founder";
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
