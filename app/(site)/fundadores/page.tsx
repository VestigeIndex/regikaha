import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Crown, CreditCard, FileSignature, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { FounderAvailability } from "@/components/billing/FounderAvailability";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatIntervalPrice, professionalPlans } from "@/lib/pricing";

export const metadata: Metadata = buildMetadata({
  title: "Oferta fundadores",
  description: "Los primeros 300 profesionales reciben 5 meses a 0 € mediante una suscripción real con contrato digital y plan futuro elegido.",
  path: "/fundadores",
});

const benefits = [
  `${site.founderFreeMonths} meses a 0 € en el plan profesional elegido`,
  "Insignia de fundador y antigüedad desde el inicio",
  "Perfil, servicios, portfolio y zonas de trabajo conservados",
  "Saldo promocional para desbloquear los primeros contactos",
  "Ranking por relevancia y mérito, nunca por pagar más",
];

export default function FundadoresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programa fundador"
        title={`Primeros ${site.founderSlots} profesionales: ${site.founderFreeMonths} meses a 0 €`}
        description="Reserva una plaza real, elige tu plan futuro y acepta el contrato digital. Al finalizar el periodo gratuito, la suscripción se renueva al precio elegido o el acceso comercial queda limitado."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Fundadores" }]}
      >
        <div className="space-y-5">
          <FounderAvailability />
          <Link href="/registro/profesional?founder=true&plan=autonomo_nacional&interval=monthly" className="btn btn-primary w-full sm:w-auto">Crear cuenta y reservar plaza</Link>
        </div>
      </PageHeader>

      <section className="container-x py-12 sm:py-16">
        <div className="grid overflow-hidden rounded-lg border border-[var(--hairline)] bg-white lg:grid-cols-[.92fr_1.08fr]">
          <div className="relative min-h-72 lg:min-h-[560px]">
            <Image src="/images/photos/carpinteria.webp" alt="Profesional de carpintería trabajando en una instalación de alta calidad" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-white">
              <span className="inline-flex items-center gap-2 text-sm font-semibold"><Crown size={17} /> Miembro fundador Regi Kaha</span>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">Cinco meses para construir reputación, completar tu perfil y demostrar trabajos reales.</p>
            </div>
          </div>

          <div className="p-6 sm:p-9 lg:p-12">
            <h2 className="text-2xl font-bold text-ink">Una suscripción real desde el primer día</h2>
            <p className="mt-3 leading-relaxed text-muted">La plaza no es un cupón ni una promesa informal. Stripe crea la suscripción por 0 €, registra el plan futuro y prepara la renovación para la fecha mostrada antes de aceptar.</p>
            <ul className="mt-6 space-y-3">
              {benefits.map((benefit) => <li key={benefit} className="flex items-start gap-3 text-sm text-ink/85"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-forest-700"><Check size={14} /></span>{benefit}</li>)}
            </ul>

            <div className="mt-8 grid gap-4 border-y border-[var(--hairline)] py-6 sm:grid-cols-3">
              <Step icon={<FileSignature size={19} />} title="Contrato" text="Snapshot legal y casillas sin premarcar." />
              <Step icon={<CreditCard size={19} />} title="Stripe" text="Método de pago y plan futuro." />
              <Step icon={<ShieldCheck size={19} />} title="Acceso" text="Activo mientras la suscripción esté al día." />
            </div>

            <h3 className="mt-8 font-bold text-ink">Precio al terminar los 5 meses</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {professionalPlans.map((plan) => <div key={plan.id} className="rounded-md bg-canvas p-4"><p className="font-semibold text-ink">{plan.name}</p><p className="mt-1 text-sm text-muted">{formatIntervalPrice(plan, "monthly")}</p></div>)}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">Puedes cancelar desde el portal de facturación. Si no se completa el pago futuro, el perfil se conserva en borrador pero deja de recibir nuevas oportunidades y visibilidad comercial activa.</p>
          </div>
        </div>
      </section>

      <CtaBand title="Reserva tu plaza de fundador" text="Crea tu cuenta, verifica el email y revisa el contrato antes de activar Stripe." primary={{ label: "Empezar alta profesional", href: "/registro/profesional?founder=true&plan=autonomo_nacional&interval=monthly" }} />
    </>
  );
}

function Step({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div><span className="text-forest-600">{icon}</span><p className="mt-2 text-sm font-bold text-ink">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted">{text}</p></div>;
}
