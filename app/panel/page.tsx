import Link from "next/link";
import { Inbox, Star, Briefcase, Clock, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { getProfessionalById, getReviewsByProfessional } from "@/lib/data";
import { getQuotesByProfessional, getSubscriptionByProfessional } from "@/lib/data/operations";
import { StatusBadge } from "@/components/ui/Badges";
import { QuoteStatusBadge } from "@/components/dashboard/QuoteStatusBadge";
import { timeAgo } from "@/lib/utils";

const ME = "pro-reformas-costa";

export default function PanelHome() {
  const pro = getProfessionalById(ME)!;
  const quotes = getQuotesByProfessional(ME);
  const reviews = getReviewsByProfessional(ME);
  const sub = getSubscriptionByProfessional(ME);
  const newQuotes = quotes.filter((q) => q.status === "new").length;

  const completeness = [
    { label: "Perfil y descripción", done: true },
    { label: "Categorías y zona", done: true },
    { label: "Servicios publicados", done: true },
    { label: "Portfolio con fotos", done: true },
    { label: "Verificación completa", done: pro.verificationStatus === "verified" },
  ];
  const pct = Math.round((completeness.filter((c) => c.done).length / completeness.length) * 100);

  return (
    <>
      <DashboardHeader
        title={`Hola, ${pro.publicName}`}
        subtitle="Resumen de tu actividad en RegiKaha."
        action={
          <Link href={`/profesionales/${pro.slug}`} className="btn btn-secondary text-sm">
            Ver mi perfil público <ArrowRight size={15} />
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Inbox size={19} />} label="Solicitudes nuevas" value={newQuotes} hint={`${quotes.length} en total`} />
        <StatCard icon={<Star size={19} />} label="Valoración media" value={`${pro.averageRating}/5`} hint={`${pro.reviewCount} reseñas`} />
        <StatCard icon={<Briefcase size={19} />} label="Proyectos completados" value={pro.completedProjects} />
        <StatCard icon={<Clock size={19} />} label="Tiempo de respuesta" value={`${pro.responseTimeHours} h`} hint="Mejor que la media" />
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Solicitudes recientes */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink">Solicitudes recientes</h2>
            <Link href="/panel/solicitudes" className="text-sm font-medium text-forest-700 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-[var(--hairline)]">
            {quotes.slice(0, 4).map((q) => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm">{q.clientName} · {q.location}</p>
                  <p className="text-sm text-muted truncate">{q.description}</p>
                  <p className="text-xs text-muted mt-0.5">{q.budgetRange} · {timeAgo(q.createdAt)}</p>
                </div>
                <QuoteStatusBadge status={q.status} />
              </div>
            ))}
          </div>
        </section>
        {/* fin solicitudes */}

        {/* Perfil + suscripción */}
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-bold text-ink">Completa tu perfil</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-canvas-alt overflow-hidden">
                <div className="h-full rounded-full bg-forest-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-bold text-forest-700">{pct}%</span>
            </div>
            <ul className="mt-4 space-y-2">
              {completeness.map((c) => (
                <li key={c.label} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className={c.done ? "text-forest-600" : "text-forest-200"} />
                  <span className={c.done ? "text-ink/80" : "text-muted"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {sub && (
            <section className="card p-6 bg-gradient-to-b from-mint/50 to-white">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700">
                <Sparkles size={14} /> Suscripción
              </span>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-bold text-ink capitalize">
                  {sub.plan === "founder" ? "Fundador (5 meses gratis)" : sub.plan === "yearly" ? "Anual" : "Mensual"}
                </p>
                <StatusBadge status={pro.verificationStatus} />
              </div>
              <p className="text-sm text-muted mt-2">
                {sub.status === "trial" ? "En periodo gratuito" : "Activa"} · renueva el{" "}
                {new Date(sub.renewsAt).toLocaleDateString("es-ES")}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
