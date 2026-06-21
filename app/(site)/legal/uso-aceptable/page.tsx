import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de uso aceptable",
  description: "Normas de uso aceptable de Regi Kaha para clientes, profesionales, empresas y subcontratas.",
  path: "/legal/uso-aceptable",
});

export default function AcceptableUsePage() {
  return (
    <LegalArticle
      title="Política de uso aceptable"
      updated="18 de junio de 2026"
      intro="Regi Kaha debe ser un entorno fiable para comparar, contactar y gestionar oportunidades reales. Esta política define usos permitidos y prohibidos."
      sections={[
        { h: "Información veraz", p: ["No se permite publicar perfiles, proyectos, precios, reseñas, documentos, identidades, ubicaciones o disponibilidad falsos, engañosos o imposibles de verificar."] },
        { h: "Contacto legítimo", p: ["Los datos de contacto solo pueden usarse para la solicitud u oportunidad correspondiente. Queda prohibido el scraping, spam, reventa de datos o contacto masivo ajeno al servicio."] },
        { h: "Reseñas y ranking", p: ["No se permite comprar, manipular, coaccionar o inventar reseñas. La suscripción no compra posiciones y Regi Kaha puede investigar patrones anómalos."] },
        { h: "Contenido prohibido", p: ["No se permite contenido ilegal, discriminatorio, difamatorio, violento, sexual explícito, invasivo de privacidad, malware, phishing o infracción de propiedad intelectual."] },
        { h: "Medidas", p: ["Regi Kaha puede limitar, suspender, retirar contenido o solicitar verificación adicional cuando detecte incumplimientos, riesgo para usuarios o señales de fraude."] },
      ]}
    />
  );
}
