"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Coins,
  Languages,
  LockKeyhole,
  MapPin,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  WalletCards,
} from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { categories } from "@/lib/data";
import { europeanCountryOptions } from "@/lib/market";
import { leadInvalidReasons, minorMoney } from "@/lib/leads";
import { useI18n } from "@/lib/i18n/context";
import { useContent } from "@/lib/i18n/useLocalizedContent";
import { leadMarketplaceDictionaries } from "@/lib/i18n/leads";

type View = "opportunities" | "balance" | "preferences";

export function LeadMarketplacePanel({ view }: { view: View }) {
  const { locale } = useI18n();
  const content = useContent();
  const copy = leadMarketplaceDictionaries[locale];
  const [data, setData] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [report, setReport] = useState<{ unlockId: string; reason: string; details: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = view === "preferences" ? "/api/leads/preferences" : view === "balance" ? "/api/leads/balance" : "/api/leads/opportunities";
      const response = await fetch(endpoint, { cache: "no-store", credentials: "same-origin" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(copy.loadError);
      if (view === "preferences") setPreferences(result.preferences);
      else setData(result);
    } catch {
      setError(copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError, view]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const header = {
    opportunities: [copy.opportunities, copy.opportunitiesSubtitle],
    balance: [copy.balance, copy.balanceSubtitle],
    preferences: [copy.preferences, copy.preferencesSubtitle],
  }[view];

  if (loading) {
    return (
      <>
        <DashboardHeader title={header[0]} subtitle={header[1]} />
        <div className="card p-8 text-sm text-muted" role="status">{copy.loading}</div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title={header[0]} subtitle={header[1]} />
      {(error || message) && (
        <div className={`mb-5 rounded-lg px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-mint text-forest-800"}`}>
          {error || message}
        </div>
      )}
      <FairRankingNotice copy={copy} />
      {view === "opportunities" && (
        <OpportunitiesView
          data={data}
          copy={copy}
          locale={locale}
          content={content}
          pendingId={pendingId}
          onUnlock={async (leadId: string) => {
            setPendingId(leadId);
            setError(null);
            const response = await fetch("/api/leads/opportunities", {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({ leadId }),
            });
            const result = await response.json().catch(() => ({}));
            setPendingId(null);
            if (!response.ok) {
              setError(result.error === "insufficient_balance" ? copy.insufficientBalance : result.error === "lead_full" || result.error === "lead_unavailable" ? copy.leadUnavailable : copy.unlockError);
              return;
            }
            await load();
          }}
          onReport={(unlockId: string) => setReport({ unlockId, reason: leadInvalidReasons[0], details: "" })}
        />
      )}
      {view === "balance" && (
        <BalanceView
          data={data}
          copy={copy}
          locale={locale}
          pendingId={pendingId}
          onTopup={async (amount: number) => {
            setPendingId(String(amount));
            const response = await fetch("/api/leads/balance", {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({ amount }),
            });
            const result = await response.json().catch(() => ({}));
            setPendingId(null);
            if (!response.ok || !result.url) {
              setError(copy.loadError);
              return;
            }
            window.location.assign(result.url);
          }}
        />
      )}
      {view === "preferences" && preferences && (
        <PreferencesView
          value={preferences}
          copy={copy}
          locale={locale}
          content={content}
          onSave={async (next: any) => {
            setPendingId("save");
            const response = await fetch("/api/leads/preferences", {
              method: "PUT",
              headers: { "content-type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify(next),
            });
            setPendingId(null);
            if (!response.ok) {
              setError(copy.loadError);
              return;
            }
            setPreferences(next);
            setMessage(copy.saved);
          }}
          saving={pendingId === "save"}
        />
      )}
      {report && (
        <ReportDialog
          value={report}
          copy={copy}
          onChange={setReport}
          onClose={() => setReport(null)}
          onSubmit={async () => {
            const response = await fetch("/api/leads/report", {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify(report),
            });
            if (!response.ok) {
              setError(copy.loadError);
              return;
            }
            setReport(null);
            setMessage(copy.reportSent);
          }}
        />
      )}
    </>
  );
}

function FairRankingNotice({ copy }: { copy: any }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-forest-600/15 bg-mint/55 p-4">
      <ShieldCheck className="mt-0.5 shrink-0 text-forest-700" size={20} />
      <div><p className="font-semibold text-ink">{copy.noRankingTitle}</p><p className="mt-1 text-sm leading-relaxed text-ink/75">{copy.noRankingText}</p></div>
    </div>
  );
}

function OpportunitiesView({ data, copy, locale, content, pendingId, onUnlock, onReport }: any) {
  if (data?.subscriptionRequired) {
    return (
      <section className="card p-7 text-center">
        <LockKeyhole className="mx-auto text-forest-600" size={32} />
        <h2 className="mt-4 text-xl font-bold text-ink">{copy.subscriptionTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy.subscriptionText}</p>
        <Link href="/suscripcion" className="btn btn-primary mt-5">{copy.activatePlan}</Link>
      </section>
    );
  }
  const leads = data?.leads || [];
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        {!leads.length && <div className="card p-8 text-center"><Radar className="mx-auto text-forest-500" size={32} /><h2 className="mt-4 font-bold text-ink">{copy.emptyTitle}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-muted">{copy.emptyText}</p></div>}
        {leads.map((lead: any) => {
          const category = content.categories[lead.categoryId];
          return (
            <article key={lead.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-forest-700">{copy.compatibleLead}</p>
                  <h2 className="mt-1 text-lg font-bold text-ink">{category?.name || lead.title}</h2>
                  <p className="mt-1 inline-flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><MapPin size={13} /> {[lead.city, lead.region, lead.country].filter(Boolean).join(", ")}</span>
                    <span>{copy.clientLanguage}: {String(lead.locale || "").toUpperCase()}</span>
                  </p>
                </div>
                <span className="chip">{copy.quality}: {lead.qualityScore}/100</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">{lead.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Mini label={copy.budget} value={lead.budgetRange || "-"} />
                <Mini label={copy.urgency} value={lead.urgency || "-"} />
                <Mini label={copy.slots} value={lead.remainingSlots > 0 ? `${lead.remainingSlots} ${copy.slotsLeft}` : copy.full} />
                <Mini label={copy.contactPrice} value={minorMoney(lead.price, lead.currency, locale)} />
              </div>
              {lead.unlocked ? (
                <div className="mt-5 rounded-lg bg-canvas p-4">
                  <p className="font-semibold text-ink">{copy.contactDetails}</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <span>{lead.contact?.name || "-"}</span>
                    {lead.contact?.email && <a className="text-forest-700 underline" href={`mailto:${lead.contact.email}`}>{lead.contact.email}</a>}
                    {lead.contact?.phone && <a className="text-forest-700 underline" href={`tel:${lead.contact.phone}`}>{lead.contact.phone}</a>}
                  </div>
                  <button type="button" onClick={() => onReport(lead.unlockId)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
                    <AlertTriangle size={14} /> {copy.reportInvalid}
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => onUnlock(lead.id)} disabled={pendingId === lead.id || lead.remainingSlots <= 0} className="btn btn-primary mt-5 w-full sm:w-auto disabled:opacity-50">
                  <LockKeyhole size={16} /> {pendingId === lead.id ? copy.unlocking : lead.remainingSlots <= 0 ? copy.full : `${copy.unlock} · ${minorMoney(lead.price, lead.currency, locale)}`}
                </button>
              )}
            </article>
          );
        })}
      </div>
      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <StatCard icon={<WalletCards size={19} />} label={copy.available} value={minorMoney(data?.balance?.available || 0, data?.balance?.currency || "EUR", locale)} />
        <Link href="/panel/saldo" className="btn btn-secondary w-full"><Coins size={16} /> {copy.addBalance}</Link>
        <Link href="/panel/preferencias" className="btn btn-secondary w-full"><SlidersHorizontal size={16} /> {copy.preferences}</Link>
      </aside>
    </div>
  );
}

function BalanceView({ data, copy, locale, pendingId, onTopup }: any) {
  const balance = data?.balance || { currency: "EUR", promotional: 0, paid: 0, reserved: 0, available: 0 };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<WalletCards size={19} />} label={copy.available} value={minorMoney(balance.available, balance.currency, locale)} />
        <StatCard icon={<Coins size={19} />} label={copy.promotional} value={minorMoney(balance.promotional, balance.currency, locale)} />
        <StatCard icon={<Coins size={19} />} label={copy.paid} value={minorMoney(balance.paid, balance.currency, locale)} />
        <StatCard icon={<LockKeyhole size={19} />} label={copy.reserved} value={minorMoney(balance.reserved, balance.currency, locale)} />
      </div>
      <section className="card p-6">
        <h2 className="font-bold text-ink">{copy.addBalance}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[2500, 5000, 10000, 20000].map((amount) => (
            <button key={amount} type="button" onClick={() => onTopup(amount)} disabled={pendingId === String(amount)} className="btn btn-secondary">
              {pendingId === String(amount) ? copy.topupPending : `${copy.topup} ${minorMoney(amount, balance.currency, locale)}`}
            </button>
          ))}
        </div>
      </section>
      <section className="card p-6">
        <h2 className="font-bold text-ink">{copy.transactions}</h2>
        {!data?.transactions?.length ? <p className="mt-3 text-sm text-muted">{copy.noTransactions}</p> : (
          <div className="mt-3 divide-y divide-[var(--hairline)]">
            {data.transactions.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div><p className="font-medium text-ink">{copy.transactionLabels[transaction.reference_type] || transaction.description}</p><p className="text-xs text-muted">{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(transaction.created_at))}</p></div>
                <strong className={transaction.amount >= 0 ? "text-forest-700" : "text-ink"}>{transaction.amount >= 0 ? "+" : ""}{minorMoney(transaction.amount, balance.currency, locale)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PreferencesView({ value, copy, locale, content, onSave, saving }: any) {
  const [form, setForm] = useState(() => ({
    ...value,
    countries: value.countries || [],
    categories: value.categories || [],
    languagesText: (value.languages || []).join(", "),
    minBudgetMajor: Number(value.minBudget || 0) / 100,
    weeklyBudgetMajor: Number(value.weeklyBudget || 0) / 100,
  }));
  const toggle = (key: "countries" | "categories", item: string) => setForm((current: any) => ({
    ...current,
    [key]: current[key].includes(item) ? current[key].filter((entry: string) => entry !== item) : [...current[key], item],
  }));
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-bold text-ink">{copy.countries}</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {europeanCountryOptions.map((market) => (
            <label key={market.code} className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-sm">
              <input type="checkbox" checked={form.countries.includes(market.code)} onChange={() => toggle("countries", market.code)} />
              {new Intl.DisplayNames([locale], { type: "region" }).of(market.code)}
            </label>
          ))}
        </div>
      </section>
      <section className="card p-6">
        <h2 className="font-bold text-ink">{copy.categories}</h2>
        <p className="mt-1 text-sm text-muted">{copy.allCompatibleCategories}</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-sm">
              <input type="checkbox" checked={form.categories.includes(category.id)} onChange={() => toggle("categories", category.id)} />
              {content.categories[category.id].name}
            </label>
          ))}
        </div>
      </section>
      <section className="card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.maxDistance}><input className="reg-input" type="number" min={5} max={500} value={form.maxDistanceKm} onChange={(event) => setForm({ ...form, maxDistanceKm: Number(event.target.value) })} /></Field>
          <Field label={copy.minimumBudget}><input className="reg-input" type="number" min={0} value={form.minBudgetMajor} onChange={(event) => setForm({ ...form, minBudgetMajor: Number(event.target.value) })} /></Field>
          <Field label={copy.weeklyBudget}><input className="reg-input" type="number" min={0} value={form.weeklyBudgetMajor} onChange={(event) => setForm({ ...form, weeklyBudgetMajor: Number(event.target.value) })} /></Field>
          <Field label={copy.languages}><input className="reg-input" value={form.languagesText} placeholder={copy.languagesPlaceholder} onChange={(event) => setForm({ ...form, languagesText: event.target.value })} /></Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Toggle icon={<Bell size={17} />} label={copy.instantNotifications} checked={form.instantNotifications} onChange={(checked) => setForm({ ...form, instantNotifications: checked })} />
          <Toggle icon={<Radar size={17} />} label={copy.autoUnlock} checked={form.autoUnlockEnabled} onChange={(checked) => setForm({ ...form, autoUnlockEnabled: checked })} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">{copy.autoUnlockHelp} {copy.preferencesHelp}</p>
        <button type="button" onClick={() => onSave({ ...form, languages: form.languagesText.split(",").map((item: string) => item.trim()).filter(Boolean), minBudget: Math.round(form.minBudgetMajor * 100), weeklyBudget: Math.round(form.weeklyBudgetMajor * 100) })} disabled={saving || !form.countries.length} className="btn btn-primary mt-5">
          <CheckCircle2 size={16} /> {saving ? copy.saving : copy.save}
        </button>
      </section>
    </div>
  );
}

function ReportDialog({ value, copy, onChange, onClose, onSubmit }: any) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-ink">{copy.reportTitle}</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted">{copy.reportPolicy}</p>
        <label className="mt-4 block"><span className="text-xs font-semibold text-muted">{copy.reportReason}</span><select className="reg-input mt-1.5" value={value.reason} onChange={(event) => onChange({ ...value, reason: event.target.value })}>{leadInvalidReasons.map((reason) => <option key={reason} value={reason}>{copy.invalidReasons[reason]}</option>)}</select></label>
        <label className="mt-4 block"><span className="text-xs font-semibold text-muted">{copy.reportDetails}</span><textarea rows={4} className="reg-input mt-1.5 resize-none" value={value.details} onChange={(event) => onChange({ ...value, details: event.target.value })} /></label>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="btn btn-secondary">{copy.cancel}</button><button type="button" onClick={onSubmit} className="btn btn-primary">{copy.reportSend}</button></div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-canvas p-3"><p className="text-[11px] font-semibold uppercase text-muted">{label}</p><p className="mt-1 text-sm font-medium text-ink">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-semibold text-muted">{label}</span><div className="mt-1.5">{children}</div></label>;
}

function Toggle({ icon, label, checked, onChange }: { icon: React.ReactNode; label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center justify-between gap-3 rounded-lg bg-canvas p-3 text-sm text-ink"><span className="inline-flex items-center gap-2">{icon}{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}
