"use client";

import { PageHeader } from "@/components/site/PageHeader";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

export function SubscriptionPageHeader() {
  const { translate } = useDirectTranslation();
  return (
    <PageHeader
      eyebrow={translate("Suscripción profesional")}
      title={translate("Activa visibilidad y herramientas profesionales")}
      description={translate("Elige un plan futuro, revisa precio y renovación, acepta el contrato y activa tu suscripción. Pagar no compra ranking ni sustituye la verificación documental.")}
      breadcrumbs={[
        { name: translate("Inicio"), path: "/" },
        { name: translate("Suscripción") },
      ]}
    />
  );
}
