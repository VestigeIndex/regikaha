import type { B1LData } from "./types";

const now = "2026-06-20T08:30:00.000Z";

// Workspace en blanco para usuarios con sesión sin datos en la nube.
// La demo (b1lSeed) solo se muestra a visitantes anónimos como escaparate.
export const b1lEmpty: B1LData = {
  version: 1,
  settings: {
    companyName: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "ES",
    currency: "EUR",
    defaultTaxRate: 21,
    locale: "es",
    plan: "local",
  },
  clients: [],
  projects: [],
  quotes: [],
  leads: [],
  documents: [],
  team: [],
  providers: [],
};

export const b1lSeed: B1LData = {
  version: 1,
  settings: {
    companyName: "Construcciones Rivera",
    taxId: "B-28471635",
    email: "oficina@rivera.example",
    phone: "+34 610 245 890",
    address: "Calle Alcalá 214",
    city: "Madrid",
    country: "ES",
    currency: "EUR",
    defaultTaxRate: 21,
    locale: "es",
    plan: "local",
  },
  clients: [
    { id: "cli-1", name: "Elena Martín", phone: "+34 612 445 220", email: "elena@example.com", address: "Calle Ibiza 31", city: "Madrid", country: "ES", preferredLanguage: "es", notes: "Prefiere contacto por WhatsApp por la tarde.", createdAt: now },
    { id: "cli-2", name: "Marc Dubois", company: "Maison Dubois", phone: "+33 6 18 27 44 90", email: "marc@example.com", address: "12 Rue des Fleurs", city: "Lyon", country: "FR", preferredLanguage: "fr", notes: "Renovación por fases.", createdAt: now },
    { id: "cli-3", name: "Sophie Keller", phone: "+49 151 234 6789", email: "sophie@example.com", address: "Schillerstraße 18", city: "Berlin", country: "DE", preferredLanguage: "de", notes: "Enviar documentación en alemán.", createdAt: now },
  ],
  projects: [
    { id: "pro-1", clientId: "cli-1", title: "Reforma integral de cocina", address: "Calle Ibiza 31", city: "Madrid", country: "ES", trade: "Renovation", status: "active", startDate: "2026-06-10", dueDate: "2026-07-18", budget: 18400, notes: "Instalaciones terminadas; pendiente mobiliario.", photos: [], createdAt: now },
    { id: "pro-2", clientId: "cli-2", title: "Aislamiento de fachada", address: "12 Rue des Fleurs", city: "Lyon", country: "FR", trade: "Insulation", status: "planning", startDate: "2026-07-07", dueDate: "2026-08-08", budget: 12600, notes: "Confirmar acceso al patio interior.", photos: [], createdAt: now },
    { id: "pro-3", clientId: "cli-3", title: "Instalación eléctrica", address: "Schillerstraße 18", city: "Berlin", country: "DE", trade: "Electricity", status: "completed", startDate: "2026-05-02", dueDate: "2026-05-24", budget: 7900, notes: "Certificado entregado.", photos: [], createdAt: now },
  ],
  quotes: [
    { id: "quo-1", number: "PRE-2026-014", clientId: "cli-1", projectId: "pro-1", status: "accepted", items: [{ id: "i-1", description: "Demolición y retirada", quantity: 1, unit: "lot", unitPrice: 1850 }, { id: "i-2", description: "Instalación eléctrica y fontanería", quantity: 1, unit: "lot", unitPrice: 4650 }, { id: "i-3", description: "Mobiliario e instalación", quantity: 1, unit: "lot", unitPrice: 8900 }], taxRate: 21, discountRate: 0, validUntil: "2026-07-15", notes: "Incluye retirada de residuos.", createdAt: now, updatedAt: now },
    { id: "quo-2", number: "PRE-2026-015", clientId: "cli-2", projectId: "pro-2", status: "sent", items: [{ id: "i-4", description: "Sistema SATE de fachada", quantity: 140, unit: "m²", unitPrice: 62 }], taxRate: 20, discountRate: 5, validUntil: "2026-07-01", notes: "Oferta sujeta a visita técnica.", createdAt: now, updatedAt: now },
  ],
  leads: [
    { id: "lea-1", name: "Ana Costa", service: "Bathroom renovation", city: "Porto", country: "PT", phone: "+351 912 432 111", email: "ana@example.com", status: "new", source: "regikaha", createdAt: now },
    { id: "lea-2", name: "James Wilson", service: "Solar panels", city: "Manchester", country: "GB", phone: "+44 7700 900321", email: "james@example.com", status: "contacted", source: "manual", createdAt: now },
    { id: "lea-3", name: "Giulia Rossi", service: "Roof repair", city: "Milano", country: "IT", phone: "+39 333 221 9070", email: "giulia@example.com", status: "quoted", source: "regikaha", createdAt: now },
  ],
  documents: [
    { id: "doc-1", type: "quote", number: "PRE-2026-014", title: "Reforma integral de cocina", clientId: "cli-1", projectId: "pro-1", status: "issued", amount: 18634, verificationCode: "RW-014-A8D2", createdAt: now },
    { id: "doc-2", type: "certificate", number: "CER-2026-003", title: "Certificado de instalación eléctrica", clientId: "cli-3", projectId: "pro-3", status: "signed", verificationCode: "RW-003-C7F1", createdAt: now },
  ],
  team: [
    { id: "team-1", name: "Álvaro Rivera", role: "Project manager", phone: "+34 610 245 890", email: "alvaro@rivera.example", active: true },
    { id: "team-2", name: "Lucía Serrano", role: "Electrician", phone: "+34 620 119 340", email: "lucia@rivera.example", active: true },
    { id: "team-3", name: "Mateo Ruiz", role: "Installer", phone: "+34 633 440 215", email: "mateo@rivera.example", active: false },
  ],
  providers: [
    { id: "sup-1", name: "ConstruMarket Centro", category: "General materials", address: "Avenida de América 44", city: "Madrid", country: "ES", phone: "+34 910 120 330", lat: 40.4382, lng: -3.6756, distanceKm: 2.4 },
    { id: "sup-2", name: "ElectroPro Madrid", category: "Electrical", address: "Calle Méndez Álvaro 62", city: "Madrid", country: "ES", phone: "+34 914 770 114", lat: 40.3951, lng: -3.6785, distanceKm: 4.8 },
    { id: "sup-3", name: "Cerámica Técnica", category: "Ceramics", address: "Calle Alcalá 498", city: "Madrid", country: "ES", phone: "+34 913 155 840", lat: 40.4487, lng: -3.6171, distanceKm: 7.1 },
  ],
};
