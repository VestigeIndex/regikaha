import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Suscripción activada | RegiKaha", robots: { index: false, follow: false } };

export default function SubscriptionSuccessPage() {
  return (
    <main className="container-x py-16 sm:py-24">
      <section className="card mx-auto max-w-xl p-7 text-center sm:p-10">
        <CheckCircle2 size={44} className="mx-auto text-forest-600" />
        <h1 className="mt-5 text-2xl font-bold text-ink">Suscripción recibida</h1>
        <p className="mt-3 leading-relaxed text-muted">Stripe ha confirmado el proceso. El webhook sincronizará plan, contrato y acceso comercial; normalmente tarda pocos segundos.</p>
        <Link href="/panel" className="btn btn-primary mt-7">Ir a mi panel</Link>
      </section>
    </main>
  );
}
