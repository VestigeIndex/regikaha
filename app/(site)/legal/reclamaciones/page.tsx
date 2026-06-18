import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reclamaciones",
  description: "Canal de reclamaciones y revisión de decisiones de RegiKaha.",
  path: "/legal/reclamaciones",
});

export default function ComplaintsPage() {
  return (
    <LegalArticle
      title="Reclamaciones"
      updated="18 de junio de 2026"
      intro="Esta página explica cómo solicitar revisión de decisiones de moderación, verificación, reseñas, acceso comercial o facturación en RegiKaha."
      sections={[
        { h: "Cómo reclamar", p: ["Puedes contactar con RegiKaha desde el correo publicado indicando tu cuenta, país, motivo, pruebas disponibles y la decisión que quieres revisar."] },
        { h: "Alcance", p: ["Revisamos decisiones sobre retirada de contenido, suspensión, limitación de perfil, reseñas, verificación documental, estados de suscripción y errores técnicos de facturación."] },
        { h: "Información necesaria", p: ["Para acelerar la revisión incluye identificador de perfil o proyecto, capturas relevantes, fecha del incidente y cualquier documento que acredite tu posición."] },
        { h: "Resultado", p: ["RegiKaha puede mantener, modificar o revertir una decisión. Si existe riesgo de fraude, seguridad o incumplimiento legal, el acceso puede seguir limitado durante la revisión."] },
        { h: "Independencia contractual", p: ["Las reclamaciones sobre ejecución de obras, calidad del servicio o cobros entre cliente y profesional deben resolverse entre las partes contratantes, sin perjuicio de las medidas de plataforma que RegiKaha pueda adoptar."] },
      ]}
    />
  );
}
