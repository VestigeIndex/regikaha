"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Calculator, Check, FileText, Plus, RotateCcw, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { countryBusinessConfig, formatBusinessMoney } from "@/lib/country-business";
import { useI18n } from "@/lib/i18n/context";
import { businessToolsDictionaries } from "@/lib/i18n/business-tools";
import { cn } from "@/lib/utils";

type ToolTab = "planner" | "templates" | "calculator";
type Line = { description: string; quantity: string; unitPrice: string };
const emptyLine: Line = { description: "", quantity: "1", unitPrice: "0" };

export function BusinessToolsManager() {
  const { locale } = useI18n();
  const copy = businessToolsDictionaries[locale];
  const [tab, setTab] = useState<ToolTab>("planner");
  const [tasks, setTasks] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [country, setCountry] = useState("ES");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/tools", { cache: "no-store", credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || copy.common.error);
    setTasks(data.tasks || []);
    setTemplates(data.templates || []);
    setCountry(data.context?.country || "ES");
    setLoading(false);
  }, [copy.common.error]);

  useEffect(() => {
    load().catch(() => {
      setMessage(copy.common.error);
      setLoading(false);
    });
  }, [copy.common.error, load]);

  async function mutate(payload: Record<string, unknown>) {
    setMessage(null);
    const response = await fetch("/api/tools", {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || copy.common.error);
    setMessage(copy.common.saved);
    await load();
  }

  const tabs: { id: ToolTab; label: string; icon: typeof CalendarDays }[] = [
    { id: "planner", label: copy.tabs.planner, icon: CalendarDays },
    { id: "templates", label: copy.tabs.templates, icon: FileText },
    { id: "calculator", label: copy.tabs.calculator, icon: Calculator },
  ];

  return (
    <>
      <DashboardHeader title={copy.title} subtitle={copy.subtitle} />
      <div className="mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-canvas-alt p-1" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-semibold", tab === id ? "bg-white text-ink shadow-soft" : "text-muted hover:text-ink")}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      {message && <p className="mb-5 rounded-lg bg-mint px-4 py-3 text-sm text-forest-800" role="status">{message}</p>}
      {loading ? (
        <div className="rounded-lg border hairline bg-white p-8 text-sm text-muted">{copy.common.loading}</div>
      ) : (
        <>
          {tab === "planner" && <Planner tasks={tasks} copy={copy} mutate={mutate} locale={locale} />}
          {tab === "templates" && <Templates templates={templates} copy={copy} mutate={mutate} country={country} locale={locale} />}
          {tab === "calculator" && <ProfitCalculator copy={copy} country={country} locale={locale} />}
        </>
      )}
    </>
  );
}

function Planner({ tasks, copy, mutate, locale }: { tasks: any[]; copy: ReturnType<typeof getCopy>; mutate: (payload: Record<string, unknown>) => Promise<void>; locale: string }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("normal");

  async function add() {
    if (title.trim().length < 3) return;
    await mutate({ action: "task.create", title, dueDate, priority });
    setTitle("");
    setDueDate("");
    setPriority("normal");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="rounded-lg border hairline bg-white p-5">
        <h2 className="text-lg font-bold text-ink">{copy.planner.title}</h2>
        <p className="mt-1 text-sm text-muted">{copy.planner.text}</p>
        <div className="mt-5 space-y-4">
          <Field label={copy.planner.task}><input className="reg-input" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label={copy.planner.due}><input className="reg-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></Field>
          <Field label={copy.planner.priority}>
            <select className="reg-input" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="low">{copy.planner.priorities.low}</option>
              <option value="normal">{copy.planner.priorities.normal}</option>
              <option value="high">{copy.planner.priorities.high}</option>
            </select>
          </Field>
          <button type="button" onClick={() => add().catch(() => undefined)} className="btn btn-primary w-full"><Plus size={16} /> {copy.planner.add}</button>
        </div>
      </div>
      <div className="min-w-0">
        {tasks.length === 0 ? <p className="rounded-lg border hairline bg-white p-8 text-sm text-muted">{copy.planner.empty}</p> : (
          <div className="divide-y hairline rounded-lg border hairline bg-white">
            {tasks.map((task) => (
              <article key={task.id} className={cn("flex flex-wrap items-center gap-3 p-4", task.status === "done" && "opacity-60")}>
                <button type="button" onClick={() => mutate({ action: "task.update", id: task.id, title: task.title, dueDate: task.due_date, priority: task.priority, status: task.status === "done" ? "open" : "done" }).catch(() => undefined)} className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border", task.status === "done" ? "border-forest-600 bg-forest-600 text-white" : "hairline text-forest-700")} aria-label={task.status === "done" ? copy.planner.reopen : copy.planner.done} title={task.status === "done" ? copy.planner.reopen : copy.planner.done}>
                  {task.status === "done" ? <RotateCcw size={16} /> : <Check size={16} />}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className={cn("font-semibold text-ink", task.status === "done" && "line-through")}>{task.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {task.due_date ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(task.due_date + "T12:00:00")) : "—"} · {copy.planner.priorities[task.priority as "low" | "normal" | "high"] || copy.planner.priorities.normal}
                  </p>
                </div>
                <button type="button" onClick={() => mutate({ action: "task.delete", id: task.id }).catch(() => undefined)} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label={copy.planner.remove} title={copy.planner.remove}><Trash2 size={16} /></button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Templates({ templates, copy, mutate, country, locale }: { templates: any[]; copy: ReturnType<typeof getCopy>; mutate: (payload: Record<string, unknown>) => Promise<void>; country: string; locale: any }) {
  const config = countryBusinessConfig(country, locale);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [vatRate, setVatRate] = useState(String(config.defaultTaxRate));
  const [lines, setLines] = useState<Line[]>([{ ...emptyLine }]);

  useEffect(() => setVatRate(String(config.defaultTaxRate)), [config.defaultTaxRate]);

  async function save() {
    if (name.trim().length < 3) return;
    await mutate({ action: "template.create", name, summary, vatRate: Number(vatRate), lineItems: lines.map((line) => ({ description: line.description, quantity: Number(line.quantity), unitPrice: Number(line.unitPrice) })) });
    setName("");
    setSummary("");
    setLines([{ ...emptyLine }]);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-lg border hairline bg-white p-5">
        <h2 className="text-lg font-bold text-ink">{copy.templates.title}</h2>
        <p className="mt-1 text-sm text-muted">{copy.templates.text}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label={copy.templates.name}><input className="reg-input" value={name} onChange={(event) => setName(event.target.value)} /></Field>
          <Field label={config.taxLabel + " %"}><input className="reg-input" type="number" step="0.1" value={vatRate} onChange={(event) => setVatRate(event.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label={copy.templates.summary}><textarea className="reg-input resize-none" rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} /></Field></div>
        </div>
        <div className="mt-5 space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="grid gap-2 rounded-lg bg-canvas p-3 sm:grid-cols-[1fr_100px_130px_auto] sm:items-end">
              <Field label={copy.templates.concept}><input className="reg-input" value={line.description} onChange={(event) => setLines((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} /></Field>
              <Field label={copy.templates.quantity}><input className="reg-input" type="number" value={line.quantity} onChange={(event) => setLines((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: event.target.value } : item))} /></Field>
              <Field label={copy.templates.unitPrice}><input className="reg-input" type="number" value={line.unitPrice} onChange={(event) => setLines((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, unitPrice: event.target.value } : item))} /></Field>
              <button type="button" onClick={() => setLines((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="grid h-10 w-10 place-items-center rounded-lg bg-white text-muted hover:text-red-700" aria-label={copy.templates.remove}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setLines((current) => [...current, { ...emptyLine }])} className="btn btn-secondary"><Plus size={16} /> {copy.templates.addLine}</button>
          <button type="button" onClick={() => save().catch(() => undefined)} className="btn btn-primary"><FileText size={16} /> {copy.templates.save}</button>
        </div>
      </div>
      <div>
        {templates.length === 0 ? <p className="rounded-lg border hairline bg-white p-6 text-sm text-muted">{copy.templates.empty}</p> : (
          <div className="divide-y hairline rounded-lg border hairline bg-white">
            {templates.map((template) => (
              <article key={template.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="font-bold text-ink">{template.name}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{template.summary}</p></div>
                  <button type="button" onClick={() => mutate({ action: "template.delete", id: template.id }).catch(() => undefined)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label={copy.templates.remove}><Trash2 size={16} /></button>
                </div>
                <p className="mt-3 text-xs font-semibold text-forest-700">{config.taxLabel} {Number(template.vat_rate || 0)}% · {formatBusinessMoney((template.line_items || []).reduce((sum: number, line: any) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0), 0), country, locale)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProfitCalculator({ copy, country, locale }: { copy: ReturnType<typeof getCopy>; country: string; locale: any }) {
  const config = countryBusinessConfig(country, locale);
  const [values, setValues] = useState({ labour: "0", materials: "0", subcontracting: "0", overhead: "10", margin: "20", vat: String(config.defaultTaxRate) });
  useEffect(() => setValues((current) => ({ ...current, vat: String(config.defaultTaxRate) })), [config.defaultTaxRate]);
  const totals = useMemo(() => {
    const direct = Number(values.labour || 0) + Number(values.materials || 0) + Number(values.subcontracting || 0);
    const costs = direct * (1 + Math.max(0, Number(values.overhead || 0)) / 100);
    const margin = Math.min(95, Math.max(0, Number(values.margin || 0))) / 100;
    const net = margin >= 1 ? costs : costs / (1 - margin);
    const profit = net - costs;
    const total = net * (1 + Math.max(0, Number(values.vat || 0)) / 100);
    return { costs, net, profit, total };
  }, [values]);
  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="rounded-lg border hairline bg-white p-5">
        <h2 className="text-lg font-bold text-ink">{copy.calculator.title}</h2>
        <p className="mt-1 text-sm text-muted">{copy.calculator.text}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MoneyField label={copy.calculator.labour} currency={config.currency} value={values.labour} onChange={(value) => update("labour", value)} />
          <MoneyField label={copy.calculator.materials} currency={config.currency} value={values.materials} onChange={(value) => update("materials", value)} />
          <MoneyField label={copy.calculator.subcontracting} currency={config.currency} value={values.subcontracting} onChange={(value) => update("subcontracting", value)} />
          <Field label={copy.calculator.overhead}><input className="reg-input" type="number" step="0.1" value={values.overhead} onChange={(event) => update("overhead", event.target.value)} /></Field>
          <Field label={copy.calculator.margin}><input className="reg-input" type="number" step="0.1" value={values.margin} onChange={(event) => update("margin", event.target.value)} /></Field>
          <Field label={config.taxLabel + " %"}><input className="reg-input" type="number" step="0.1" value={values.vat} onChange={(event) => update("vat", event.target.value)} /></Field>
        </div>
      </div>
      <div className="rounded-lg bg-ink p-6 text-white">
        <Result label={copy.calculator.costs} value={formatBusinessMoney(totals.costs, country, locale)} />
        <Result label={copy.calculator.netQuote} value={formatBusinessMoney(totals.net, country, locale)} />
        <Result label={copy.calculator.profit} value={formatBusinessMoney(totals.profit, country, locale)} />
        <div className="mt-5 border-t border-white/15 pt-5"><Result label={copy.calculator.customerTotal} value={formatBusinessMoney(totals.total, country, locale)} large /></div>
      </div>
    </section>
  );
}

function getCopy() {
  return businessToolsDictionaries.es;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase text-muted">{label}</span>{children}</label>; }
function MoneyField({ label, currency, value, onChange }: { label: string; currency: string; value: string; onChange: (value: string) => void }) { return <Field label={label}><div className="relative"><input className="reg-input pr-14" type="number" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">{currency}</span></div></Field>; }
function Result({ label, value, large }: { label: string; value: string; large?: boolean }) { return <p className="flex items-center justify-between gap-4 py-2"><span className="text-white/70">{label}</span><strong className={large ? "text-xl" : "text-base"}>{value}</strong></p>; }
