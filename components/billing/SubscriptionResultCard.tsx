"use client";

import Link from "next/link";
import { CheckCircle2, CircleX, Crown } from "lucide-react";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

type ResultVariant = "success" | "cancelled" | "founder";

const content: Record<ResultVariant, {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
}> = {
  success: {
    title: "Suscripción recibida",
    description: "Stripe ha confirmado el proceso. El webhook sincronizará plan, contrato y acceso comercial; normalmente tarda pocos segundos.",
    primaryLabel: "Ir a mi panel",
    primaryHref: "/panel",
  },
  cancelled: {
    title: "No se ha activado la suscripción",
    description: "Tu perfil y contrato guardado no se han borrado. Puedes revisar el plan y volver a Stripe cuando quieras.",
    primaryLabel: "Volver a planes",
    primaryHref: "/suscripcion",
  },
  founder: {
    title: "Activa tu plaza de fundador",
    description: "Elige el plan futuro, revisa el contrato digital y crea la suscripción real de 0 € durante el periodo fundador.",
    primaryLabel: "Revisar contrato",
    primaryHref: "/suscripcion/confirmar?plan=autonomo_nacional&interval=monthly&founder=true",
  },
};

export function SubscriptionResultCard({ variant }: { variant: ResultVariant }) {
  const { translate } = useDirectTranslation();
  const item = content[variant];
  const Icon = variant === "success" ? CheckCircle2 : variant === "cancelled" ? CircleX : Crown;

  return (
    <section className="card mx-auto max-w-xl p-7 text-center sm:p-10">
      <Icon size={44} className={variant === "cancelled" ? "mx-auto text-amber-600" : "mx-auto text-forest-600"} />
      <h1 className="mt-5 text-2xl font-bold text-ink">{translate(item.title)}</h1>
      <p className="mt-3 leading-relaxed text-muted">{translate(item.description)}</p>
      <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href={item.primaryHref} className="btn btn-primary">{translate(item.primaryLabel)}</Link>
        {variant === "cancelled" ? <Link href="/panel" className="btn btn-secondary">{translate("Ir al panel")}</Link> : null}
      </div>
    </section>
  );
}
