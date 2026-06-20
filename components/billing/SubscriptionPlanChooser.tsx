"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { FounderAvailability } from "@/components/billing/FounderAvailability";
import { professionalPlans, formatEuro, type BillingInterval } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";
import { cn } from "@/lib/utils";

export function SubscriptionPlanChooser() {
  const { locale } = useI18n();
  const { translate } = useDirectTranslation();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const unit = interval === "monthly"
    ? ({ es: "mes", fr: "mois", it: "mese", pt: "mês", de: "Monat", nl: "maand", en: "month" } as const)[locale]
    : ({ es: "año", fr: "an", it: "anno", pt: "ano", de: "Jahr", nl: "jaar", en: "year" } as const)[locale];
  const taxLabel = ({ es: "IVA", fr: "TVA", it: "IVA", pt: "IVA", de: "MwSt.", nl: "btw", en: "VAT" } as const)[locale];
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-lg bg-ink text-white">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">{translate("Activa tu acceso profesional")}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/75">
              {translate("El contrato y la suscripción son obligatorios para aparecer activo, recibir solicitudes y responder oportunidades. Tus datos se conservan aunque canceles.")}
            </p>
            <div className="mt-6"><FounderAvailability /></div>
            <Link href="/suscripcion/confirmar?plan=autonomo_nacional&interval=monthly&founder=true" className="btn btn-white mt-7 w-full sm:w-auto">
              {translate("Activar plaza fundador por 0 €")} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative min-h-56 lg:min-h-full">
            <img src="/images/photos/mantenimiento.webp" alt={translate("Técnico profesional trabajando con equipamiento industrial")} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 text-sm text-white/85 lg:hidden">
              {translate("Suscripción, contrato y actividad profesional en un único flujo.")}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">{translate("Elige cobertura futura")}</h2>
            <p className="mt-2 text-muted">{translate("Puedes revisar precio, renovación y contrato antes de ir a Stripe.")}</p>
          </div>
          <div className="grid grid-cols-2 rounded-lg bg-canvas p-1" aria-label={translate("Intervalo de facturación")}>
            {(["monthly", "yearly"] as BillingInterval[]).map((value) => (
              <button key={value} type="button" onClick={() => setInterval(value)} className={cn("rounded-md px-4 py-2 text-sm font-semibold", interval === value ? "bg-white text-ink shadow-soft" : "text-muted")}>
                {translate(value === "monthly" ? "Mensual" : "Anual · -10%")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {professionalPlans.map((plan) => {
            const price = interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <article key={plan.id} className="card flex flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{translate(plan.name)}</h3>
                    <p className="mt-1 text-sm text-muted">{translate(plan.audience)}</p>
                  </div>
                  <ShieldCheck size={22} className="shrink-0 text-forest-600" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">{translate(plan.description)}</p>
                <p className="mt-5 text-3xl font-bold text-ink">
                  {formatEuro(price, locale)} <span className="text-sm font-medium text-muted">/{unit} + {taxLabel}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.slice(0, 4).map((feature) => <li key={feature} className="flex gap-2 text-sm text-ink/80"><Check size={15} className="mt-0.5 shrink-0 text-forest-600" />{translate(feature)}</li>)}
                </ul>
                <Link href={`/suscripcion/confirmar?plan=${plan.id}&interval=${interval}`} className="btn btn-primary mt-6 w-full">
                  {translate("Revisar contrato")} <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
