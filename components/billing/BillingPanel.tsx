"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bell, CreditCard, Download, FileText, RefreshCw, ShieldCheck } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { useI18n } from "@/lib/i18n/context";
import { dashboardDictionaries } from "@/lib/i18n/dashboard";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";
import { formatEuro, professionalPlans } from "@/lib/pricing";

type BillingStatus = {
  subscription?: {
    plan?: string;
    interval?: string;
    status?: string;
    current_period_end?: string;
    trial_ends_at?: string;
    first_charge_at?: string;
    future_price_cents?: number;
    currency?: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    cancel_at_period_end?: number;
    payment_method_status?: string;
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
    future_price?: number;
    currency?: string;
    accepted_locale?: string;
    contract_snapshot_hash?: string;
    contract_snapshot_json?: string;
    accepted_checkboxes_json?: string;
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

const notificationLabels: Record<string, string> = {
  trial_ends_30d: "El periodo gratuito termina en 30 días",
  trial_ends_14d: "El periodo gratuito termina en 14 días",
  trial_ends_7d: "El periodo gratuito termina en 7 días",
  trial_ends_3d: "El periodo gratuito termina en 3 días",
  trial_ends_1d: "El periodo gratuito termina mañana",
  trial_ends_today: "El periodo gratuito termina hoy",
  payment_failed: "El último pago ha fallado",
  subscription_cancelled: "La suscripción se ha cancelado",
};

function formatDate(value: string | undefined, locale: string, pending: string) {
  if (!value) return pending;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function BillingPanel({ role }: { role: "professional" | "company" | "subcontractor" }) {
  const { locale } = useI18n();
  const { translate } = useDirectTranslation();
  const dashboardCopy = dashboardDictionaries[locale];
  const [data, setData] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/billing/status");
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error("billing");
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setError(translate("No se pudo cargar facturación"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [translate]);

  const subscription = useMemo(() => data?.subscription || {}, [data]);
  const status = String(subscription.status || "no_subscription");
  const isActive = ["active", "trialing", "founder_trial_0_eur"].includes(status);
  const roleLabel = dashboardCopy.roles[role];
  const pendingLabel = translate("Pendiente");
  const nextDate = useMemo(
    () => formatDate(
      subscription.current_period_end || subscription.trial_ends_at || data?.founderSlot?.trial_ends_at,
      locale,
      pendingLabel,
    ),
    [data, subscription, locale, pendingLabel],
  );
  const hasContract = Boolean(data?.contract?.id);
  const selectedPlan = String(subscription.plan || data?.founderSlot?.selected_plan || "").split(":")[0];
  const selectedInterval = String(subscription.interval || data?.founderSlot?.selected_plan || "").split(":").at(-1);
  const plan = professionalPlans.find((candidate) => candidate.id === selectedPlan);
  const planLabel = plan ? translate(plan.name) : pendingLabel;
  const intervalLabel = selectedInterval === "yearly"
    ? translate("Anual")
    : selectedInterval === "monthly"
      ? translate("Mensual")
      : translate("Selecciona plan");
  const price = plan
    ? formatEuro(selectedInterval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice, locale)
    : pendingLabel;

  async function openPortal() {
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.url) throw new Error("portal");
      window.location.href = payload.url;
    } catch {
      setError(translate("No se pudo abrir Stripe"));
    }
  }

  async function downloadContract() {
    if (!data?.contract?.contract_snapshot_json) return;
    setError(null);
    try {
      const snapshot = JSON.parse(data.contract.contract_snapshot_json);
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 18;
      let y = 20;
      const write = (text: string, size = 10, bold = false) => {
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(size);
        const lines = pdf.splitTextToSize(text, 174);
        if (y + lines.length * 5 > 278) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(lines, margin, y);
        y += lines.length * 5 + 2;
      };
      write("Regi Kaha", 16, true);
      write(translate("Resumen del contrato de suscripción"), 14, true);
      write(`${translate("Versión")}: ${data.contract.contract_version || pendingLabel}`);
      write(`${translate("Aceptado")}: ${formatDate(data.contract.accepted_at, locale, pendingLabel)}`);
      write(`${translate("Plan")}: ${planLabel} · ${intervalLabel}`);
      write(`${translate("Precio después")}: ${price}`);
      write(`${translate("Primer cobro")}: ${formatDate(data.contract.first_charge_at, locale, pendingLabel)}`);
      write(`${translate("Hash del contrato")}: ${data.contract.contract_snapshot_hash || pendingLabel}`);
      write(translate("Declaraciones obligatorias"), 12, true);
      Object.values(snapshot.acceptedText?.checkboxes || {}).forEach((label) => write(`✓ ${String(label)}`));
      write(translate("Cláusulas principales"), 12, true);
      (snapshot.clauses || []).forEach((clause: string) => write(`• ${clause}`));
      pdf.save(`regikaha-contract-${String(data.contract.id || "subscription")}.pdf`);
    } catch {
      setError(translate("No se pudo descargar el contrato"));
    }
  }

  return (
    <>
      <DashboardHeader
        title={translate("Suscripción")}
        subtitle={translate("Estado comercial de tu cuenta {role}. Sin suscripción activa no se reciben solicitudes ni oportunidades nuevas.").replace("{role}", roleLabel.toLowerCase())}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/precios" className="btn btn-primary text-sm">{translate("Activar o cambiar plan")}</Link>
            <Link href="/legal/politica-suscripcion" className="btn btn-secondary text-sm">{translate("Ver condiciones")}</Link>
          </div>
        }
      />

      {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!loading && !isActive && (
        <section className="mb-5 flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><AlertTriangle size={20} className="mt-0.5 shrink-0" /><div><h2 className="font-bold">{translate("Acceso comercial limitado")}</h2><p className="mt-1 text-sm">{translate("Puedes completar perfil, servicios y portfolio, pero no aparecerás activo ni recibirás nuevas oportunidades hasta activar contrato y suscripción.")}</p></div></div>
          <Link href="/suscripcion" className="btn btn-primary shrink-0">{translate("Activar acceso")}</Link>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<ShieldCheck size={19} />} label={translate("Estado")} value={loading ? translate("Cargando") : translate(statusLabels[status] || "Sin suscripción")} hint={isActive ? translate("Acceso comercial habilitado") : translate("Acceso comercial limitado")} />
        <StatCard icon={<CreditCard size={19} />} label={translate("Plan")} value={planLabel} hint={`${intervalLabel} · ${price}`} />
        <StatCard icon={<RefreshCw size={19} />} label={translate("Próxima fecha")} value={nextDate} hint={translate("Renovación, fin del periodo gratuito o revisión")} />
        <StatCard icon={<FileText size={19} />} label={translate("Contrato")} value={hasContract ? translate("Aceptado") : pendingLabel} hint={hasContract ? `${translate("Versión")} ${data?.contract?.contract_version || translate("registrada")}` : translate("Debe aceptarse antes de Stripe")} />
      </div>

      {!!data?.notifications?.length && (
        <section className="mt-6 border-y border-[var(--hairline)] py-5">
          <div className="flex items-center gap-2 font-bold text-ink"><Bell size={18} className="text-forest-600" /> {translate("Avisos de facturación")}</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.notifications.map((notice) => <li key={notice.id} className="rounded-md bg-canvas px-4 py-3 text-sm text-ink/80">{translate(notificationLabels[notice.type] || "Aviso de facturación")} · {formatDate(notice.scheduled_for, locale, pendingLabel)}</li>)}
          </ul>
        </section>
      )}

      <section className="card p-6 mt-6">
        <h2 className="font-bold text-ink">{translate("Resumen de acceso profesional")}</h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          {translate("La suscripción controla el acceso comercial: visibilidad activa, recepción de solicitudes, oportunidades B2B y herramientas profesionales. Si el estado pasa a pago pendiente, impagado, cancelado o vencido, los datos del perfil se conservan pero el acceso comercial queda limitado.")}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {subscription.stripe_customer_id ? <button type="button" onClick={openPortal} className="btn btn-secondary"><CreditCard size={16} /> {translate("Gestionar facturación")}</button> : null}
          {hasContract ? <button type="button" onClick={downloadContract} className="btn btn-secondary"><Download size={16} /> {translate("Descargar contrato")}</button> : null}
          <Link href="/precios" className="btn btn-primary">{translate("Elegir plan")}</Link>
        </div>
      </section>
    </>
  );
}
