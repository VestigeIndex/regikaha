import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";
import { formatIntervalPrice, professionalPlans } from "@/lib/pricing";

export const metadata: Metadata = buildMetadata({
  title: "Términos para profesionales",
  description: "Condiciones de uso, suscripción y ranking justo de RegiKaha para profesionales.",
  path: "/legal/terminos-profesionales",
});

export default function TerminosProfesionalesPage() {
  return (
    <LegalArticle
      title="Términos para profesionales"
      updated="13 de junio de 2026"
      intro="Estos términos regulan el alta, la suscripción y el uso de RegiKaha por parte de los profesionales."
      sections={[
        { h: "Alta y verificación", p: ["Para publicar un perfil, el profesional debe completar el proceso de verificación y aportar información veraz. RegiKaha puede solicitar documentación adicional y suspender perfiles con datos falsos."] },
        { h: "Suscripción y precios", p: [`El servicio para profesionales tiene dos cuotas base: ${professionalPlans[0].name}, desde ${formatIntervalPrice(professionalPlans[0], "monthly")} o ${formatIntervalPrice(professionalPlans[0], "yearly")}; y ${professionalPlans[1].name}, desde ${formatIntervalPrice(professionalPlans[1], "monthly")} o ${formatIntervalPrice(professionalPlans[1], "yearly")}. Las tarifas anuales aplican un 10% de descuento. Los primeros 300 profesionales verificados disfrutan de 5 meses gratis. No existe permanencia.`] },
        { h: "Ranking justo", p: ["El orden de aparición se calcula exclusivamente por mérito (valoración, experiencia, proyectos, rapidez de respuesta y verificación). RegiKaha no vende posiciones ni cobra por aparecer primero, por lead o por mensaje."] },
        { h: "Pre-presupuestos", p: ["Las respuestas económicas enviadas desde RegiKaha son pre-presupuestos o estimaciones iniciales no vinculantes, salvo que el profesional y el cliente acuerden expresamente otra cosa fuera de la plataforma. Deben indicar alcance, condiciones, necesidad de visita técnica y factores que pueden modificar el precio final."] },
        { h: "Obligaciones del profesional", p: ["Prestar los servicios con diligencia, cumplir la normativa aplicable a su actividad, mantener actualizada su información y responder a las solicitudes de los clientes con respeto. No se deben prometer precios cerrados sin revisión técnica cuando el trabajo requiera mediciones, permisos, materiales o inspección previa."] },
        { h: "Valoraciones", p: ["El profesional puede responder a las reseñas. No está permitido comprar reseñas, presionar a clientes ni manipular las valoraciones. RegiKaha no elimina reseñas legítimas a cambio de pago."] },
        { h: "Suspensión", p: ["RegiKaha podrá limitar o suspender perfiles que incumplan estos términos, falseen información o perjudiquen la confianza del marketplace."] },
        { h: "Cancelación", p: ["El profesional puede cancelar su suscripción en cualquier momento. El acceso se mantiene hasta el final del periodo abonado."] },
      ]}
    />
  );
}
