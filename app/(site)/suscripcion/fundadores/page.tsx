import Link from "next/link";
import { Crown } from "lucide-react";

export default function FounderSubscriptionPage() {
  return (
    <main className="container-x py-16 sm:py-24">
      <section className="card mx-auto max-w-xl p-7 text-center sm:p-10">
        <Crown size={42} className="mx-auto text-forest-600" />
        <h1 className="mt-5 text-2xl font-bold text-ink">Activa tu plaza de fundador</h1>
        <p className="mt-3 leading-relaxed text-muted">Elige el plan futuro, revisa el contrato digital y crea la suscripción real de 0 € durante el periodo fundador.</p>
        <Link href="/suscripcion/confirmar?plan=autonomo_nacional&interval=monthly&founder=true" className="btn btn-primary mt-7 w-full sm:w-auto">Revisar contrato</Link>
      </section>
    </main>
  );
}
