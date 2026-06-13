import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de cookies",
  description: "Información sobre el uso de cookies en el sitio web de RegiNova.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <LegalArticle
      title="Política de cookies"
      updated="13 de junio de 2026"
      intro="Esta política explica qué cookies utiliza RegiNova y cómo puedes gestionarlas."
      sections={[
        { h: "Qué son las cookies", p: ["Las cookies son pequeños archivos que se almacenan en tu dispositivo al navegar. Permiten recordar tus preferencias y obtener información estadística sobre el uso del Sitio."] },
        { h: "Cookies que utilizamos", p: ["Técnicas y necesarias: imprescindibles para el funcionamiento del Sitio.", "De preferencias: recuerdan opciones como filtros de búsqueda.", "Analíticas: nos ayudan a entender el uso del Sitio de forma agregada. En la fase inicial, RegiNova minimiza el uso de cookies no esenciales."] },
        { h: "Gestión de cookies", p: ["Puedes configurar o rechazar las cookies desde el banner de consentimiento y desde la configuración de tu navegador. El bloqueo de algunas cookies puede afectar al funcionamiento del Sitio."] },
        { h: "Actualizaciones", p: ["Podemos actualizar esta política para reflejar cambios en las cookies utilizadas. Te recomendamos revisarla periódicamente."] },
      ]}
    />
  );
}
