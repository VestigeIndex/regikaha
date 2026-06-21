import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Términos para clientes",
  description: "Condiciones de uso de Regi Kaha para los clientes que buscan profesionales.",
  path: "/legal/terminos-clientes",
});

export default function TerminosClientesPage() {
  return (
    <LegalArticle
      title="Términos para clientes"
      updated="13 de junio de 2026"
      intro="Estos términos regulan el uso de Regi Kaha por parte de los clientes que buscan y contactan profesionales."
      sections={[
        { h: "Uso gratuito", p: ["El uso de Regi Kaha como cliente es gratuito: buscar, comparar perfiles, ver portfolios, consultar precios orientativos, publicar proyectos, pedir pre-presupuestos y dejar valoraciones verificadas."] },
        { h: "Relación con el profesional", p: ["Regi Kaha actúa como plataforma de conexión entre clientes y profesionales. Los trabajos son realizados por profesionales o empresas independientes. Regi Kaha no ejecuta directamente reformas, reparaciones ni instalaciones."] },
        { h: "Pre-presupuestos no vinculantes", p: ["Los pre-presupuestos enviados a través de Regi Kaha son estimaciones iniciales no vinculantes. El precio final puede variar según visita técnica, mediciones, materiales, permisos, disponibilidad, urgencia y condiciones reales del trabajo.", "Regi Kaha no garantiza la aceptación de una propuesta ni la ejecución final del trabajo. El acuerdo definitivo, el precio final, la garantía, la visita técnica y la ejecución corresponden al cliente y al profesional o empresa contratada."] },
        { h: "Valoraciones", p: ["Como cliente puedes valorar a un profesional tras un servicio realizado. Las reseñas deben ser veraces y respetuosas. Consulta la política de reseñas."] },
        { h: "Uso responsable", p: ["El cliente se compromete a facilitar información veraz en las solicitudes de pre-presupuesto y a no usar la plataforma con fines fraudulentos."] },
        { h: "Limitación de responsabilidad", p: ["Regi Kaha no es parte del contrato de obra ni responde de su ejecución. Verificamos a los profesionales según nuestra política, pero la decisión de contratación corresponde al cliente."] },
      ]}
    />
  );
}
