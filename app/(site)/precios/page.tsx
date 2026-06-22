import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { buildMetadata } from "@/lib/seo";
import {
  ANNUAL_DISCOUNT_PERCENT,
  formatEuro,
  professionalPlans,
  VAT_COPY,
} from "@/lib/pricing";

export const metadata: Metadata = buildMetadata({
  title: "Precios",
  description:
    "Regi Kaha es gratis para clientes. RegiKaha no cobra por contactos basura: te da RegiWorks para gestionar tu trabajo y presencia profesional para conseguir oportunidades reales. Los profesionales eligen Profesional Pro por 19,95 €/mes o Business · Multi-zona por 49,95 €/mes, IVA/VAT aparte. Sin rankings comprados ni comisión sobre el proyecto.",
  path: "/precios",
});

const clientFeatures = [
  "Buscar en mercados activos o filtrar por país, región y ciudad",
  "Comparar profesionales por portfolio, precio orientativo y reseñas",
  "Pedir pre-presupuesto sin compromiso",
  "Leer y dejar valoraciones verificadas",
];

const professionalFreeFeatures = [
  "Perfil profesional básico",
  "1 zona principal de trabajo",
  "Fotos limitadas",
  "Recibe solicitudes limitadas",
  "RegiWorks Free con límites",
  "Presupuestos limitados",
  "Sin badge Pro ni prioridad en el mapa",
];

const neverCharged = [
  "Ranking comprado",
  "Pago por aparecer primero",
  "Comisión sobre el valor del proyecto",
  "Precio oculto por mensaje",
  "Cargos de contacto ocultos",
  "Trampas de visibilidad",
];

export default function PreciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Precios"
        title="Tarifas reales para crecer por país o por mercados activos"
        description="Gratis para clientes. Para profesionales, una cuota ajustada a tu capacidad operativa: nacional si trabajas dentro de un país, multi-mercado si quieres abrir más regiones y países activos."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Precios" }]}
      />

      <section className="container-x py-14">
        <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-mint/70 p-5 text-center ring-1 ring-forest-600/15">
          <p className="text-sm font-semibold text-forest-800">
            Oferta fundadora: los primeros 300 profesionales verificados de cada país tienen 5 meses gratis de RegiKaha Pro + acceso a RegiWorks.
          </p>
          <p className="mt-1.5 text-xs text-forest-800/80">
            Después del periodo gratuito se aplica el precio vigente (19,95 €/mes + IVA/VAT) solo si decides continuar; no hay obligación de seguir pagando. Plazas activadas progresivamente por país y ciudad, sujetas a verificación profesional y disponibilidad por zona.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          <div className="card p-7 flex flex-col">
            <h2 className="font-bold text-ink text-lg">Clientes</h2>
            <p className="text-sm text-muted mt-1">Busca, compara y pide presupuesto.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink">Gratis</span>
            </div>
            <ul className="mt-5 space-y-2.5 flex-1">
              {clientFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-ink/80">
                  <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <Link href="/buscar" className="btn btn-secondary w-full mt-6">Buscar profesionales</Link>
          </div>

          <div className="card p-7 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">Para empezar</p>
            <h2 className="mt-2 font-bold text-ink text-lg">Profesional Free</h2>
            <p className="text-sm text-muted mt-1">Crea tu perfil y prueba RegiWorks.</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink">0 €</span>
              <span className="text-muted">/mes</span>
            </div>
            <ul className="mt-5 space-y-2.5 flex-1">
              {professionalFreeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-ink/80">
                  <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <Link href="/registro/profesional" className="btn btn-secondary w-full mt-6">Crear perfil gratis</Link>
          </div>

          {professionalPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative card p-7 flex flex-col ${index === 0 ? "ring-2 ring-forest-500 shadow-card" : ""}`}
            >
              {index === 0 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-forest-600 text-white px-3 py-1 text-xs font-semibold">
                  <Sparkles size={13} /> Más accesible
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">{plan.badge}</p>
              <h2 className="mt-2 font-bold text-ink text-lg">{plan.name}</h2>
              <p className="text-sm text-muted mt-1">{plan.audience}</p>
              <p className="text-sm text-ink/75 mt-4 leading-relaxed">{plan.description}</p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-xl bg-canvas p-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-ink">{formatEuro(plan.monthlyPrice)}</span>
                    <span className="text-muted">/mes {VAT_COPY}</span>
                  </div>
                  <CheckoutButton plan={plan.id} interval="monthly" className="btn btn-primary w-full mt-4">
                    Elegir mensual
                  </CheckoutButton>
                </div>
                <div className="rounded-xl bg-white ring-1 ring-forest-600/12 p-4">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-bold text-ink">{formatEuro(plan.yearlyPrice)}</span>
                    <span className="text-muted">/año {VAT_COPY}</span>
                  </div>
                  <p className="text-xs font-medium text-forest-700 mt-1">
                    {ANNUAL_DISCOUNT_PERCENT}% de descuento frente al mensual
                  </p>
                  <CheckoutButton plan={plan.id} interval="yearly" className="btn btn-secondary w-full mt-4">
                    Elegir anual
                  </CheckoutButton>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink/80">
                    <Check size={16} className="text-forest-600 mt-0.5 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 card p-7">
          <h2 className="font-bold text-ink">Lo que la suscripción nunca compra</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Cada oportunidad muestra su precio antes de desbloquear el contacto. El saldo promocional se usa primero y los contactos inválidos pueden reclamarse.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
            {neverCharged.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted">
                <X size={15} className="text-red-400 shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Únete por mérito, no por presupuesto de publicidad"
        text="Elige la cobertura que puedas atender de verdad. Puedes cambiar de plan cuando tu radio de trabajo crezca."
        primary={{ label: "Crear mi perfil", href: "/registro" }}
        secondary={{ label: "Oferta fundadores", href: "/fundadores" }}
      />
    </>
  );
}
