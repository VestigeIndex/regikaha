import type { Metadata } from "next";
import { Sparkles, Check } from "lucide-react";
import { RegistroForm } from "@/components/marketplace/RegistroForm";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Únete como profesional",
  description:
    "Crea tu perfil profesional en Regi Kaha y reserva tu plaza fundadora en tu país. Los primeros 300 profesionales verificados por país: 5 meses gratis de RegiKaha Pro + acceso a RegiWorks.",
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
            <Sparkles size={14} /> 300 plazas fundadoras por país · {site.founderFreeMonths} meses gratis Pro + RegiWorks
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-balance max-w-2xl mx-auto">
            Reserva tu plaza fundadora en tu país
          </h1>
          <p className="mt-4 text-white/85 leading-relaxed max-w-xl mx-auto">
            Crea tu perfil, publica tus servicios y recibe solicitudes de clientes. Los primeros 300
            profesionales verificados por país consiguen 5 meses gratis de RegiKaha Pro + acceso a RegiWorks.
          </p>
          <p className="mt-3 text-xs text-white/70 max-w-xl mx-auto">
            Plazas activadas progresivamente por país y ciudad, sujetas a verificación profesional y disponibilidad por zona.
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
