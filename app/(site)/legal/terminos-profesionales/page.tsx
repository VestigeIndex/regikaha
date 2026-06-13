import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Términos para profesionales",
  description: "Condiciones de uso, suscripción y ranking justo de RegiNova para profesionales.",
  path: "/legal/terminos-profesionales",
});

export default function TerminosProfesionalesPage() {
  return (
    <LegalArticle
      title="Términos para profesionales"
      updated="13 de junio de 2026"
      intro="Estos términos regulan el alta, la suscripción y el uso de RegiNova por parte de los profesionales."
      sections={[
        { h: "Alta y verificación", p: ["Para publicar un perfil, el profesional debe completar el proceso de verificación y aportar información veraz. RegiNova puede solicitar documentación adicional y suspender perfiles con datos falsos."] },
        { h: "Suscripción y precios", p: ["El servicio para profesionales tiene una cuota fija de 49,95 €/mes + IVA o 499 €/año + IVA. Los primeros 300 profesionales verificados disfrutan de 5 meses gratis de RegiNova Pro. No existe permanencia."] },
        { h: "Ranking justo", p: ["El orden de aparición se calcula exclusivamente por mérito (valoración, experiencia, proyectos, rapidez de respuesta y verificación). RegiNova no vende posiciones ni cobra por aparecer primero, por lead o por mensaje."] },
        { h: "Obligaciones del profesional", p: ["Prestar los servicios con diligencia, cumplir la normativa aplicable a su actividad, mantener actualizada su información y responder a las solicitudes de los clientes con respeto."] },
        { h: "Valoraciones", p: ["El profesional puede responder a las reseñas. No está permitido comprar reseñas, presionar a clientes ni manipular las valoraciones. RegiNova no elimina reseñas legítimas a cambio de pago."] },
        { h: "Suspensión", p: ["RegiNova podrá limitar o suspender perfiles que incumplan estos términos, falseen información o perjudiquen la confianza del marketplace."] },
        { h: "Cancelación", p: ["El profesional puede cancelar su suscripción en cualquier momento. El acceso se mantiene hasta el final del periodo abonado."] },
      ]}
    />
  );
}
