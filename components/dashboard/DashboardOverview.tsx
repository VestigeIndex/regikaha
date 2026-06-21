"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, Clock, Image as ImageIcon, Inbox, Star } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { QuoteStatusBadge } from "@/components/dashboard/QuoteStatusBadge";
import { timeAgo } from "@/lib/utils";

export function DashboardOverview() {
  const [me, setMe] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [meRes, servicesRes, portfolioRes, requestsRes] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/services"),
        fetch("/api/portfolio"),
        fetch("/api/requests"),
      ]);
      const [meData, servicesData, portfolioData, requestsData] = await Promise.all([
        meRes.json().catch(() => ({})),
        servicesRes.json().catch(() => ({})),
        portfolioRes.json().catch(() => ({})),
        requestsRes.json().catch(() => ({})),
      ]);
      setMe(meData);
      setServices(servicesRes.ok ? servicesData.services || [] : []);
      setPortfolio(portfolioRes.ok ? portfolioData.items || [] : []);
      setRequests(requestsRes.ok ? requestsData.requests || [] : []);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, []);

  const pro = me?.professional;
  const newRequests = requests.filter((request) => request.status === "new").length;
  const completeness = useMemo(() => {
    const areas = me?.areas || [];
    return [
      { label: "Perfil y descripción", done: !!pro?.public_name && !!pro?.description },
      { label: "Categorías y zona", done: (me?.categories || []).length > 0 && areas.length > 0 },
      { label: "Servicios publicados", done: services.length > 0 },
      { label: "Logo y fotos de trabajos", done: !!pro?.logo_image || portfolio.length > 0 },
      { label: "Datos de contacto", done: !!pro?.phone && !!me?.user?.email },
    ];
  }, [me, portfolio.length, pro, services.length]);
  const pct = completeness.length
    ? Math.round((completeness.filter((item) => item.done).length / completeness.length) * 100)
    : 0;

  if (loading) {
    return (
      <>
        <DashboardHeader title="Panel" subtitle="Cargando tu actividad en Regi Kaha." />
        <div className="card p-8 text-sm text-muted">Preparando el resumen.</div>
      </>
    );
  }

  if (!pro) {
    return (
      <>
        <DashboardHeader title="Panel" subtitle="Inicia sesión para gestionar tu perfil profesional." />
        <div className="card p-8">
          <Link href="/login" className="btn btn-primary text-sm">Entrar</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title={`Hola, ${pro.public_name || "profesional"}`}
        subtitle="Resumen de tu actividad en Regi Kaha."
        action={
          pro.slug && (
            <Link href={`/profesionales/${pro.slug}`} className="btn btn-secondary text-sm">
              Ver mi perfil público <ArrowRight size={15} />
            </Link>
          )
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Inbox size={19} />} label="Solicitudes nuevas" value={newRequests} hint={`${requests.length} en total`} />
        <StatCard icon={<Star size={19} />} label="Valoración media" value={`${Number(pro.average_rating || 0).toFixed(1)}/5`} hint={`${pro.review_count || 0} reseñas`} />
        <StatCard icon={<Briefcase size={19} />} label="Servicios publicados" value={services.length} />
        <StatCard icon={<Clock size={19} />} label="Tiempo de respuesta" value={`${pro.response_time_hours || 24} h`} />
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink">Solicitudes recientes</h2>
            <Link href="/panel/solicitudes" className="text-sm font-medium text-forest-700 hover:underline">Ver todas</Link>
          </div>
          {requests.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay solicitudes.</p>
          ) : (
            <div className="divide-y divide-[var(--hairline)]">
              {requests.slice(0, 4).map((request) => (
                <div key={request.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm">{request.clientName} · {request.location || "sin zona"}</p>
                    <p className="text-sm text-muted truncate">{request.description}</p>
                    <p className="text-xs text-muted mt-0.5">{request.budgetRange || "Sin presupuesto"} · {timeAgo(request.createdAt)}</p>
                  </div>
                  <QuoteStatusBadge status={request.status} />
                </div>
              ))}
            </div>
          )}
        </section>

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
              {completeness.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className={item.done ? "text-forest-600" : "text-forest-200"} />
                  <span className={item.done ? "text-ink/80" : "text-muted"}>{item.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-ink inline-flex items-center gap-2"><ImageIcon size={18} className="text-forest-600" /> Portfolio</h2>
            <p className="text-sm text-muted mt-2">{portfolio.length}/5 fotos publicadas.</p>
            <Link href="/panel/perfil" className="btn btn-secondary text-sm mt-4">Gestionar perfil</Link>
          </section>
        </div>
      </div>
    </>
  );
}
