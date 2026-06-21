import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Términos para subcontratas",
  description: "Condiciones de uso de Regi Kaha para subcontratas, equipos técnicos e instaladores que buscan oportunidades B2B.",
  path: "/legal/terminos-subcontratas",
});

export default function SubcontractorTermsPage() {
  return (
    <LegalArticle
      title="Términos para subcontratas"
      updated="18 de junio de 2026"
      intro="Estas condiciones aplican a subcontratas, instaladores, equipos técnicos y empresas que ofrecen capacidad operativa a través de Regi Kaha."
      sections={[
        { h: "Perfil y disponibilidad", p: ["La subcontrata debe mantener información actualizada sobre especialidades, zonas, equipo, disponibilidad, documentación, seguros y capacidad real de servicio."] },
        { h: "Responsabilidad profesional", p: ["Cada subcontrata es responsable de sus licencias, seguros, facturación, personal, prevención de riesgos, presupuestos, ejecución y relación contractual con la empresa contratante."] },
        { h: "Acceso comercial", p: ["Para recibir oportunidades o aparecer como cuenta activa puede exigirse una suscripción vigente, aceptación de contrato digital y cumplimiento de políticas de verificación, reseñas y uso aceptable."] },
        { h: "Limitación por impago o cancelación", p: ["Si la suscripción vence, se cancela o queda impagada, Regi Kaha puede limitar la visibilidad y recepción de oportunidades sin eliminar el perfil, portfolio, documentación o reseñas existentes."] },
        { h: "No garantía de contratación", p: ["Regi Kaha no garantiza un número mínimo de solicitudes, clientes, ingresos, presupuestos ni contratos B2B. El ranking no se compra y la suscripción no mejora artificialmente posiciones."] },
      ]}
    />
  );
}
