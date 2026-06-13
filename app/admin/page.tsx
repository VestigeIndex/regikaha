import Link from "next/link";
import { ShieldCheck, Users, MessageSquareWarning, BadgeEuro, ArrowRight } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { professionals, pendingReviews } from "@/lib/data";
import { verificationRequests, subscriptions } from "@/lib/data/operations";
import { StatusBadge } from "@/components/ui/Badges";

export default function AdminHome() {
  const verified = professionals.filter((p) => p.verificationStatus === "verified").length;
  const pendingVer = verificationRequests.filter((v) => v.status === "pending").length;
  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trial").length;
  const mrr = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.plan === "yearly" ? s.priceEur / 12 : s.priceEur), 0);

  return (
    <>
      <DashboardHeader title="Panel de administración" subtitle="Calidad del marketplace, verificación y moderación." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={19} />} label="Profesionales verificados" value={verified} hint={`${professionals.length} en total`} />
        <StatCard icon={<ShieldCheck size={19} />} label="Verificaciones pendientes" value={pendingVer} hint="Requieren revisión" />
        <StatCard icon={<MessageSquareWarning size={19} />} label="Reseñas a moderar" value={pendingReviews.length} />
        <StatCard icon={<BadgeEuro size={19} />} label="MRR estimado" value={`${mrr.toFixed(0)} €`} hint={`${activeSubs} suscripciones`} />
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink">Cola de verificación</h2>
            <Link href="/admin/verificaciones" className="text-sm font-medium text-forest-700 hover:underline inline-flex items-center gap-1">
              Gestionar <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--hairline)]">
            {verificationRequests.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink text-sm">{v.professionalName}</p>
                  <p className="text-xs text-muted">Enviado el {new Date(v.submittedAt).toLocaleDateString("es-ES")}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-ink mb-4">Principios del marketplace</h2>
          <ul className="space-y-3 text-sm">
            {[
              "Ranking por mérito: ningún profesional paga por posición.",
              "Reseñas verificadas: no se compran ni se borran las legítimas.",
              "Datos de cliente protegidos: sin venta de leads.",
              "Verificación real antes de mostrar el sello.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-ink/80">
                <ShieldCheck size={16} className="text-forest-600 mt-0.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
