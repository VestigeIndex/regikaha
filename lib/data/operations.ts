import type { QuoteRequest, VerificationRequest, Subscription } from "@/lib/types";

/** Solicitudes de presupuesto (alimentan el panel del profesional). */
export const quoteRequests: QuoteRequest[] = [
  {
    id: "qr-100",
    clientName: "Elena Ruiz",
    clientEmail: "elena***@gmail.com",
    clientPhone: "+34 6** ** ** **",
    categoryId: "banos-cocinas",
    serviceId: "svc-1",
    professionalId: "pro-reformas-costa",
    location: "Valencia",
    description:
      "Quiero reformar el baño principal, unos 6 m². Cambiar bañera por ducha y renovar azulejos y sanitarios.",
    budgetRange: "3.000 € – 5.000 €",
    urgency: "this_month",
    status: "new",
    createdAt: "2026-06-11",
  },
  {
    id: "qr-101",
    clientName: "Marcos Díaz",
    clientEmail: "marcos***@hotmail.com",
    clientPhone: "+34 6** ** ** **",
    categoryId: "reformas-integrales",
    serviceId: "svc-3",
    professionalId: "pro-reformas-costa",
    location: "Torrent",
    description: "Reforma integral de un piso de 80 m² que acabamos de comprar. Sin prisa, buscando calidad.",
    budgetRange: "15.000 € – 25.000 €",
    urgency: "flexible",
    status: "contacted",
    createdAt: "2026-06-07",
  },
  {
    id: "qr-102",
    clientName: "Sofía Marín",
    clientEmail: "sofia***@gmail.com",
    clientPhone: "+34 6** ** ** **",
    categoryId: "banos-cocinas",
    serviceId: "svc-2",
    professionalId: "pro-reformas-costa",
    location: "Valencia",
    description: "Cocina de 10 m², quiero abrirla al salón. ¿Es posible y cuánto costaría aproximadamente?",
    budgetRange: "5.000 € – 8.000 €",
    urgency: "this_month",
    status: "quoted",
    createdAt: "2026-06-02",
  },
  {
    id: "qr-103",
    clientName: "Javier Ortiz",
    clientEmail: "javier***@gmail.com",
    clientPhone: "+34 6** ** ** **",
    categoryId: "electricidad",
    serviceId: "svc-4",
    professionalId: "pro-electrobarna",
    location: "Barcelona",
    description: "Necesito renovar el cuadro eléctrico y poner el boletín para dar de alta la luz.",
    budgetRange: "1.000 € – 1.500 €",
    urgency: "urgent",
    status: "won",
    createdAt: "2026-05-28",
  },
];

export function getQuotesByProfessional(professionalId: string): QuoteRequest[] {
  return quoteRequests
    .filter((q) => q.professionalId === professionalId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

/** Solicitudes de verificación pendientes (alimentan el panel de admin). */
export const verificationRequests: VerificationRequest[] = [
  {
    id: "ver-1",
    professionalId: "pro-reformas-express",
    professionalName: "Reformas Express 24h",
    submittedAt: "2026-06-08",
    status: "pending",
    checks: { identity: true, nifCif: true, email: true, phone: false, insurance: false, portfolio: false },
    notes: "Falta verificar teléfono y aportar seguro de responsabilidad civil.",
  },
  {
    id: "ver-2",
    professionalId: "pro-obrafacil",
    professionalName: "ObraFácil",
    submittedAt: "2026-05-22",
    status: "limited",
    checks: { identity: true, nifCif: true, email: true, phone: true, insurance: false, portfolio: false },
    notes: "Verificación limitada: sin seguro ni facturación declarados. Visibilidad reducida.",
  },
];

/** Suscripciones activas (alimentan el panel de admin y facturación). */
export const subscriptions: Subscription[] = [
  {
    id: "sub-1",
    professionalId: "pro-reformas-costa",
    plan: "founder",
    status: "trial",
    priceEur: 0,
    startedAt: "2026-02-10",
    renewsAt: "2026-07-10",
  },
  {
    id: "sub-2",
    professionalId: "pro-reformas-atlantico",
    plan: "autonomo_yearly",
    status: "active",
    priceEur: 215.46,
    startedAt: "2026-03-02",
    renewsAt: "2027-03-02",
  },
  {
    id: "sub-3",
    professionalId: "pro-electrobarna",
    plan: "founder",
    status: "trial",
    priceEur: 0,
    startedAt: "2026-02-18",
    renewsAt: "2026-07-18",
  },
  {
    id: "sub-4",
    professionalId: "pro-climatic-madrid",
    plan: "europa_monthly",
    status: "active",
    priceEur: 49.95,
    startedAt: "2026-03-20",
    renewsAt: "2026-06-20",
  },
];

export function getSubscriptionByProfessional(professionalId: string): Subscription | undefined {
  return subscriptions.find((s) => s.professionalId === professionalId);
}
