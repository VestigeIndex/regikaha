import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Política de contenido", description: "Normas de publicación, moderación, denuncia y retirada de contenido en Regi Kaha.", path: "/legal/politica-contenido" });

export default function ContentPolicyPage() {
  return <LegalArticle title="Política de contenido" updated="21 de junio de 2026" intro="Esta política regula perfiles, proyectos, portfolios, mensajes, reseñas y documentos publicados en Regi Kaha." sections={[
    { h: "Contenido permitido", p: ["La información debe ser veraz, relevante para una necesidad profesional y respetar la privacidad, la propiedad intelectual y la legislación aplicable."] },
    { h: "Contenido prohibido", p: ["No se permite suplantación, fraude, spam, acoso, discriminación, amenazas, malware, datos personales de terceros, trabajos inexistentes ni documentación manipulada."] },
    { h: "Moderación", p: ["Regi Kaha puede limitar la visibilidad, solicitar pruebas, retirar contenido o suspender cuentas. Las decisiones se basan en la gravedad, reincidencia, riesgo y evidencia disponible."] },
    { h: "Denuncias y revisión", p: ["Los usuarios autenticados pueden denunciar perfiles, proyectos, reseñas o mensajes. La persona afectada puede solicitar una revisión mediante el canal de reclamaciones."] },
    { h: "Conservación", p: ["El contenido retirado puede conservarse de forma restringida durante el plazo necesario para seguridad, reclamaciones, obligaciones legales y prevención de abuso."] },
  ]} />;
}
