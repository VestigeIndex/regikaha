import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de pre-presupuestos",
  description: "Condiciones de las estimaciones iniciales no vinculantes enviadas en Regi Kaha.",
  path: "/legal/politica-prepresupuestos",
});

export default function PoliticaPrepresupuestosPage() {
  return (
    <LegalArticle
      title="Política de pre-presupuestos"
      updated="16 de junio de 2026"
      intro="Esta política explica cómo funcionan las estimaciones iniciales no vinculantes dentro de Regi Kaha."
      sections={[
        { h: "Naturaleza no vinculante", p: ["Los pre-presupuestos son estimaciones iniciales no vinculantes basadas en la información enviada por el cliente. El presupuesto definitivo puede variar tras visita técnica, mediciones, materiales, permisos, urgencia, desplazamiento o revisión del estado real del trabajo."] },
        { h: "No ejecución por Regi Kaha", p: ["Regi Kaha actúa como plataforma de conexión entre clientes y profesionales. Los trabajos son realizados por profesionales o empresas independientes. Regi Kaha no ejecuta directamente reformas, reparaciones ni instalaciones."] },
        { h: "Presupuesto definitivo", p: ["El acuerdo definitivo, el precio final, la garantía, la visita técnica y la ejecución corresponden al cliente y al profesional o empresa contratada."] },
        { h: "Información mínima", p: ["El profesional debe indicar alcance estimado, partidas principales, necesidad de visita técnica, inclusión o no de materiales y condiciones que pueden modificar el precio final."] },
        { h: "Comparación", p: ["El cliente puede comparar estimaciones iniciales por rango de precio, experiencia, nivel de verificación, zona, reseñas, disponibilidad y próximo paso recomendado."] },
      ]}
    />
  );
}
