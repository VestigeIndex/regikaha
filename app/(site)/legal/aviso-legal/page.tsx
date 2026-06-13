import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Aviso legal",
  description: "Aviso legal y condiciones generales de uso del sitio web de RegiKaha.",
  path: "/legal/aviso-legal",
});

export default function AvisoLegalPage() {
  return (
    <LegalArticle
      title="Aviso legal"
      updated="13 de junio de 2026"
      intro={`El presente aviso legal regula el uso del sitio web ${site.url} (en adelante, “el Sitio”), titularidad de ${site.legalName}.`}
      sections={[
        { h: "Titular del sitio", p: [`Titular: ${site.legalName}. Correo de contacto: ${site.email}. Los datos de identificación fiscal y domicilio se completarán antes de la publicación definitiva.`] },
        { h: "Objeto", p: ["RegiKaha es un marketplace que conecta a clientes con profesionales verificados de reformas, construcción, instalaciones, mantenimiento, arquitectura e ingeniería. RegiKaha no presta directamente los servicios de obra; actúa como intermediario tecnológico entre clientes y profesionales."] },
        { h: "Condiciones de uso", p: ["El acceso al Sitio es gratuito para los clientes. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o que dañen los derechos de terceros."] },
        { h: "Responsabilidad", p: ["RegiKaha no se hace responsable de la ejecución de los trabajos contratados entre cliente y profesional, que se rigen por el acuerdo entre ambas partes. RegiKaha verifica la información de los profesionales en la medida descrita en su política de verificación, pero no garantiza resultados concretos."] },
        { h: "Propiedad intelectual", p: ["Los contenidos, marca, logotipo y diseño del Sitio son titularidad de RegiKaha o de sus legítimos propietarios. Queda prohibida su reproducción sin autorización."] },
        { h: "Legislación aplicable", p: ["Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios."] },
      ]}
    />
  );
}
