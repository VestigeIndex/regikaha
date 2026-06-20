import {
  CONTRACT_CHECKBOX_KEYS,
  type ContractCheckboxKey,
} from "../billing/subscription";

export const subscriptionContractTabs = [
  "summary",
  "price",
  "use",
  "verification",
  "ranking",
  "cancellation",
  "suspension",
  "privacy",
  "full",
] as const;

export type SubscriptionContractTab = (typeof subscriptionContractTabs)[number];

export const subscriptionContractTabLabels: Record<SubscriptionContractTab, string> = {
  summary: "Resumen",
  price: "Precio y renovación",
  use: "Uso permitido",
  verification: "Verificación",
  ranking: "Ranking y reseñas",
  cancellation: "Cancelación",
  suspension: "Suspensión",
  privacy: "Privacidad y documentos",
  full: "Contrato completo",
};

export const subscriptionContractSections: Record<
  SubscriptionContractTab,
  { title: string; paragraphs: string[] }
> = {
  summary: {
    title: "Lo esencial antes de aceptar",
    paragraphs: [
      "La suscripción habilita herramientas profesionales, visibilidad legítima y gestión de oportunidades. RegiKaha no ejecuta obras ni garantiza clientes o ingresos.",
      "El precio futuro, la fecha de primer cobro, la renovación y la consecuencia de impago se muestran en el resumen fijo.",
    ],
  },
  price: {
    title: "Precio, impuestos y renovación",
    paragraphs: [
      "El importe indicado no incluye IVA/VAT cuando corresponda. La renovación utiliza el intervalo seleccionado y el precio mostrado al aceptar.",
      "Si eres fundador, hoy pagas 0 €. Stripe crea una suscripción real y recoge método de pago para el cobro futuro salvo que la configuración aplicable indique lo contrario.",
    ],
  },
  use: {
    title: "Uso profesional permitido",
    paragraphs: [
      "Puedes completar perfil, publicar servicios, portfolio y zonas; con suscripción activa puedes recibir solicitudes y responder oportunidades.",
      "No se permite spam, suplantación, documentos falsos, captación engañosa, reventa de datos ni manipulación de reseñas.",
    ],
  },
  verification: {
    title: "Suscripción y verificación",
    paragraphs: [
      "Pagar no equivale a identidad verificada. RegiKaha separa suscripción activa, identidad, empresa y documentación verificadas.",
      "Debes mantener información veraz, licencias, seguros y registros aplicables a tu actividad y país.",
    ],
  },
  ranking: {
    title: "Ranking justo y reseñas",
    paragraphs: [
      "La suscripción no compra posiciones. El orden se basa en relevancia, zona, calidad del perfil, respuesta, experiencia y reputación legítima.",
      "Está prohibido comprar, inventar, coaccionar o manipular reseñas.",
    ],
  },
  cancellation: {
    title: "Cancelación y renovación",
    paragraphs: [
      "Puedes gestionar o cancelar desde el portal de facturación. La cancelación evita renovaciones futuras según el momento y condiciones comunicadas.",
      "La cancelación no borra perfil, portfolio o reseñas, pero puede limitar el acceso comercial al terminar el periodo activo.",
    ],
  },
  suspension: {
    title: "Impago y suspensión comercial",
    paragraphs: [
      "Los estados past_due, unpaid, cancelled o expired limitan nuevas solicitudes, contacto comercial y oportunidades B2B.",
      "El usuario conserva acceso al panel para actualizar datos, consultar condiciones y reactivar el plan.",
    ],
  },
  privacy: {
    title: "Privacidad, documentos y prueba",
    paragraphs: [
      "RegiKaha guarda versiones legales, precios, fechas, checkboxes, hash del contrato y huellas técnicas hasheadas para acreditar la aceptación.",
      "Los documentos se usan para verificación y no deben publicarse como información abierta.",
    ],
  },
  full: {
    title: "Contrato completo de suscripción",
    paragraphs: [
      "Este contrato incorpora los Términos Profesionales, Política de Verificación, Política de Reseñas, ranking justo, Política de Suscripción y Privacidad vigentes en la versión indicada.",
      "El profesional responde de presupuestos, facturación, licencias, seguros, personal, prevención y ejecución. RegiKaha actúa como plataforma tecnológica de intermediación.",
      "RegiKaha no garantiza un número mínimo de solicitudes, clientes, ingresos o presupuestos. El pago no mejora artificialmente el ranking.",
    ],
  },
};

export const subscriptionContractCheckboxLabels: Record<ContractCheckboxKey, string> = {
  professionalTerms: "Acepto los Términos Profesionales",
  verificationPolicy: "Acepto la Política de Verificación",
  reviewsPolicy: "Acepto la Política de Reseñas",
  fairRankingPolicy: "Acepto la Política de Ranking Justo",
  renewalCancellationPolicy: "Acepto la política de suscripción, renovación y cancelación",
  futurePaymentUnderstood: "Entiendo el precio futuro y que hoy pago 0 € solo si mi plaza fundador está disponible",
  accessLimitationUnderstood: "Entiendo que sin suscripción activa perderé visibilidad y nuevas solicitudes",
  truthfulInformation: "Declaro que la información aportada es veraz",
  professionalResponsibility: "Declaro que soy responsable de licencias, seguros, facturación, presupuestos y ejecución",
};

if (CONTRACT_CHECKBOX_KEYS.some((key) => !subscriptionContractCheckboxLabels[key])) {
  throw new Error("Subscription contract checkbox copy is incomplete");
}
