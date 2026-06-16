"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MapPin, Phone, Plus, Send, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { QuoteStatusBadge } from "@/components/dashboard/QuoteStatusBadge";
import { getCategoryById } from "@/lib/data";
import { timeAgo } from "@/lib/utils";
import { preEstimateDisclaimer } from "@/lib/preestimate";

type LineItem = {
  description: string;
  quantity: string;
  unitPrice: string;
};

const emptyLine: LineItem = { description: "", quantity: "1", unitPrice: "0" };

function euro(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function QuoteRequestsManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("Pre-presupuesto inicial");
  const [summary, setSummary] = useState("");
  const [vatRate, setVatRate] = useState("21");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLine }]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/requests");
    const data = await res.json().catch(() => ({}));
    if (res.ok) setRequests(data.requests || []);
    else setError(data.error || "No se pudieron cargar las solicitudes");
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => {
      setError("No se pudieron cargar las solicitudes");
      setLoading(false);
    });
  }, []);

  const activeRequest = useMemo(() => requests.find((request) => request.id === activeId), [activeId, requests]);
  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
  const vat = subtotal * (Number(vatRate || 0) / 100);
  const total = subtotal + vat;

  function updateLine(index: number, key: keyof LineItem, value: string) {
    setLineItems((items) => items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function startProposal(request: any) {
    setActiveId(request.id);
    setTitle(`Pre-presupuesto inicial para ${request.clientName}`);
    setSummary("");
    setVatRate("21");
    setLineItems([{ ...emptyLine }]);
  }

  async function sendProposal() {
    if (!activeRequest) return;
    setSending(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quoteRequestId: activeRequest.id,
          clientEmail: activeRequest.clientEmail,
          title,
          summary,
          vatRate: Number(vatRate || 0),
          lineItems: lineItems.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity || 0),
            unitPrice: Number(item.unitPrice || 0),
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo enviar el pre-presupuesto");
      setMessage("Pre-presupuesto inicial guardado y marcado como enviado.");
      setActiveId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el pre-presupuesto");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Solicitudes de pre-presupuesto"
        subtitle="Clientes que han contactado a través de tu perfil. Desde aquí puedes enviar una estimación inicial no vinculante."
      />

      {(message || error) && (
        <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-mint text-forest-800"}`}>
          {error || message}
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-sm text-muted">Cargando solicitudes.</div>
      ) : requests.length === 0 ? (
        <div className="card p-8 text-sm text-muted">Aún no tienes solicitudes.</div>
      ) : (
        <div className="grid xl:grid-cols-[1fr_420px] gap-6 items-start">
          <div className="space-y-4">
            {requests.map((request) => {
              const cat = getCategoryById(request.categoryId);
              return (
                <article key={request.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-semibold text-ink">{request.clientName}</h2>
                        {cat && <span className="chip">{cat.name}</span>}
                      </div>
                      <p className="text-xs text-muted mt-1 inline-flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-forest-500" />{request.location || "Sin zona"}</span>
                        {request.budgetRange && <span>{request.budgetRange}</span>}
                        <span>{timeAgo(request.createdAt)}</span>
                      </p>
                    </div>
                    <QuoteStatusBadge status={request.status} />
                  </div>

                  <p className="mt-3 text-sm text-ink/80 leading-relaxed">{request.description}</p>

                  {request.estimates?.length > 0 && (
                    <div className="mt-4 rounded-xl bg-canvas p-3 text-sm">
                      <p className="font-medium text-ink">Último pre-presupuesto: {request.estimates[0].title}</p>
                      <p className="text-muted">{euro(request.estimates[0].totalEur)} · {request.estimates[0].status}</p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {request.clientEmail && (
                      <a href={`mailto:${request.clientEmail}`} className="btn btn-secondary text-sm py-2">
                        <Mail size={15} /> {request.clientEmail}
                      </a>
                    )}
                    {request.clientPhone && (
                      <a href={`tel:${request.clientPhone}`} className="btn btn-secondary text-sm py-2">
                        <Phone size={15} /> {request.clientPhone}
                      </a>
                    )}
                    <button onClick={() => startProposal(request)} className="btn btn-primary text-sm py-2">
                      <Send size={15} /> Enviar pre-presupuesto
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="card p-5 xl:sticky xl:top-24">
            {activeRequest ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Pre-presupuesto para</p>
                  <h2 className="mt-1 font-bold text-ink">{activeRequest.clientName}</h2>
                </div>
                <Input label="Título" value={title} onChange={setTitle} />
                <TextArea label="Resumen / alcance" rows={4} value={summary} onChange={setSummary} />
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={index} className="rounded-xl bg-canvas p-3 space-y-2">
                      <Input label="Concepto" value={item.description} onChange={(v) => updateLine(index, "description", v)} />
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                        <Input label="Cantidad" type="number" value={item.quantity} onChange={(v) => updateLine(index, "quantity", v)} />
                        <Input label="Precio unidad" type="number" value={item.unitPrice} onChange={(v) => updateLine(index, "unitPrice", v)} />
                        <button
                          onClick={() => setLineItems((items) => items.filter((_, i) => i !== index))}
                          className="grid h-10 w-10 place-items-center rounded-lg bg-white text-muted hover:text-red-600"
                          aria-label="Eliminar línea"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setLineItems((items) => [...items, { ...emptyLine }])} className="btn btn-secondary w-full text-sm">
                  <Plus size={16} /> Añadir línea
                </button>
                <Input label="IVA %" type="number" value={vatRate} onChange={setVatRate} />
                <div className="rounded-xl bg-ink p-4 text-white text-sm space-y-1">
                  <p className="flex justify-between"><span>Base</span><strong>{euro(subtotal)}</strong></p>
                  <p className="flex justify-between"><span>IVA</span><strong>{euro(vat)}</strong></p>
                  <p className="flex justify-between text-base"><span>Total</span><strong>{euro(total)}</strong></p>
                </div>
                <p className="text-xs text-muted leading-relaxed">{preEstimateDisclaimer}</p>
                <div className="flex gap-2">
                  <button onClick={sendProposal} disabled={sending} className="btn btn-primary flex-1 text-sm">
                    <Send size={16} /> {sending ? "Enviando..." : "Enviar"}
                  </button>
                  <button onClick={() => setActiveId(null)} className="btn btn-secondary text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Selecciona una solicitud para preparar un pre-presupuesto inicial no vinculante.</p>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="reg-input mt-1.5" />
    </label>
  );
}

function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (value: string) => void; rows: number }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="reg-input mt-1.5 resize-none" />
    </label>
  );
}
