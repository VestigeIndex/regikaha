import type { Metadata } from "next";
import Link from "next/link";
import { CircleX } from "lucide-react";

export const metadata: Metadata = { title: "Suscripción no completada | RegiKaha", robots: { index: false, follow: false } };

export default function SubscriptionCancelledPage() {
  return (
    <main className="container-x py-16 sm:py-24">
      <section className="card mx-auto max-w-xl p-7 text-center sm:p-10">
        <CircleX size={42} className="mx-auto text-amber-600" />
        <h1 className="mt-5 text-2xl font-bold text-ink">No se ha activado la suscripción</h1>
        <p className="mt-3 leading-relaxed text-muted">Tu perfil y contrato guardado no se han borrado. Puedes revisar el plan y volver a Stripe cuando quieras.</p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row"><Link href="/suscripcion" className="btn btn-primary">Volver a planes</Link><Link href="/panel" className="btn btn-secondary">Ir al panel</Link></div>
      </section>
    </main>
  );
}
