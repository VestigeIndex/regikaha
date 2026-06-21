import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de suscripción",
  description: "Planes, renovación, cancelación, fundadores 0 €, impago y acceso profesional en Regi Kaha.",
  path: "/legal/politica-suscripcion",
});

export default function SubscriptionPolicyPage() {
  return (
    <LegalArticle
      title="Política de suscripción"
      updated="18 de junio de 2026"
      intro="La suscripción es una capa comercial y contractual para cuentas que ofrecen servicios. No sustituye toda la verificación técnica ni compra ranking."
      sections={[
        { h: "Planes y acceso", p: ["La suscripción permite acceder a herramientas profesionales, visibilidad legítima y gestión de oportunidades. Si la suscripción no está activa, Regi Kaha puede limitar o suspender el acceso profesional."] },
        { h: "Fundadores 0 €", p: ["Los primeros 300 fundadores pueden disfrutar de un periodo promocional de 0 €, sujeto a condiciones, disponibilidad y aceptación del contrato de suscripción. Al terminar el periodo gratuito deberán mantener un plan activo para conservar acceso comercial."] },
        { h: "Renovación y cancelación", p: ["Antes de confirmar una suscripción se debe mostrar precio actual, precio futuro, intervalo, fecha de primer cobro, cancelación y consecuencias de impago. La cancelación evita renovaciones futuras según la configuración de Stripe y la ley aplicable."] },
        { h: "Impago o vencimiento", p: ["Si la suscripción pasa a pago pendiente, impagada, cancelada o vencida, Regi Kaha puede limitar visibilidad, solicitudes, contacto comercial y oportunidades B2B sin borrar perfil, portfolio ni reseñas."] },
        { h: "Sin garantías de resultado", p: ["Regi Kaha no garantiza un número mínimo de solicitudes, clientes, ingresos o presupuestos. El pago de una suscripción no mejora artificialmente el ranking. La suscripción no compra posiciones."] },
        { h: "Responsabilidad del profesional", p: ["El profesional, empresa o subcontrata es responsable de sus servicios, licencias, seguros, facturación, presupuestos, documentación y ejecución. Regi Kaha no ejecuta obras ni responde por contratos entre usuarios."] },
      ]}
    />
  );
}
