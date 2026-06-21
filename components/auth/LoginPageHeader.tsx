"use client";

import { PageHeader } from "@/components/site/PageHeader";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

export function LoginPageHeader() {
  const { translate } = useDirectTranslation();
  return (
    <PageHeader
      eyebrow={translate("Acceso")}
      title={translate("Iniciar sesión")}
      description={translate("Entra con tu email y contraseña. Regi Kaha recordará tu tipo de cuenta y te llevará al panel correcto.")}
      breadcrumbs={[
        { name: translate("Inicio"), path: "/" },
        { name: translate("Iniciar sesión") },
      ]}
    />
  );
}
