export const b1lLocales = ["es", "en", "fr", "de", "it", "pt", "nl"] as const;
export type B1LLocale = (typeof b1lLocales)[number];

export type B1LTab =
  | "dashboard"
  | "leads"
  | "clients"
  | "projects"
  | "quotes"
  | "documents"
  | "materials"
  | "providers"
  | "team"
  | "plans"
  | "settings";

export type CountryCode = "ES" | "FR" | "IT" | "PT" | "CH" | "DE" | "NL" | "BE" | "IE" | "GB";
export type ProjectStatus = "lead" | "planning" | "active" | "paused" | "completed";
export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";
export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type DocumentType = "quote" | "invoice" | "delivery" | "contract" | "certificate";

export interface Client {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: CountryCode;
  preferredLanguage: B1LLocale;
  notes: string;
  createdAt: string;
}

export interface ProjectPhoto {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  address: string;
  city: string;
  country: CountryCode;
  trade: string;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  budget: number;
  notes: string;
  photos: ProjectPhoto[];
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface SignatureRecord {
  signer: string;
  signedAt: string;
  dataUrl: string;
  consent: boolean;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  projectId: string;
  status: QuoteStatus;
  items: QuoteItem[];
  taxRate: number;
  discountRate: number;
  validUntil: string;
  notes: string;
  signature?: SignatureRecord;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  service: string;
  city: string;
  country: CountryCode;
  phone: string;
  email: string;
  status: LeadStatus;
  source: "regikaha" | "manual";
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  number: string;
  title: string;
  clientId: string;
  projectId: string;
  status: "draft" | "issued" | "signed";
  amount?: number;
  verificationCode: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  active: boolean;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  country: CountryCode;
  phone: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

export interface CompanySettings {
  companyName: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: CountryCode;
  currency: "EUR" | "CHF" | "GBP";
  defaultTaxRate: number;
  locale: B1LLocale;
  plan: "local" | "europe";
}

export interface B1LData {
  version: 1;
  clients: Client[];
  projects: Project[];
  quotes: Quote[];
  leads: Lead[];
  documents: DocumentRecord[];
  team: TeamMember[];
  providers: Provider[];
  settings: CompanySettings;
}

export interface QuoteTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function quoteTotals(quote: Quote): QuoteTotals {
  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = subtotal * (quote.discountRate / 100);
  const tax = (subtotal - discount) * (quote.taxRate / 100);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}
