import { legalVersions } from "./contractVersions";

export type SubscriptionContractSnapshotInput = {
  userId: string;
  role: string;
  planId: string;
  priceToday: number;
  futurePrice: number;
  currency: "EUR";
  trialStartsAt?: string;
  trialEndsAt?: string;
  firstChargeAt?: string;
  renewalInterval: "monthly" | "yearly";
  founderTrial?: boolean;
};

export function buildSubscriptionContractSnapshot(input: SubscriptionContractSnapshotInput) {
  return {
    versions: legalVersions,
    acceptedAtTemplate: new Date().toISOString(),
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
    },
    clauses: [
      "RegiKaha no ejecuta obras ni garantiza solicitudes, clientes, ingresos o presupuestos.",
      "La suscripción no compra posiciones ni mejora artificialmente el ranking.",
      "Sin suscripción activa, RegiKaha puede limitar el acceso comercial sin borrar datos históricos del perfil.",
      "El profesional, empresa o subcontrata es responsable de licencias, seguros, facturación, presupuestos y ejecución del servicio.",
    ],
  };
}
