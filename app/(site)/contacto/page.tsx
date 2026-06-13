import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Users, Wrench, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description:
    "¿Tienes una duda sobre RegiNova? Escríbenos. Atendemos a clientes y profesionales del marketplace de reformas y servicios técnicos.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos"
        description="Estamos para ayudarte, seas cliente o profesional. Te respondemos lo antes posible."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Contacto" }]}
      />

      <section className="container-x py-14 grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <ContactForm />

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold text-ink">Email</h2>
            <a href={`mailto:${site.email}`} className="mt-2 inline-flex items-center gap-2 text-forest-700 hover:underline">
              <Mail size={16} /> {site.email}
            </a>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-3">¿Buscas algo concreto?</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/registro" className="flex items-start gap-2.5 text-ink/80 hover:text-forest-700">
                  <Wrench size={17} className="text-forest-500 mt-0.5 shrink-0" /> Soy profesional y quiero unirme
                </Link>
              </li>
              <li>
                <Link href="/buscar" className="flex items-start gap-2.5 text-ink/80 hover:text-forest-700">
                  <Users size={17} className="text-forest-500 mt-0.5 shrink-0" /> Busco un profesional
                </Link>
              </li>
              <li>
                <Link href="/faq" className="flex items-start gap-2.5 text-ink/80 hover:text-forest-700">
                  <HelpCircle size={17} className="text-forest-500 mt-0.5 shrink-0" /> Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
