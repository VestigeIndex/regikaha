import type { Metadata } from "next";
import { Sparkles, Check } from "lucide-react";
import { RegistroForm } from "@/components/marketplace/RegistroForm";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Únete como profesional",
  description:
    "Crea tu perfil profesional en Regi Kaha, publica servicios y recibe oportunidades compatibles. Primeros 300 verificados: 5 meses gratis y saldo promocional de contactos.",
  path: "/registro",
  noindex: true,
});

const benefits = [
  "Página profesional con SEO propio",
  "Portfolio y servicios ilimitados",
  "Solicitudes de clientes directas",
  "Oportunidades con precio de contacto transparente",
];

export default function RegistroPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-brand text-white">
        <div className="absolute inset-0 bg-grid-soft bg-grid opacity-10" />
        <div className="container-x relative py-14 lg:py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
            <Sparkles size={14} /> Oferta fundadores · {site.founderFreeMonths} meses gratis
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-balance max-w-2xl mx-auto">
            Consigue clientes para tus servicios técnicos
          </h1>
          <p className="mt-4 text-white/85 leading-relaxed max-w-xl mx-auto">
            Crea tu perfil, publica tus servicios y recibe solicitudes de clientes que buscan
            exactamente lo que ofreces.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {benefits.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 text-sm text-white/90">
                <Check size={15} className="text-mint" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <RegistroForm />
      </section>
    </>
  );
}
