import { legalVersions } from "./contractVersions";
import { isLocale } from "../i18n/config";
import { subscriptionTextDictionaries } from "../i18n/subscription";
import {
  subscriptionContractCheckboxLabels,
  subscriptionContractSections,
  subscriptionContractTabLabels,
  subscriptionContractTabs,
} from "./subscriptionContractContent";

export type SubscriptionContractSnapshotInput = {
  userId: string;
  role: string;
  planId: string;
  acceptedAt: string;
  acceptedLocale: string;
  priceToday: number;
  futurePrice: number;
  currency: "EUR";
  trialStartsAt?: string;
  trialEndsAt?: string;
  firstChargeAt?: string;
  renewalInterval: "monthly" | "yearly";
  founderTrial?: boolean;
  paymentMethodRequired: boolean;
  acceptedCheckboxes: Record<string, boolean>;
};

export function buildSubscriptionContractSnapshot(input: SubscriptionContractSnapshotInput) {
  if (!isLocale(input.acceptedLocale)) throw new Error(`Unsupported contract locale: ${input.acceptedLocale}`);
  const dictionary = subscriptionTextDictionaries[input.acceptedLocale];
  const translate = (source: string) => {
    const translated = dictionary[source];
    if (!translated) throw new Error(`Missing legal translation for "${source}" in ${input.acceptedLocale}`);
    return translated;
  };

  return {
    versions: legalVersions,
    acceptedAt: input.acceptedAt,
    acceptedLocale: input.acceptedLocale,
    commercialTerms: {
      userId: input.userId,
      role: input.role,
      planId: input.planId,
      priceToday: input.priceToday,
      futurePrice: input.futurePrice,
      currency: input.currency,
      trialStartsAt: input.trialStartsAt || null,
      trialEndsAt: input.trialEndsAt || null,
      firstChargeAt: input.firstChargeAt || null,
      renewalInterval: input.renewalInterval,
      founderTrial: !!input.founderTrial,
      paymentMethodRequired: input.paymentMethodRequired,
    },
    acceptedCheckboxes: input.acceptedCheckboxes,
    acceptedText: {
      tabs: Object.fromEntries(
        subscriptionContractTabs.map((tab) => [tab, translate(subscriptionContractTabLabels[tab])]),
      ),
      sections: Object.fromEntries(
        subscriptionContractTabs.map((tab) => [
          tab,
          {
            title: translate(subscriptionContractSections[tab].title),
            paragraphs: subscriptionContractSections[tab].paragraphs.map(translate),
          },
        ]),
      ),
      checkboxes: Object.fromEntries(
        Object.entries(subscriptionContractCheckboxLabels).map(([key, label]) => [key, translate(label)]),
      ),
    },
    policyLinks: {
      professionalTerms: "/legal/terminos-profesionales",
      verification: "/legal/politica-verificacion",
      reviews: "/legal/politica-resenas",
      ranking: "/como-funciona#ranking-justo",
      subscription: "/legal/politica-suscripcion",
      privacy: "/legal/privacidad",
    },
    clauses: [
      "RegiKaha no ejecuta obras ni garantiza solicitudes, clientes, ingresos o presupuestos.",
      "La suscripción no compra posiciones ni mejora artificialmente el ranking.",
      "Sin suscripción activa, RegiKaha puede limitar el acceso comercial sin borrar datos históricos del perfil.",
      "El profesional, empresa o subcontrata es responsable de licencias, seguros, facturación, presupuestos y ejecución del servicio.",
      "El precio futuro, la fecha de primer cobro y el intervalo de renovación forman parte del contrato aceptado.",
      "La cancelación evita renovaciones futuras conforme a la configuración comunicada, pero no borra obligaciones ya devengadas.",
    ].map(translate),
  };
}
