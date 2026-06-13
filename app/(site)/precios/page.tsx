import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Precios",
  description:
    "RegiNova es gratis para clientes. Para profesionales: 49,95 €/mes + IVA o 499 €/año + IVA. Sin comisiones por lead, sin rankings comprados. Primeros 300 verificados: 5 meses gratis.",
  path: "/precios",
});

const proFeatures = [
  "Página profesional con SEO propio",
  "Portfolio y servicios ilimitados",
  "Solicitudes de clientes directas",
  "Reseñas verificadas",
  "Ranking justo por mérito",
  "Insignia de verificado",
  "Sin comisiones por lead ni por mensaje",
];

export default function PreciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Precios"
        title="Precios claros, sin trampas de visibilidad"
        description="Gratis para clientes. Cuota fija para profesionales. Nadie paga por aparecer primero."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Precios" }]}
      />

      <section className="container-x py-14">
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {/* Clientes */}
          <div className="card p-7 flex flex-col">
            <h2 className="font-bold text-ink text-lg">Clientes</h2>
            <p className="text-sm text-muted mt-1">Busca, compara y pide presupuesto.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink">Gratis</span>
            </div>
            <ul className="mt-5 space-y-2.5 flex-1">
              {["Buscar y comparar profesionales", "Ver portfolio y precios orientativos", "Pedir presupuesto sin compromiso", "Leer y dejar reseñas verificadas"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                  <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/buscar" className="btn btn-secondary w-full mt-6">Buscar profesionales</Link>
          </div>

          {/* Pro mensual */}
          <div className="relative card p-7 flex flex-col ring-2 ring-forest-500 shadow-card">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-forest-600 text-white px-3 py-1 text-xs font-semibold">
              <Sparkles size={13} /> Más elegido
            </span>
            <h2 className="font-bold text-ink text-lg">RegiNova Pro</h2>
            <p className="text-sm text-muted mt-1">Para profesionales y empresas.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink">49,95 €</span>
              <span className="text-muted">/mes + IVA</span>
            </div>
            <p className="text-sm text-forest-700 font-medium mt-1">Primeros 300 verificados: {site.founderFreeMonths} meses gratis</p>
            <ul className="mt-5 space-y-2.5 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                  <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/registro" className="btn btn-primary w-full mt-6">Empezar gratis</Link>
          </div>

          {/* Pro anual */}
          <div className="card p-7 flex flex-col">
            <h2 className="font-bold text-ink text-lg">RegiNova Pro Anual</h2>
            <p className="text-sm text-muted mt-1">Paga una vez al año y ahorra.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink">499 €</span>
              <span className="text-muted">/año + IVA</span>
            </div>
            <p className="text-sm text-forest-700 font-medium mt-1">Ahorra ~17% frente al mensual</p>
            <ul className="mt-5 space-y-2.5 flex-1">
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> Todo lo de RegiNova Pro
              </li>
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> Facturación anual simple
              </li>
              <li className="flex items-start gap-2 text-sm text-ink/80">
                <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> Prioridad en soporte
              </li>
            </ul>
            <Link href="/registro" className="btn btn-secondary w-full mt-6">Elegir anual</Link>
          </div>
        </div>

        {/* Lo que nunca cobramos */}
        <div className="max-w-3xl mx-auto mt-12 card p-7">
          <h2 className="font-bold text-ink">Lo que en RegiNova nunca pagas</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
            {["Ranking comprado", "Pago por aparecer primero", "Comisión por lead", "Comisión por mensaje", "Créditos artificiales", "Trampas de visibilidad"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-muted">
                <X size={15} className="text-red-400 shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Únete por mérito, no por presupuesto de publicidad"
        text="Cuota fija, sin sorpresas. Cancela cuando quieras."
        primary={{ label: "Crear mi perfil", href: "/registro" }}
        secondary={{ label: "Oferta fundadores", href: "/fundadores" }}
      />
    </>
  );
}
