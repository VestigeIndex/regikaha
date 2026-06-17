"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, ClipboardList, MapPin, ShieldCheck, Users } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { CoverageBadge } from "@/components/marketplace/CoverageBadge";
import { coverageStatus } from "@/lib/geo";

export function AdminDemandDashboard() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/demand");
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setData(body);
        setError(null);
      } else {
        setError(body.error || "No tienes permisos para ver el panel interno.");
      }
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, []);

  const demandTotal = (data.byCountry || []).reduce((sum: number, row: any) => sum + Number(row.total || 0), 0);
  const b2bTotal = (data.b2b || []).reduce((sum: number, row: any) => sum + Number(row.total || 0), 0);
  const tasks = data.tasks || [];
  const coverage = data.coverage || [];

  return (
    <>
      <DashboardHeader
        title="Panel de demanda y cobertura"
        subtitle="Control interno de solicitudes, zonas sin oferta, captación y cobertura en mercados activos."
        action={<Link href="/admin/profesionales" className="btn btn-secondary text-sm">Profesionales</Link>}
      />

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BarChart3 size={19} />} label="Demandas cliente" value={loading ? "..." : demandTotal} />
        <StatCard icon={<ClipboardList size={19} />} label="Demandas B2B" value={loading ? "..." : b2bTotal} />
        <StatCard icon={<MapPin size={19} />} label="Zonas monitorizadas" value={loading ? "..." : coverage.length} />
        <StatCard icon={<Users size={19} />} label="Tareas captación" value={loading ? "..." : tasks.length} />
      </div>

      <div className="mt-6 grid xl:grid-cols-[1.2fr_1fr] gap-6">
        <section className="card p-6">
          <h2 className="font-bold text-ink">Oportunidades por cobertura</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted border-b hairline">
                <tr>
                  <th className="py-3 pr-4">Zona</th>
                  <th className="py-3 pr-4">Categoría</th>
                  <th className="py-3 pr-4">Demanda</th>
                  <th className="py-3 pr-4">Oferta</th>
                  <th className="py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {coverage.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-muted">Aún no hay cobertura registrada desde solicitudes reales.</td></tr>
                )}
                {coverage.map((row: any) => (
                  <tr key={row.id}>
                    <td className="py-3 pr-4 text-ink">{row.city}, {row.country}</td>
                    <td className="py-3 pr-4 text-muted">{row.category_id}</td>
                    <td className="py-3 pr-4">{row.demand_count}</td>
                    <td className="py-3 pr-4">{row.professionals_count}</td>
                    <td className="py-3"><CoverageBadge status={coverageStatus(Number(row.professionals_count || 0), Number(row.demand_count || 0))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-ink">Tareas de captación</h2>
          <div className="mt-4 space-y-3">
            {tasks.length === 0 && <p className="text-sm text-muted">No hay tareas abiertas.</p>}
            {tasks.map((task: any) => (
              <article key={task.id} className="rounded-xl bg-canvas p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-ink">{task.city}, {task.country}</p>
                  <span className="chip">P{task.priority}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{task.category_id} · {task.type}</p>
                <p className="mt-2 text-sm text-ink/80 leading-relaxed">{task.prompt}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <MiniList title="Demanda por ciudad" rows={data.byCity || []} />
        <MiniList title="Demanda por categoría" rows={data.byCategory || []} category />
        <section className="card p-6">
          <h2 className="font-bold text-ink inline-flex items-center gap-2"><ShieldCheck size={18} className="text-forest-600" /> Verificación pendiente</h2>
          <div className="mt-4 space-y-2">
            {(data.pendingProfessionals || []).length === 0 && <p className="text-sm text-muted">Sin perfiles pendientes.</p>}
            {(data.pendingProfessionals || []).map((p: any) => (
              <p key={p.id} className="text-sm text-muted">{p.public_name} · {p.city}, {p.country}</p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function MiniList({ title, rows, category }: { title: string; rows: any[]; category?: boolean }) {
  return (
    <section className="card p-6">
      <h2 className="font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-2">
        {rows.length === 0 && <p className="text-sm text-muted">Sin datos todavía.</p>}
        {rows.map((row, index) => (
          <div key={`${title}-${index}`} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted">{category ? row.category_id : `${row.city || row.country}, ${row.country || ""}`}</span>
            <strong className="text-ink">{row.total}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
