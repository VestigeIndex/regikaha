import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Términos para clientes",
  description: "Condiciones de uso de RegiKaha para los clientes que buscan profesionales.",
  path: "/legal/terminos-clientes",
});

export default function TerminosClientesPage() {
  return (
    <LegalArticle
      title="Términos para clientes"
      updated="13 de junio de 2026"
      intro="Estos términos regulan el uso de RegiKaha por parte de los clientes que buscan y contactan profesionales."
      sections={[
        { h: "Uso gratuito", p: ["El uso de RegiKaha como cliente es gratuito: buscar, comparar perfiles, ver portfolios, consultar precios orientativos, solicitar presupuesto y dejar valoraciones."] },
        { h: "Relación con el profesional", p: ["RegiKaha facilita el contacto, pero el acuerdo, el presupuesto y la ejecución del trabajo se establecen directamente entre el cliente y el profesional. Recomendamos comparar varios presupuestos y acordar las condiciones por escrito."] },
        { h: "Precios orientativos", p: ["Los precios mostrados son orientativos (“desde”) y no constituyen una oferta vinculante. El precio final depende de cada proyecto."] },
        { h: "Valoraciones", p: ["Como cliente puedes valorar a un profesional tras un servicio realizado. Las reseñas deben ser veraces y respetuosas. Consulta la política de reseñas."] },
        { h: "Uso responsable", p: ["El cliente se compromete a facilitar información veraz en las solicitudes de presupuesto y a no usar la plataforma con fines fraudulentos."] },
        { h: "Limitación de responsabilidad", p: ["RegiKaha no es parte del contrato de obra ni responde de su ejecución. Verificamos a los profesionales según nuestra política, pero la decisión de contratación corresponde al cliente."] },
      ]}
    />
  );
}
