import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de reseñas",
  description: "Cómo funcionan las valoraciones verificadas en RegiKaha. No se compran ni se borran las reseñas legítimas.",
  path: "/legal/politica-resenas",
});

export default function PoliticaResenasPage() {
  return (
    <LegalArticle
      title="Política de reseñas"
      updated="13 de junio de 2026"
      intro="Las valoraciones son uno de los pilares de confianza de RegiKaha. Esta política explica cómo las gestionamos para que sean justas y verificadas."
      sections={[
        { h: "Quién puede valorar", p: ["Solo pueden valorar usuarios reales que hayan tenido un servicio o contacto con el profesional. Marcamos estas reseñas como verificadas."] },
        { h: "Respuesta del profesional", p: ["El profesional tiene derecho a responder públicamente a cualquier reseña de forma respetuosa, aportando su versión."] },
        { h: "Moderación", p: ["Moderamos las reseñas para evitar insultos, datos personales, contenido fraudulento, spam o publicidad. Una reseña puede rechazarse si incumple estas normas, nunca por el simple hecho de ser negativa."] },
        { h: "Lo que no permitimos", p: ["No se pueden comprar reseñas, ni incentivarlas a cambio de descuentos, ni publicar valoraciones falsas. No se pueden eliminar reseñas legítimas a cambio de pago."] },
        { h: "Peso en el ranking", p: ["Las reseñas verificadas tienen más peso en el cálculo del orden por mérito. Ningún pago altera la puntuación de un profesional."] },
        { h: "Reclamaciones", p: ["Si un profesional considera que una reseña es fraudulenta o difamatoria, puede solicitar su revisión aportando pruebas. El equipo de RegiKaha valorará cada caso."] },
      ]}
    />
  );
}
