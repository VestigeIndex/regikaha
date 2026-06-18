"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, FileDown, LockKeyhole, MailCheck, ShieldCheck } from "lucide-react";
import { CONTRACT_CHECKBOX_KEYS, addMonths, getProfessionalPlan, type ContractCheckboxKey } from "@/lib/billing/subscription";
import { formatEuro, type BillingInterval, type ProfessionalPlanId } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const tabs = ["summary", "price", "use", "verification", "ranking", "cancellation", "suspension", "privacy", "full"] as const;
type Tab = (typeof tabs)[number];

const tabLabels: Record<Tab, string> = {
  summary: "Resumen", price: "Precio y renovación", use: "Uso permitido", verification: "Verificación",
  ranking: "Ranking y reseñas", cancellation: "Cancelación", suspension: "Suspensión",
  privacy: "Privacidad y documentos", full: "Contrato completo",
};

const sections: Record<Tab, { title: string; paragraphs: string[] }> = {
  summary: { title: "Lo esencial antes de aceptar", paragraphs: ["La suscripción habilita herramientas profesionales, visibilidad legítima y gestión de oportunidades. RegiKaha no ejecuta obras ni garantiza clientes o ingresos.", "El precio futuro, la fecha de primer cobro, la renovación y la consecuencia de impago se muestran en el resumen fijo."] },
  price: { title: "Precio, impuestos y renovación", paragraphs: ["El importe indicado no incluye IVA/VAT cuando corresponda. La renovación utiliza el intervalo seleccionado y el precio mostrado al aceptar.", "Si eres fundador, hoy pagas 0 €. Stripe crea una suscripción real y recoge método de pago para el cobro futuro salvo que la configuración aplicable indique lo contrario."] },
  use: { title: "Uso profesional permitido", paragraphs: ["Puedes completar perfil, publicar servicios, portfolio y zonas; con suscripción activa puedes recibir solicitudes y responder oportunidades.", "No se permite spam, suplantación, documentos falsos, captación engañosa, reventa de datos ni manipulación de reseñas."] },
  verification: { title: "Suscripción y verificación", paragraphs: ["Pagar no equivale a identidad verificada. RegiKaha separa suscripción activa, identidad, empresa y documentación verificadas.", "Debes mantener información veraz, licencias, seguros y registros aplicables a tu actividad y país."] },
  ranking: { title: "Ranking justo y reseñas", paragraphs: ["La suscripción no compra posiciones. El orden se basa en relevancia, zona, calidad del perfil, respuesta, experiencia y reputación legítima.", "Está prohibido comprar, inventar, coaccionar o manipular reseñas."] },
  cancellation: { title: "Cancelación y renovación", paragraphs: ["Puedes gestionar o cancelar desde el portal de facturación. La cancelación evita renovaciones futuras según el momento y condiciones comunicadas.", "La cancelación no borra perfil, portfolio o reseñas, pero puede limitar el acceso comercial al terminar el periodo activo."] },
  suspension: { title: "Impago y suspensión comercial", paragraphs: ["Los estados past_due, unpaid, cancelled o expired limitan nuevas solicitudes, contacto comercial y oportunidades B2B.", "El usuario conserva acceso al panel para actualizar datos, consultar condiciones y reactivar el plan."] },
  privacy: { title: "Privacidad, documentos y prueba", paragraphs: ["RegiKaha guarda versiones legales, precios, fechas, checkboxes, hash del contrato y huellas técnicas hasheadas para acreditar la aceptación.", "Los documentos se usan para verificación y no deben publicarse como información abierta."] },
  full: { title: "Contrato completo de suscripción", paragraphs: ["Este contrato incorpora los Términos Profesionales, Política de Verificación, Política de Reseñas, ranking justo, Política de Suscripción y Privacidad vigentes en la versión indicada.", "El profesional responde de presupuestos, facturación, licencias, seguros, personal, prevención y ejecución. RegiKaha actúa como plataforma tecnológica de intermediación.", "RegiKaha no garantiza un número mínimo de solicitudes, clientes, ingresos o presupuestos. El pago no mejora artificialmente el ranking."] },
};

const checkboxLabels: Record<ContractCheckboxKey, string> = {
  professionalTerms: "Acepto los Términos Profesionales",
  verificationPolicy: "Acepto la Política de Verificación",
  reviewsPolicy: "Acepto la Política de Reseñas",
  fairRankingPolicy: "Acepto la Política de Ranking Justo",
  renewalCancellationPolicy: "Acepto la política de suscripción, renovación y cancelación",
  futurePaymentUnderstood: "Entiendo el precio futuro y que hoy pago 0 € solo si mi plaza fundador está disponible",
  accessLimitationUnderstood: "Entiendo que sin suscripción activa perderé visibilidad y nuevas solicitudes",
  truthfulInformation: "Declaro que la información aportada es veraz",
  professionalResponsibility: "Declaro que soy responsable de licencias, seguros, facturación, presupuestos y ejecución",
};

export function SubscriptionContractModal() {
  const params = useSearchParams();
  const { locale } = useI18n();
  const planId = (params.get("plan") === "europa_pro" ? "europa_pro" : "autonomo_nacional") as ProfessionalPlanId;
  const interval = (params.get("interval") === "yearly" ? "yearly" : "monthly") as BillingInterval;
  const founderRequested = params.get("founder") === "true";
  const plan = getProfessionalPlan(planId);
  const futurePrice = interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const periodUnit = interval === "monthly"
    ? ({ es: "mes", fr: "mois", it: "mese", pt: "mês", de: "Monat", nl: "maand", en: "month" } as const)[locale]
    : ({ es: "año", fr: "an", it: "anno", pt: "ano", de: "Jahr", nl: "jaar", en: "year" } as const)[locale];
  const taxLabel = ({ es: "IVA", fr: "TVA", it: "IVA", pt: "IVA", de: "MwSt.", nl: "btw", en: "VAT" } as const)[locale];
  const [founderTrialMonths, setFounderTrialMonths] = useState(5);
  const trialEnd = useMemo(() => addMonths(new Date(), founderTrialMonths), [founderTrialMonths]);
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [me, setMe] = useState<any>(null);
  const [founderAvailable, setFounderAvailable] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/me").then((response) => response.json()),
      fetch("/api/billing/founder-status").then((response) => response.json()),
    ]).then(([meData, founderData]) => {
      if (!cancelled) {
        setMe(meData);
        setFounderAvailable(founderData.available !== false);
        setFounderTrialMonths(Number(founderData.trialMonths || 5));
        setLoadingUser(false);
      }
    }).catch(() => { if (!cancelled) setLoadingUser(false); });
    return () => { cancelled = true; };
  }, []);

  const founder = founderRequested && founderAvailable;
  const acceptedCount = CONTRACT_CHECKBOX_KEYS.filter((key) => checked[key]).length;
  const allAccepted = acceptedCount === CONTRACT_CHECKBOX_KEYS.length;
  const firstCharge = founder ? trialEnd : new Date();

  async function resendVerification() {
    setResending(true); setMessage(null);
    try {
      const response = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo enviar el email");
      setMessage("Email enviado. Revisa también spam o promociones.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo enviar el email"); }
    finally { setResending(false); }
  }

  async function acceptAndCheckout() {
    if (!allAccepted) { setMessage("Debes aceptar todas las declaraciones obligatorias."); return; }
    setPending(true); setMessage(null);
    try {
      const contractResponse = await fetch("/api/billing/contract", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: planId, interval, founder, locale, checkboxes: checked }),
      });
      const contract = await contractResponse.json().catch(() => ({}));
      if (!contractResponse.ok) throw new Error(contract.error || "No se pudo guardar el contrato");
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: planId, interval, acceptanceId: contract.acceptanceId }),
      });
      const checkout = await checkoutResponse.json().catch(() => ({}));
      if (!checkoutResponse.ok || !checkout.url) throw new Error(checkout.error || "No se pudo abrir Stripe");
      window.location.href = checkout.url;
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo activar la suscripción"); setPending(false); }
  }

  if (loadingUser) return <div className="card p-8 text-center text-sm text-muted">Preparando contrato seguro...</div>;
  if (!me?.authenticated) {
    const next = `/suscripcion/confirmar?plan=${planId}&interval=${interval}${founderRequested ? "&founder=true" : ""}`;
    return <Gate icon={LockKeyhole} title="Inicia sesión para continuar" text="El contrato debe quedar vinculado a una cuenta identificada." actions={<><Link href={`/login?next=${encodeURIComponent(next)}`} className="btn btn-primary">Iniciar sesión</Link><Link href={`/registro/profesional?plan=${planId}&interval=${interval}${founderRequested ? "&founder=true" : ""}`} className="btn btn-secondary">Crear cuenta</Link></>} />;
  }
  if (!me.user?.emailVerified) {
    return <Gate icon={MailCheck} title="Verifica tu email" text={`Hemos enviado la verificación a ${me.user?.email || "tu dirección"}. El contrato no puede activarse antes de confirmar el email.`} actions={<><button onClick={resendVerification} disabled={resending} className="btn btn-primary">{resending ? "Enviando..." : "Reenviar verificación"}</button><Link href="/panel" className="btn btn-secondary">Ir al panel</Link></>} message={message} />;
  }

  const section = sections[activeTab];
  return (
    <div className="subscription-contract" role="dialog" aria-modal="true" aria-labelledby="contract-title">
      <header className="contract-header">
        <div>
          <Link href="/suscripcion" className="inline-flex items-center gap-1 text-sm text-muted hover:text-forest-700"><ArrowLeft size={15} /> Volver a planes</Link>
          <h1 id="contract-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Contrato de suscripción</h1>
          <p className="mt-1 text-sm text-muted">Lee las condiciones y acepta cada declaración. Ninguna casilla está premarcada.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="btn btn-secondary contract-print"><FileDown size={16} /> Imprimir o guardar PDF</button>
      </header>

      <div className="contract-progress"><span style={{ width: `${Math.round((acceptedCount / CONTRACT_CHECKBOX_KEYS.length) * 100)}%` }} /></div>
      <div className="contract-grid">
        <nav className="contract-tabs" aria-label="Secciones del contrato">
          {tabs.map((tab) => <button type="button" key={tab} onClick={() => setActiveTab(tab)} className={cn("contract-tab", activeTab === tab && "is-active")}>{tabLabels[tab]}<ChevronRight size={14} /></button>)}
        </nav>

        <main className="contract-content">
          <div className="contract-mobile-tabs">{tabs.map((tab) => <button type="button" key={tab} onClick={() => setActiveTab(tab)} className={cn("contract-mobile-tab", activeTab === tab && "is-active")}>{tabLabels[tab]}</button>)}</div>
          <section className="contract-copy">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {activeTab === "full" && <div className="mt-5 flex flex-wrap gap-3 text-sm"><Link className="text-forest-700 underline" href="/legal/terminos-profesionales">Términos profesionales</Link><Link className="text-forest-700 underline" href="/legal/politica-suscripcion">Política de suscripción</Link><Link className="text-forest-700 underline" href="/legal/privacidad">Privacidad</Link></div>}
          </section>

          <section className="contract-checks">
            <div className="flex items-center justify-between gap-4"><h2>Declaraciones obligatorias</h2><span className="text-xs font-semibold text-forest-700">{acceptedCount}/{CONTRACT_CHECKBOX_KEYS.length}</span></div>
            <div className="mt-4 space-y-2">
              {CONTRACT_CHECKBOX_KEYS.map((key) => (
                <label key={key} className={cn("contract-check", checked[key] && "is-checked")}>
                  <input type="checkbox" checked={!!checked[key]} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} />
                  <span className="contract-check-icon">{checked[key] ? <Check size={13} /> : null}</span>
                  <span>{checkboxLabels[key]}</span>
                </label>
              ))}
            </div>
          </section>
        </main>

        <aside className="contract-summary">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700"><ShieldCheck size={17} /> Resumen vinculante</span>
          <dl className="mt-5 space-y-3 text-sm">
            <SummaryRow label="Plan" value={plan.name} />
            <SummaryRow label="Precio hoy" value={founder ? "0 €" : `${formatEuro(futurePrice, locale)} + ${taxLabel}`} strong />
            <SummaryRow label="Precio después" value={`${formatEuro(futurePrice, locale)} /${periodUnit} + ${taxLabel}`} />
            <SummaryRow label="Primer cobro" value={new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(firstCharge)} />
            <SummaryRow label="Renovación" value={interval === "monthly" ? "Mensual" : "Anual"} />
            <SummaryRow label="Si no se paga" value="Acceso comercial limitado" />
          </dl>
          {founderRequested && !founderAvailable ? <p className="mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">Las plazas fundador se han agotado. Continuarás con el plan normal.</p> : null}
          <p className="mt-5 text-xs leading-relaxed text-muted">Puedes cancelar desde el portal de facturación. RegiKaha no garantiza leads ni compra posiciones.</p>
          {message && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p>}
          <button type="button" onClick={acceptAndCheckout} disabled={pending || !allAccepted} className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "Abriendo Stripe..." : founder ? "Aceptar y activar 0 €" : "Aceptar y suscribirme"}
          </button>
        </aside>
      </div>

      <div className="contract-mobile-action">
        <div><span className="block text-xs text-muted">Hoy</span><strong>{founder ? "0 €" : formatEuro(futurePrice, locale)}</strong></div>
        <button type="button" onClick={acceptAndCheckout} disabled={pending || !allAccepted} className="btn btn-primary disabled:opacity-50">{pending ? "Abriendo..." : "Aceptar contrato"}</button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className="flex items-start justify-between gap-4 border-b border-[var(--hairline)] pb-3"><dt className="text-muted">{label}</dt><dd className={cn("text-right text-ink", strong && "font-bold text-forest-800")}>{value}</dd></div>; }

function Gate({ icon: Icon, title, text, actions, message }: { icon: typeof LockKeyhole; title: string; text: string; actions: ReactNode; message?: string | null }) {
  return <section className="card mx-auto max-w-xl p-7 text-center sm:p-10"><span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-forest-500/10 text-forest-700"><Icon size={26} /></span><h1 className="mt-5 text-2xl font-bold text-ink">{title}</h1><p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>{message && <p className="mt-4 rounded-md bg-mint p-3 text-sm text-forest-800">{message}</p>}<div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">{actions}</div></section>;
}
