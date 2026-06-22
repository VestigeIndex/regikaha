import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo";
import { formatIntervalPrice, professionalPlans } from "@/lib/pricing";

export const metadata: Metadata = buildMetadata({
  title: "Preguntas frecuentes",
  description:
    "Resolvemos las dudas más habituales sobre Regi Kaha: cómo funciona para clientes y profesionales, precios, verificación, reseñas y ranking justo.",
  path: "/faq",
});

const clientesFaq = [
  { q: "¿Regi Kaha es gratis para los clientes?", a: "Sí. Buscar, comparar perfiles, ver portfolios, consultar precios orientativos y pedir presupuesto es totalmente gratis y sin compromiso." },
  { q: "¿Qué significa que un profesional esté “verificado”?", a: "Que hemos comprobado su identidad, NIF/CIF y actividad, además de los seguros o certificados que declare. Solo entonces mostramos la insignia de verificado." },
  { q: "¿Cómo sé que las reseñas son reales?", a: "Las valoraciones provienen de clientes con un servicio realizado y se marcan como verificadas. Ningún profesional puede comprarlas ni borrar opiniones legítimas." },
  { q: "¿Los profesionales que aparecen primero han pagado por ello?", a: "No. En Regi Kaha nadie paga por posición. El orden se calcula por mérito: valoración, experiencia, proyectos y rapidez de respuesta." },
  { q: "¿Cuánto cuesta una reforma o servicio?", a: "Cada perfil muestra precios orientativos “desde”. El precio final depende de tu proyecto: lo mejor es pedir presupuesto a varios profesionales y comparar." },
];

const proFaq = [
  { q: "¿Cuánto cuesta para profesionales?", a: `El plan Profesional Pro cuesta ${formatIntervalPrice(professionalPlans[0], "monthly")} o ${formatIntervalPrice(professionalPlans[0], "yearly")}. El plan Business · Multi-zona cuesta ${formatIntervalPrice(professionalPlans[1], "monthly")} o ${formatIntervalPrice(professionalPlans[1], "yearly")}. La tarifa anual tiene un 10% de descuento. Cada contacto muestra su precio antes de desbloquearlo y no hay comisión sobre el valor del proyecto.` },
  { q: "¿Pagáis por cada contacto o lead?", a: "El profesional mantiene una cuota de acceso y cada contacto muestra su precio antes de desbloquearse. No se venden posiciones, no se cobra por aparecer primero y no hay comisión sobre el valor final del proyecto." },
  { q: "¿Cómo consigo mejor posición?", a: "Mejorando tu trabajo real: consigue buenas valoraciones verificadas, responde rápido, completa tu portfolio y mantén tu verificación al día." },
  { q: "¿Qué necesito para verificarme?", a: "Identidad, NIF/CIF, email y teléfono. Si aplica, colegiación, seguros o certificados. Cuanta más información aportes, más confianza generas." },
  { q: "¿Hay permanencia?", a: "No. Puedes cancelar cuando quieras. Si eres miembro fundador, disfrutas de los 5 meses gratis y continúas solo si te interesa." },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema([...clientesFaq, ...proFaq])} />
      <PageHeader
        eyebrow="Preguntas frecuentes"
        title="Resolvemos tus dudas sobre Regi Kaha"
        description="Y si te queda alguna pregunta, escríbenos: estamos para ayudarte."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Preguntas frecuentes" }]}
      />

      <section className="container-x py-14 max-w-3xl">
        <h2 className="text-xl font-bold text-ink mb-5">Para clientes</h2>
        <Accordion items={clientesFaq} />

        <h2 className="text-xl font-bold text-ink mb-5 mt-12">Para profesionales</h2>
        <Accordion items={proFaq} />
      </section>

      <CtaBand
        title="¿Tienes otra pregunta?"
        primary={{ label: "Contactar", href: "/contacto" }}
        secondary={{ label: "Buscar profesionales", href: "/buscar" }}
      />
    </>
  );
}
