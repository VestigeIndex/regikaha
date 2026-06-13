import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de verificación",
  description: "Qué comprueba RegiKaha antes de mostrar el sello de profesional verificado y qué significan los estados de verificación.",
  path: "/legal/politica-verificacion",
});

export default function PoliticaVerificacionPage() {
  return (
    <LegalArticle
      title="Política de verificación"
      updated="13 de junio de 2026"
      intro="La verificación es lo que distingue a RegiKaha. Esta política explica qué comprobamos y qué significan los estados de verificación."
      sections={[
        { h: "Qué comprobamos", p: ["Identidad del responsable, NIF/CIF, email y teléfono. Cuando aplica: colegiación profesional, seguros de responsabilidad civil y certificados declarados, así como la autenticidad del portfolio."] },
        { h: "Estados de verificación", p: ["Pendiente: solicitud en revisión, no visible públicamente. Verificado: comprobaciones superadas, con insignia visible. Limitado: identidad confirmada pero faltan elementos (p. ej. seguro), con menor prioridad. Suspendido: perfil retirado por incumplimiento."] },
        { h: "Qué NO garantiza la verificación", p: ["La verificación confirma la identidad y la información declarada del profesional, pero no constituye una garantía absoluta de resultado. El cliente debe valorar presupuestos y referencias antes de contratar."] },
        { h: "Mantenimiento", p: ["La verificación puede revisarse periódicamente. El profesional debe mantener su información actualizada y comunicar cambios relevantes (cese de seguro, cambios fiscales, etc.)."] },
        { h: "Aceptación de normas", p: ["Para verificarse, el profesional acepta las normas del marketplace, incluida la política de reseñas y el ranking justo sin pago por posición."] },
      ]}
    />
  );
}
