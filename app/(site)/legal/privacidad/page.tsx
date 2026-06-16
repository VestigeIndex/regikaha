import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Política de privacidad",
  description: "Cómo RegiKaha trata los datos personales de clientes y profesionales conforme al RGPD.",
  path: "/legal/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalArticle
      title="Política de privacidad"
      updated="13 de junio de 2026"
      intro="En RegiKaha nos tomamos en serio la protección de tus datos personales, conforme al Reglamento General de Protección de Datos (RGPD) y la normativa española aplicable."
      sections={[
        { h: "Responsable del tratamiento", p: [`${site.legalName}, con correo de contacto ${site.email}, es responsable del tratamiento de los datos recogidos a través del Sitio.`] },
        { h: "Datos que recogemos", p: ["De clientes: nombre, email, teléfono, ciudad aproximada, tipo de cliente y descripción del proyecto al solicitar pre-presupuestos.", "De profesionales: datos identificativos, fiscales, de actividad, zonas de trabajo, documentos de verificación y datos de contacto necesarios para la prestación del servicio."] },
        { h: "Finalidad", p: ["Tratamos los datos para poner en contacto a clientes y profesionales, gestionar solicitudes de pre-presupuesto, verificar profesionales, gestionar suscripciones, moderar contenidos y mejorar la cobertura del marketplace."] },
        { h: "Base jurídica", p: ["La ejecución de la relación contractual o precontractual, el consentimiento del usuario y el interés legítimo en el funcionamiento del marketplace."] },
        { h: "Conservación", p: ["Conservamos los datos mientras exista relación con el usuario y durante los plazos legales aplicables. Después se suprimen o anonimizan."] },
        { h: "Minimización y destinatarios", p: ["Antes de aceptar una propuesta, RegiKaha procura limitar la exposición de datos privados: no se muestran públicamente teléfonos, emails, documentos privados ni direcciones exactas. No vendemos tus datos a terceros."] },
        { h: "Tus derechos", p: [`Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${site.email}. También puedes reclamar ante la Agencia Española de Protección de Datos.`] },
      ]}
    />
  );
}
