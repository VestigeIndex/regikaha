import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Términos para empresas",
  description: "Condiciones de uso de Regi Kaha para constructoras, empresas de reformas y organizaciones que publican necesidades B2B.",
  path: "/legal/terminos-empresas",
});

export default function CompanyTermsPage() {
  return (
    <LegalArticle
      title="Términos para empresas"
      updated="18 de junio de 2026"
      intro="Estas condiciones regulan el uso de Regi Kaha por empresas que buscan profesionales, equipos o subcontratas en los mercados activos de la plataforma."
      sections={[
        { h: "Uso de la plataforma", p: ["Regi Kaha facilita publicación de necesidades, búsqueda de perfiles y gestión inicial de contactos. Regi Kaha no ejecuta obras ni actúa como constructora, contratista principal o dirección facultativa."] },
        { h: "Responsabilidad de la empresa", p: ["La empresa es responsable de la veracidad de sus solicitudes, documentación requerida, presupuesto, calendario, licencias y cumplimiento laboral, fiscal, preventivo y contractual aplicable."] },
        { h: "Oportunidades B2B", p: ["Publicar una necesidad no garantiza recibir candidatos, presupuestos, disponibilidad, ingresos ni contratación. Regi Kaha puede ordenar resultados por mérito, zona, actividad, respuesta, documentación y calidad de información."] },
        { h: "Conductas no permitidas", p: ["No se permite usar Regi Kaha para spam, captación engañosa, elusión de obligaciones legales, suplantación, discriminación, manipulación de reseñas o explotación de datos fuera del contexto de la solicitud."] },
        { h: "Planes y suscripción", p: ["Cuando una empresa ofrece servicios o busca operar como cuenta profesional, la suscripción puede ser obligatoria para mantener acceso comercial activo. La cancelación o impago puede limitar visibilidad y oportunidades sin borrar datos históricos."] },
      ]}
    />
  );
}
