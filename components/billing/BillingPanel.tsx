"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bell, CreditCard, FileText, RefreshCw, ShieldCheck } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { useI18n } from "@/lib/i18n/context";

type BillingStatus = {
  subscription?: {
    plan?: string;
    interval?: string;
    status?: string;
    current_period_end?: string;
    trial_ends_at?: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
  };
  founderSlot?: {
    status?: string;
    selected_plan?: string;
    trial_months?: number;
    trial_ends_at?: string;
  } | null;
  contract?: {
    id?: string;
    contract_version?: string;
    accepted_at?: string;
    first_charge_at?: string;
  } | null;
  commercialAccess?: string;
  emailVerified?: boolean;
  notifications?: { id: string; type: string; scheduled_for?: string }[];
  migrationPending?: boolean;
};

const statusLabels: Record<string, string> = {
  no_subscription: "Sin suscripción",
  founder_trial_0_eur: "Fundador 0 € activo",
  trialing: "Periodo de prueba",
  active: "Activa",
  past_due: "Pago pendiente",
  unpaid: "Impagada",
  cancelled: "Cancelada",
  canceled: "Cancelada",
  suspended: "Suspendida",
  expired: "Vencida",
};

function formatDate(value: string | undefined, locale: string) {
  if (!value) return "Pendiente";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function BillingPanel({ role }: { role: "professional" | "company" | "subcontractor" }) {
  const { locale } = useI18n();
  const [data, setData] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/billing/status");
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || "No se pudo cargar facturación");
        if (!cancelled) setData(payload);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "No se pudo cargar facturación");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const subscription = useMemo(() => data?.subscription || {}, [data]);
  const status = String(subscription.status || "no_subscription");
  const isActive = ["active", "trialing", "founder_trial_0_eur"].includes(status);
  const roleLabel = role === "professional" ? "profesional" : role === "company" ? "empresa" : "subcontrata";
  const nextDate = useMemo(() => formatDate(subscription.current_period_end || subscription.trial_ends_at || data?.founderSlot?.trial_ends_at, locale), [data, subscription, locale]);
  const hasContract = Boolean(data?.contract?.id);

  async function openPortal() {
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.url) throw new Error(payload.error || "No se pudo abrir Stripe");
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo abrir Stripe");
    }
  }

  return (
    <>
      <DashboardHeader
        title="Suscripción"
        subtitle={`Estado comercial de tu cuenta ${roleLabel}. Sin suscripción activa no se reciben solicitudes ni oportunidades nuevas.`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/precios" className="btn btn-primary text-sm">Activar o cambiar plan</Link>
            <Link href="/legal/politica-suscripcion" className="btn btn-secondary text-sm">Ver condiciones</Link>
          </div>
        }
      />

      {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!loading && !isActive && (
        <section className="mb-5 flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><AlertTriangle size={20} className="mt-0.5 shrink-0" /><div><h2 className="font-bold">Acceso comercial limitado</h2><p className="mt-1 text-sm">Puedes completar perfil, servicios y portfolio, pero no aparecerás activo ni recibirás nuevas oportunidades hasta activar contrato y suscripción.</p></div></div>
          <Link href="/suscripcion" className="btn btn-primary shrink-0">Activar acceso</Link>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<ShieldCheck size={19} />} label="Estado" value={loading ? "Cargando" : statusLabels[status] || status} hint={isActive ? "Acceso comercial habilitado" : "Acceso comercial limitado"} />
        <StatCard icon={<CreditCard size={19} />} label="Plan" value={subscription.plan || data?.founderSlot?.selected_plan || "Pendiente"} hint={subscription.interval || "Selecciona plan"} />
        <StatCard icon={<RefreshCw size={19} />} label="Próxima fecha" value={nextDate} hint="Renovación, fin trial o revisión" />
        <StatCard icon={<FileText size={19} />} label="Contrato" value={hasContract ? "Aceptado" : "Pendiente"} hint={hasContract ? `Versión ${data?.contract?.contract_version || "registrada"}` : "Debe aceptarse antes de Stripe"} />
      </div>

      {!!data?.notifications?.length && (
        <section className="mt-6 border-y border-[var(--hairline)] py-5">
          <div className="flex items-center gap-2 font-bold text-ink"><Bell size={18} className="text-forest-600" /> Avisos de facturación</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.notifications.map((notice) => <li key={notice.id} className="rounded-md bg-canvas px-4 py-3 text-sm text-ink/80">{notice.type.replaceAll("_", " ")} · {formatDate(notice.scheduled_for, locale)}</li>)}
          </ul>
        </section>
      )}

      <section className="card p-6 mt-6">
        <h2 className="font-bold text-ink">Resumen de acceso profesional</h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          La suscripción controla el acceso comercial: visibilidad activa, recepción de solicitudes, oportunidades B2B y herramientas profesionales. Si el estado pasa a pago pendiente, impagado, cancelado o vencido, los datos del perfil se conservan pero el acceso comercial queda limitado.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={openPortal} className="btn btn-secondary">
            Gestionar facturación
          </button>
          <Link href="/precios" className="btn btn-primary">Elegir plan</Link>
        </div>
      </section>
    </>
  );
}
