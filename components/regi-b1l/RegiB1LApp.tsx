"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft, Bell, BriefcaseBusiness, Building2, Calculator, CalendarClock, Check, ChevronRight,
  CircleGauge, ClipboardList, Cloud, CloudOff, RefreshCw, Download, ExternalLink, FileCheck2, FileText, FolderKanban,
  HardHat, Images, Info, Languages, MapPin, MapPinned, Menu, MessageSquareText, PackageSearch, Phone, Plus, ReceiptText,
  Search, Settings, ShieldCheck, Trash2, UserPlus, Users, UsersRound, WalletCards, X,
} from "lucide-react";
import { b1lDictionaries, b1lLanguageNames, detectB1LLocale, type B1LDictionary, type B1LKey } from "@/lib/regi-b1l/i18n";
import { analyseMaterial, type MaterialResult } from "@/lib/regi-b1l/material-radar";
import { directionsUrl } from "@/lib/regi-b1l/maps";
import { downloadQuotePdf } from "@/lib/regi-b1l/pdf";
import { compressImage, newId, useB1LStore } from "@/lib/regi-b1l/store";
import { uploadProjectPhoto, deleteProjectPhoto } from "@/lib/regiworks/storage/media";
import { fetchUsage } from "@/lib/regiworks/storage/cloudAdapter";
import { b1lLocales, quoteTotals, type B1LLocale, type B1LTab, type Client, type CountryCode, type LeadStatus, type ProjectStatus, type Quote, type QuoteItem, type QuoteStatus } from "@/lib/regi-b1l/types";
import { ProviderMap } from "./ProviderMap";
import { PwaRegister } from "./PwaRegister";
import { SignaturePad } from "./SignaturePad";
import styles from "./RegiB1L.module.css";

const navItems: Array<{ id: B1LTab; icon: typeof CircleGauge }> = [
  { id: "dashboard", icon: CircleGauge }, { id: "leads", icon: MessageSquareText }, { id: "clients", icon: Users },
  { id: "projects", icon: FolderKanban }, { id: "quotes", icon: ReceiptText }, { id: "documents", icon: FileText },
  { id: "materials", icon: PackageSearch }, { id: "providers", icon: MapPinned }, { id: "team", icon: UsersRound },
  { id: "plans", icon: WalletCards }, { id: "settings", icon: Settings },
];
const countries: CountryCode[] = ["ES", "FR", "IT", "PT", "CH", "DE", "NL", "BE", "IE", "GB"];
const navKey = (tab: B1LTab) => `nav.${tab}` as B1LKey;
const statusKey = (status: string) => `status.${status}` as B1LKey;

function Dialog({ title, closeLabel, onClose, children }: { title: string; closeLabel: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return <div className={styles.dialogBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-label={title}>
      <header className={styles.dialogHead}><h2>{title}</h2><button className={styles.iconButton} onClick={onClose} aria-label={closeLabel} title={closeLabel}><X size={18} /></button></header>
      <div className={styles.dialogBody}>{children}</div>
    </section>
  </div>;
}

function PageHead({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className={styles.pageHead}><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function Badge({ value, t }: { value: string; t: B1LDictionary }) {
  const className = value === "rejected" || value === "lost" ? `${styles.badge} ${styles.badgeDanger}` : value === "sent" || value === "planning" || value === "contacted" || value === "quoted" ? `${styles.badge} ${styles.badgeWarn}` : value === "draft" || value === "paused" || value === "inactive" ? `${styles.badge} ${styles.badgeMuted}` : styles.badge;
  const label = value === "inactive" ? t["common.inactive"] : t[statusKey(value)];
  return <span className={className}>{label}</span>;
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`${styles.label} ${full ? styles.formFull : ""}`}>{label}{children}</label>;
}

function SearchBox({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <div className={styles.search}><Search size={16} /><input className={styles.field} value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} aria-label={label} /></div>;
}

const CLOUD_LABELS: Record<B1LLocale, { syncing: string; synced: string; error: string }> = {
  es: { syncing: "Sincronizando…", synced: "Guardado en la nube", error: "Sin sincronizar" },
  fr: { syncing: "Synchronisation…", synced: "Enregistré dans le cloud", error: "Non synchronisé" },
  it: { syncing: "Sincronizzazione…", synced: "Salvato nel cloud", error: "Non sincronizzato" },
  pt: { syncing: "A sincronizar…", synced: "Guardado na nuvem", error: "Não sincronizado" },
  de: { syncing: "Synchronisiert…", synced: "In der Cloud gespeichert", error: "Nicht synchronisiert" },
  nl: { syncing: "Synchroniseren…", synced: "Opgeslagen in de cloud", error: "Niet gesynchroniseerd" },
  en: { syncing: "Syncing…", synced: "Saved to the cloud", error: "Not synced" },
};

const IMPORT_LABELS: Record<B1LLocale, { import: string; invalid: string; done: string }> = {
  es: { import: "Restaurar copia", invalid: "Archivo no válido", done: "Copia restaurada" },
  fr: { import: "Restaurer une sauvegarde", invalid: "Fichier non valide", done: "Sauvegarde restaurée" },
  it: { import: "Ripristina backup", invalid: "File non valido", done: "Backup ripristinato" },
  pt: { import: "Restaurar cópia", invalid: "Ficheiro inválido", done: "Cópia restaurada" },
  de: { import: "Backup wiederherstellen", invalid: "Ungültige Datei", done: "Backup wiederhergestellt" },
  nl: { import: "Back-up herstellen", invalid: "Ongeldig bestand", done: "Back-up hersteld" },
  en: { import: "Restore backup", invalid: "Invalid file", done: "Backup restored" },
};

const USAGE_LABELS: Record<B1LLocale, { plan: string; storage: string; images: string }> = {
  es: { plan: "Plan", storage: "Almacenamiento", images: "Imágenes" },
  fr: { plan: "Forfait", storage: "Stockage", images: "Images" },
  it: { plan: "Piano", storage: "Archiviazione", images: "Immagini" },
  pt: { plan: "Plano", storage: "Armazenamento", images: "Imagens" },
  de: { plan: "Tarif", storage: "Speicher", images: "Bilder" },
  nl: { plan: "Abonnement", storage: "Opslag", images: "Afbeeldingen" },
  en: { plan: "Plan", storage: "Storage", images: "Images" },
};

function CloudUsage({ locale }: { locale: B1LLocale }) {
  const [usage, setUsage] = useState<any>(null);
  useEffect(() => { let active = true; fetchUsage().then((u) => { if (active) setUsage(u); }); return () => { active = false; }; }, []);
  if (!usage?.usage) return null;
  const labels = USAGE_LABELS[locale] || USAGE_LABELS.en;
  const kb = Math.round((usage.usage.workspaceBytes || 0) / 1024);
  const maxKb = Math.round((usage.limits?.maxWorkspaceBytes || 0) / 1024);
  return (
    <p className={styles.notice}>
      <Cloud size={16} /> {labels.plan}: {usage.plan} · {labels.storage}: {kb}/{maxKb} KB · {labels.images}: {usage.usage.images}/{usage.limits?.maxImages}
    </p>
  );
}

function CloudIndicator({ status, locale }: { status: string; locale: B1LLocale }) {
  if (status === "idle" || status === "offline") return null;
  const labels = CLOUD_LABELS[locale] || CLOUD_LABELS.en;
  if (status === "syncing") return <span className={styles.saveState}><RefreshCw size={14} />{labels.syncing}</span>;
  if (status === "synced") return <span className={styles.saveState}><Cloud size={14} />{labels.synced}</span>;
  return <span className={styles.saveState}><CloudOff size={14} />{labels.error}</span>;
}

function CountrySelect({ name, locale, defaultValue = "ES" }: { name: string; locale: B1LLocale; defaultValue?: CountryCode }) {
  const names = new Intl.DisplayNames([locale], { type: "region" });
  return <select className={styles.select} name={name} defaultValue={defaultValue}>{countries.map((country) => <option key={country} value={country}>{names.of(country)}</option>)}</select>;
}

function ClientDialog({ t, locale, close, onCreate }: { t: B1LDictionary; locale: B1LLocale; close: () => void; onCreate: (client: Client) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onCreate({ id: newId("cli"), name: String(form.get("name")), company: String(form.get("company") || ""), phone: String(form.get("phone") || ""), email: String(form.get("email") || ""), address: String(form.get("address") || ""), city: String(form.get("city") || ""), country: form.get("country") as CountryCode, preferredLanguage: form.get("language") as B1LLocale, notes: String(form.get("notes") || ""), createdAt: new Date().toISOString() });
  }
  return <Dialog title={t["clients.new"]} closeLabel={t["common.close"]} onClose={close}><form onSubmit={submit}><div className={styles.formGrid}>
    <Field label={t["form.clientName"]}><input required className={styles.field} name="name" /></Field><Field label={t["clients.company"]}><input className={styles.field} name="company" /></Field>
    <Field label={t["common.phone"]}><input className={styles.field} name="phone" type="tel" /></Field><Field label={t["common.email"]}><input className={styles.field} name="email" type="email" /></Field>
    <Field label={t["common.address"]}><input className={styles.field} name="address" /></Field><Field label={t["common.city"]}><input required className={styles.field} name="city" /></Field>
    <Field label={t["common.country"]}><CountrySelect name="country" locale={locale} /></Field><Field label={t["clients.preferredLanguage"]}><select className={styles.select} name="language" defaultValue={locale}>{b1lLocales.map((code) => <option key={code} value={code}>{b1lLanguageNames[code]}</option>)}</select></Field>
    <Field label={t["common.notes"]} full><textarea className={styles.textarea} name="notes" /></Field>
  </div><div className={styles.formActions}><button type="button" className={styles.buttonSecondary} onClick={close}>{t["common.cancel"]}</button><button className={styles.button} type="submit"><Check size={16} />{t["common.save"]}</button></div></form></Dialog>;
}

function ProjectDialog({ t, locale, clients, close, onCreate }: { t: B1LDictionary; locale: B1LLocale; clients: Client[]; close: () => void; onCreate: (project: Parameters<Parameters<ReturnType<typeof useB1LStore>["update"]>[0]>[0]["projects"][number]) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const f = new FormData(event.currentTarget);
    onCreate({ id: newId("pro"), clientId: String(f.get("clientId")), title: String(f.get("title")), address: String(f.get("address") || ""), city: String(f.get("city")), country: f.get("country") as CountryCode, trade: String(f.get("trade")), status: "planning", startDate: String(f.get("startDate")), dueDate: String(f.get("dueDate")), budget: Number(f.get("budget") || 0), notes: String(f.get("notes") || ""), photos: [], createdAt: new Date().toISOString() });
  }
  return <Dialog title={t["projects.new"]} closeLabel={t["common.close"]} onClose={close}><form onSubmit={submit}><div className={styles.formGrid}>
    <Field label={t["form.projectTitle"]} full><input required className={styles.field} name="title" /></Field><Field label={t["quotes.client"]}><select required className={styles.select} name="clientId" defaultValue=""><option value="" disabled>{t["form.selectClient"]}</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></Field><Field label={t["projects.trade"]}><input required className={styles.field} name="trade" /></Field>
    <Field label={t["common.address"]}><input className={styles.field} name="address" /></Field><Field label={t["common.city"]}><input required className={styles.field} name="city" /></Field><Field label={t["common.country"]}><CountrySelect name="country" locale={locale} /></Field><Field label={t["projects.budget"]}><input className={styles.field} name="budget" type="number" min="0" step="0.01" /></Field>
    <Field label={t["projects.start"]}><input required className={styles.field} name="startDate" type="date" /></Field><Field label={t["projects.due"]}><input required className={styles.field} name="dueDate" type="date" /></Field><Field label={t["common.notes"]} full><textarea className={styles.textarea} name="notes" /></Field>
  </div><div className={styles.formActions}><button type="button" className={styles.buttonSecondary} onClick={close}>{t["common.cancel"]}</button><button className={styles.button}><Check size={16} />{t["common.save"]}</button></div></form></Dialog>;
}

function QuoteDialog({ t, locale, data, close, onCreate }: { t: B1LDictionary; locale: B1LLocale; data: ReturnType<typeof useB1LStore>["data"]; close: () => void; onCreate: (quote: Quote) => void }) {
  const [items, setItems] = useState<QuoteItem[]>([{ id: newId("item"), description: "", quantity: 1, unit: "", unitPrice: 0 }]);
  const [tax, setTax] = useState(data.settings.defaultTaxRate); const [discount, setDiscount] = useState(0);
  const draft: Quote = { id: "draft", number: "", clientId: "", projectId: "", status: "draft", items, taxRate: tax, discountRate: discount, validUntil: "", notes: "", createdAt: "", updatedAt: "" };
  const totals = quoteTotals(draft); const money = new Intl.NumberFormat(locale, { style: "currency", currency: data.settings.currency });
  function updateItem(id: string, key: keyof QuoteItem, value: string) { setItems((current) => current.map((item) => item.id === id ? { ...item, [key]: key === "quantity" || key === "unitPrice" ? Number(value) : value } : item)); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const f = new FormData(event.currentTarget); const now = new Date().toISOString(); onCreate({ id: newId("quo"), number: `PRE-${new Date().getFullYear()}-${String(data.quotes.length + 16).padStart(3, "0")}`, clientId: String(f.get("clientId")), projectId: String(f.get("projectId")), status: "draft", items, taxRate: tax, discountRate: discount, validUntil: String(f.get("validUntil")), notes: String(f.get("notes") || ""), createdAt: now, updatedAt: now }); }
  return <Dialog title={t["quotes.new"]} closeLabel={t["common.close"]} onClose={close}><form onSubmit={submit} className={styles.quoteEditor}><div className={styles.formGrid}>
    <Field label={t["quotes.client"]}><select required className={styles.select} name="clientId" defaultValue=""><option value="" disabled>{t["form.selectClient"]}</option>{data.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></Field><Field label={t["quotes.project"]}><select required className={styles.select} name="projectId" defaultValue=""><option value="" disabled>{t["form.selectProject"]}</option>{data.projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></Field><Field label={t["quotes.validUntil"]}><input required type="date" name="validUntil" className={styles.field} /></Field>
  </div><div className={styles.items}>{items.map((item) => <div className={styles.itemRow} key={item.id}><input required className={styles.field} value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder={t["quotes.item"]} /><input className={styles.field} type="number" min="0.01" step="0.01" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} aria-label={t["quotes.quantity"]} /><input className={styles.field} value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} aria-label={t["quotes.unit"]} /><input className={styles.field} type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)} aria-label={t["quotes.unitPrice"]} /><button type="button" className={`${styles.iconButton} ${styles.danger}`} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={t["common.delete"]}><Trash2 size={15} /></button></div>)}</div>
  <button type="button" className={styles.buttonSecondary} onClick={() => setItems((current) => [...current, { id: newId("item"), description: "", quantity: 1, unit: "", unitPrice: 0 }])}><Plus size={15} />{t["quotes.addItem"]}</button>
  <div className={styles.formGrid}><Field label={t["quotes.discount"]}><input className={styles.field} type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min="0" max="100" /></Field><Field label={t["quotes.tax"]}><input className={styles.field} type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} min="0" max="100" /></Field><Field label={t["quotes.conditions"]} full><textarea className={styles.textarea} name="notes" /></Field></div>
  <div className={styles.totals}><div className={styles.totalLine}><span>{t["quotes.subtotal"]}</span><span>{money.format(totals.subtotal)}</span></div><div className={styles.totalLine}><span>{t["quotes.tax"]}</span><span>{money.format(totals.tax)}</span></div><div className={`${styles.totalLine} ${styles.grandTotal}`}><span>{t["quotes.total"]}</span><span>{money.format(totals.total)}</span></div></div>
  <div className={styles.formActions}><button type="button" className={styles.buttonSecondary} onClick={close}>{t["common.cancel"]}</button><button className={styles.button} disabled={!items.length}><Check size={16} />{t["common.save"]}</button></div></form></Dialog>;
}

function SignatureDialog({ t, quote, close, onSave }: { t: B1LDictionary; quote: Quote; close: () => void; onSave: (dataUrl: string, signer: string) => void }) {
  const [dataUrl, setDataUrl] = useState(""); const [signer, setSigner] = useState(""); const [consent, setConsent] = useState(false);
  return <Dialog title={`${t["quotes.sign"]} · ${quote.number}`} closeLabel={t["common.close"]} onClose={close}><div className={styles.quoteEditor}><Field label={t["quotes.signer"]}><input className={styles.field} value={signer} onChange={(e) => setSigner(e.target.value)} /></Field><SignaturePad clearLabel={t["quotes.clearSignature"]} onChange={setDataUrl} /><label className={styles.notice}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />{t["quotes.consent"]}</label><p className={styles.notice}><Info size={16} />{t["quotes.signatureNotice"]}</p><div className={styles.formActions}><button className={styles.buttonSecondary} onClick={close}>{t["common.cancel"]}</button><button className={styles.button} disabled={!dataUrl || !signer || !consent} onClick={() => onSave(dataUrl, signer)}><FileCheck2 size={16} />{t["common.save"]}</button></div></div></Dialog>;
}

export function RegiB1LApp() {
  const { data, update, reset, hydrated, saveState, cloudStatus } = useB1LStore();
  const [tab, setTab] = useState<B1LTab>("dashboard"); const [locale, setLocale] = useState<B1LLocale>("es"); const [localeReady, setLocaleReady] = useState(false); const [modal, setModal] = useState<"client" | "project" | "quote" | "menu" | null>(null); const [signQuote, setSignQuote] = useState<Quote | null>(null); const [search, setSearch] = useState(""); const [material, setMaterial] = useState(""); const [materialResult, setMaterialResult] = useState<MaterialResult | null>(null); const [resetArmed, setResetArmed] = useState(false); const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const t = b1lDictionaries[locale]; const money = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency: data.settings.currency }), [locale, data.settings.currency]); const regionNames = useMemo(() => new Intl.DisplayNames([locale], { type: "region" }), [locale]);

  useEffect(() => {
    if (!hydrated) return;
    const stored = window.localStorage.getItem("regikaha:b1l:locale");
    const configured = data.settings.locale;
    const detected = b1lLocales.includes(configured)
      ? configured
      : stored && b1lLocales.includes(stored as B1LLocale)
        ? stored as B1LLocale
        : detectB1LLocale();
    setLocale(detected);
    setLocaleReady(true);
  }, [data.settings.locale, hydrated]);
  useEffect(() => {
    if (!localeReady) return;
    document.documentElement.dir = "ltr";
    document.documentElement.lang = locale;
    window.localStorage.setItem("regikaha:b1l:locale", locale);
  }, [locale, localeReady]);

  const openTab = (next: B1LTab) => { setTab(next); setModal(null); setSearch(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const filtered = <T extends object>(rows: T[]) => search ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())) : rows;
  const projectClient = (id: string) => data.clients.find((client) => client.id === id)?.name ?? "-";
  const projectName = (id: string) => data.projects.find((project) => project.id === id)?.title ?? "-";
  const pendingQuotes = data.quotes.filter((quote) => quote.status === "draft" || quote.status === "sent").length;
  const openLeads = data.leads.filter((lead) => !["won", "lost"].includes(lead.status)).length;
  const activeProjects = data.projects.filter((project) => project.status === "active").length;
  const selectedProject = data.projects.find((project) => project.id === selectedProjectId) || data.projects[0];
  const selectedClient = selectedProject ? data.clients.find((client) => client.id === selectedProject.clientId) : null;
  const selectedQuote = selectedProject ? data.quotes.find((quote) => quote.projectId === selectedProject.id) : null;

  function saveLocale(next: B1LLocale) { setLocale(next); update((current) => ({ ...current, settings: { ...current.settings, locale: next } })); }
  function deleteRow(collection: "clients" | "projects" | "quotes" | "team", id: string) { update((current) => ({ ...current, [collection]: current[collection].filter((entry) => entry.id !== id) })); }
  async function addPhotos(projectId: string, files: FileList | null) { if (!files) return; const project = data.projects.find((entry) => entry.id === projectId); const remaining = 5 - (project?.photos.length ?? 0); const additions = await Promise.all([...files].slice(0, remaining).map(async (file) => { const uploaded = await uploadProjectPhoto(file, projectId); if (uploaded) return { id: newId("photo"), name: file.name, dataUrl: "", url: uploaded.url, mediaId: uploaded.id, createdAt: new Date().toISOString() }; return { id: newId("photo"), name: file.name, dataUrl: await compressImage(file), createdAt: new Date().toISOString() }; })); update((current) => ({ ...current, projects: current.projects.map((entry) => entry.id === projectId ? { ...entry, photos: [...entry.photos, ...additions] } : entry) })); }
  function convertLead(id: string) { const lead = data.leads.find((entry) => entry.id === id); if (!lead) return; const client: Client = { id: newId("cli"), name: lead.name, phone: lead.phone, email: lead.email, address: "", city: lead.city, country: lead.country, preferredLanguage: locale, notes: lead.service, createdAt: new Date().toISOString() }; update((current) => ({ ...current, clients: [client, ...current.clients], leads: current.leads.map((entry) => entry.id === id ? { ...entry, status: "won" } : entry) })); openTab("clients"); }

  function renderDashboard() {
    const stages: Array<{ status: ProjectStatus; icon: typeof HardHat }> = [
      { status: "planning", icon: ClipboardList },
      { status: "active", icon: HardHat },
      { status: "completed", icon: FileCheck2 },
    ];
    return (
      <>
        <PageHead title="Regi Works" subtitle={`${t["dashboard.greeting"]}, ${data.settings.companyName}`} action={<button className={styles.button} onClick={() => setModal("quote")}><Plus size={17} /><span>{t["dashboard.newQuote"]}</span></button>} />
        <div className={styles.worksStrip}>
          <div><span>{t["dashboard.activeProjects"]}</span><strong>{activeProjects}</strong></div>
          <div><span>{t["dashboard.openLeads"]}</span><strong>{openLeads}</strong></div>
          <div><span>{t["dashboard.pendingQuotes"]}</span><strong>{pendingQuotes}</strong></div>
          <div><span>{t["quotes.total"]}</span><strong>{money.format(data.quotes.filter((quote) => quote.status === "accepted").reduce((sum, quote) => sum + quoteTotals(quote).total, 0))}</strong></div>
        </div>
        <div className={styles.workStageRail}>
          {stages.map(({ status, icon: Icon }) => (
            <button key={status} type="button" className={selectedProject?.status === status ? styles.workStageActive : ""} onClick={() => {
              if (!selectedProject) return;
              update((current) => ({ ...current, projects: current.projects.map((project) => project.id === selectedProject.id ? { ...project, status } : project) }));
            }}>
              <Icon size={18} /><span>{t[statusKey(status)]}</span><strong>{data.projects.filter((project) => project.status === status).length}</strong>
            </button>
          ))}
        </div>
        <div className={styles.workBoard}>
          <aside className={styles.workQueue}>
            <div className={styles.workQueueHead}><div><span>Regi Works</span><h2>{t["dashboard.recentProjects"]}</h2></div><button className={styles.iconButton} onClick={() => setModal("project")} aria-label={t["projects.new"]}><Plus size={17} /></button></div>
            <div className={styles.workQueueList}>
              {data.projects.slice(0, 8).map((project) => (
                <button key={project.id} type="button" onClick={() => setSelectedProjectId(project.id)} className={selectedProject?.id === project.id ? styles.workQueueSelected : ""}>
                  <span className={styles.workQueueStatus} data-status={project.status} />
                  <span><strong>{project.title}</strong><small>{project.city} · {project.trade}</small><small>{project.dueDate}</small></span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
            <button className={styles.workQueueMore} onClick={() => openTab("projects")}>{t["nav.projects"]}<ChevronRight size={16} /></button>
          </aside>
          <section className={styles.workCanvas}>
            {selectedProject ? (
              <>
                <header className={styles.workCanvasHead}>
                  <div><span>{t[statusKey(selectedProject.status)]}</span><h2>{selectedProject.title}</h2><p>{selectedClient?.name || "-"} · {selectedProject.city}</p></div>
                  <select className={styles.select} value={selectedProject.status} onChange={(event) => update((current) => ({ ...current, projects: current.projects.map((project) => project.id === selectedProject.id ? { ...project, status: event.target.value as ProjectStatus } : project) }))}>
                    {(["planning", "active", "paused", "completed"] as ProjectStatus[]).map((status) => <option key={status} value={status}>{t[statusKey(status)]}</option>)}
                  </select>
                </header>
                <div className={styles.workFacts}>
                  <span><MapPin size={15} />{selectedProject.address || selectedProject.city}</span>
                  <span><BriefcaseBusiness size={15} />{selectedProject.trade}</span>
                  <span><WalletCards size={15} />{money.format(selectedProject.budget)}</span>
                  <span><CalendarClock size={15} />{selectedProject.dueDate}</span>
                </div>
                <nav className={styles.workTabs}>
                  <button onClick={() => openTab("clients")}><Users size={16} />{t["quotes.client"]}</button>
                  <button onClick={() => openTab("projects")}><Images size={16} />{t["projects.addPhotos"]}</button>
                  <button onClick={() => openTab("projects")}><CalendarClock size={16} />{t["projects.start"]}</button>
                  <button onClick={() => openTab("quotes")}><ReceiptText size={16} />{t["nav.quotes"]}</button>
                  <button onClick={() => openTab("materials")}><PackageSearch size={16} />{t["nav.materials"]}</button>
                  <button onClick={() => openTab("documents")}><FileText size={16} />{t["nav.documents"]}</button>
                </nav>
                <div className={styles.workDetail}>
                  <div className={styles.workClient}>
                    <h3>{t["quotes.client"]}</h3>
                    <strong>{selectedClient?.name || "-"}</strong>
                    <a href={`tel:${selectedClient?.phone || ""}`}><Phone size={15} />{selectedClient?.phone || "-"}</a>
                    <a href={`mailto:${selectedClient?.email || ""}`}><MessageSquareText size={15} />{selectedClient?.email || "-"}</a>
                    <p>{selectedProject.notes || t["common.notes"]}</p>
                  </div>
                  <div className={styles.workNext}>
                    <h3>{t["dashboard.alerts"]}</h3>
                    <div><CalendarClock size={22} /><span><small>{t["projects.due"]}</small><strong>{selectedProject.dueDate}</strong></span></div>
                    <div><ReceiptText size={22} /><span><small>{t["nav.quotes"]}</small><strong>{selectedQuote?.number || t["dashboard.newQuote"]}</strong></span></div>
                    <button className={styles.button} onClick={() => setModal("quote")}><Plus size={16} />{t["dashboard.newQuote"]}</button>
                  </div>
                </div>
              </>
            ) : <div className={styles.empty}>{t["projects.subtitle"]}</div>}
          </section>
          <aside className={styles.workUtility}>
            <section>
              <div className={styles.workUtilityHead}><h2>{t["nav.leads"]}</h2><button onClick={() => openTab("leads")}>{t["common.actions"]}<ChevronRight size={14} /></button></div>
              {data.leads.slice(0, 4).map((lead) => (
                <button className={styles.opportunityRow} key={lead.id} onClick={() => openTab("leads")}>
                  <span><strong>{lead.city}</strong><small>{lead.service}</small></span><Badge value={lead.status} t={t} />
                </button>
              ))}
            </section>
            <section>
              <div className={styles.workUtilityHead}><h2>{t["dashboard.quickActions"]}</h2></div>
              <div className={styles.workQuick}>
                <button onClick={() => setModal("client")}><UserPlus size={18} />{t["dashboard.newClient"]}</button>
                <button onClick={() => setModal("project")}><FolderKanban size={18} />{t["projects.new"]}</button>
                <button onClick={() => openTab("materials")}><PackageSearch size={18} />{t["nav.materials"]}</button>
                <button onClick={() => openTab("documents")}><FileText size={18} />{t["nav.documents"]}</button>
              </div>
            </section>
            <div className={styles.worksPrinciple}><ShieldCheck size={20} /><p>{t["plans.billingNotice"]}</p></div>
          </aside>
        </div>
      </>
    );
  }

  function renderLeads() { return <><PageHead title={t["leads.title"]} subtitle={t["leads.subtitle"]} /><div className={styles.toolbar}><SearchBox value={search} onChange={setSearch} label={t["common.search"]} /></div><section className={styles.panel}><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["common.name"]}</th><th>{t["leads.service"]}</th><th>{t["common.city"]}</th><th>{t["leads.source"]}</th><th>{t["common.status"]}</th><th>{t["common.actions"]}</th></tr></thead><tbody>{filtered(data.leads).map((lead) => <tr key={lead.id}><td data-label={t["common.name"]}><div className={styles.rowTitle}>{lead.name}</div><div className={styles.rowMeta}>{lead.email}</div></td><td data-label={t["leads.service"]}>{lead.service}</td><td data-label={t["common.city"]}>{lead.city}, {regionNames.of(lead.country)}</td><td data-label={t["leads.source"]}>{lead.source === "regikaha" ? "Regi Kaha" : t["common.add"]}</td><td data-label={t["common.status"]}><select className={styles.select} value={lead.status} onChange={(e) => update((current) => ({ ...current, leads: current.leads.map((entry) => entry.id === lead.id ? { ...entry, status: e.target.value as LeadStatus } : entry) }))}>{(["new","contacted","quoted","won","lost"] as LeadStatus[]).map((status) => <option key={status} value={status}>{t[statusKey(status)]}</option>)}</select></td><td data-label={t["common.actions"]}><div className={styles.rowActions}><a className={styles.iconButton} href={`tel:${lead.phone}`} aria-label={t["common.call"]} title={t["common.call"]}><Phone size={15} /></a>{lead.status !== "won" && <button className={styles.buttonSecondary} onClick={() => convertLead(lead.id)}><UserPlus size={15} />{t["leads.convert"]}</button>}</div></td></tr>)}</tbody></table></div></section></>; }

  function renderClients() { return <><PageHead title={t["clients.title"]} subtitle={t["clients.subtitle"]} action={<button className={styles.button} onClick={() => setModal("client")}><Plus size={17} /><span>{t["clients.new"]}</span></button>} /><div className={styles.toolbar}><SearchBox value={search} onChange={setSearch} label={t["common.search"]} /></div><section className={styles.panel}><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["common.name"]}</th><th>{t["common.phone"]}</th><th>{t["common.city"]}</th><th>{t["clients.preferredLanguage"]}</th><th>{t["common.actions"]}</th></tr></thead><tbody>{filtered(data.clients).map((client) => <tr key={client.id}><td data-label={t["common.name"]}><div className={styles.rowTitle}>{client.name}</div><div className={styles.rowMeta}>{client.company || client.email}</div></td><td data-label={t["common.phone"]}>{client.phone}</td><td data-label={t["common.city"]}>{client.city}, {regionNames.of(client.country)}</td><td data-label={t["clients.preferredLanguage"]}>{b1lLanguageNames[client.preferredLanguage]}</td><td data-label={t["common.actions"]}><div className={styles.rowActions}><a className={styles.iconButton} href={`tel:${client.phone}`} aria-label={t["common.call"]}><Phone size={15} /></a><button className={`${styles.iconButton} ${styles.danger}`} onClick={() => deleteRow("clients", client.id)} aria-label={t["common.delete"]}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div></section></>; }

  function renderProjects() { return <><PageHead title={t["projects.title"]} subtitle={t["projects.subtitle"]} action={<button className={styles.button} onClick={() => setModal("project")}><Plus size={17} /><span>{t["projects.new"]}</span></button>} /><div className={styles.toolbar}><SearchBox value={search} onChange={setSearch} label={t["common.search"]} /></div><section className={styles.panel}><TableProjects rows={filtered(data.projects)} t={t} money={money} clientName={projectClient} onStatus={(id,status) => update((current) => ({ ...current, projects: current.projects.map((entry) => entry.id === id ? { ...entry, status } : entry) }))} onDelete={(id) => deleteRow("projects", id)} onPhotos={addPhotos} onPhotoDelete={(projectId, photoId) => { const target = data.projects.find((p) => p.id === projectId)?.photos.find((ph) => ph.id === photoId); if (target?.mediaId) void deleteProjectPhoto(target.mediaId); update((current) => ({ ...current, projects: current.projects.map((project) => project.id === projectId ? { ...project, photos: project.photos.filter((photo) => photo.id !== photoId) } : project) })); }} /></section></>; }

  function renderQuotes() { return <><PageHead title={t["quotes.title"]} subtitle={t["quotes.subtitle"]} action={<button className={styles.button} onClick={() => setModal("quote")}><Plus size={17} /><span>{t["quotes.new"]}</span></button>} /><div className={styles.toolbar}><SearchBox value={search} onChange={setSearch} label={t["common.search"]} /></div><section className={styles.panel}><TableQuotes rows={filtered(data.quotes)} t={t} money={money} clientName={projectClient} onStatus={(id,status) => update((current) => ({ ...current, quotes: current.quotes.map((entry) => entry.id === id ? { ...entry, status, updatedAt: new Date().toISOString() } : entry) }))} onPdf={(quote) => void downloadQuotePdf(quote, data, locale, t)} onSign={setSignQuote} onDelete={(id) => deleteRow("quotes", id)} /></section></>; }

  function renderDocuments() { return <><PageHead title={t["documents.title"]} subtitle={t["documents.subtitle"]} /><div className={styles.notice}><ShieldCheck size={17} />{t["documents.integrityNotice"]}</div><br /><section className={styles.panel}><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["documents.type"]}</th><th>{t["quotes.number"]}</th><th>{t["quotes.project"]}</th><th>{t["common.status"]}</th><th>{t["documents.verification"]}</th></tr></thead><tbody>{data.documents.map((doc) => <tr key={doc.id}><td data-label={t["documents.type"]}>{t[`doc.${doc.type}` as B1LKey]}</td><td data-label={t["quotes.number"]}><div className={styles.rowTitle}>{doc.number}</div><div className={styles.rowMeta}>{doc.title}</div></td><td data-label={t["quotes.project"]}>{projectName(doc.projectId)}</td><td data-label={t["common.status"]}><Badge value={doc.status} t={t} /></td><td data-label={t["documents.verification"]}><code>{doc.verificationCode}</code></td></tr>)}</tbody></table></div></section></>; }

  function renderMaterials() { return <><PageHead title={t["materials.title"]} subtitle={t["materials.subtitle"]} /><div className={styles.radar}><section className={styles.panel}><div className={styles.panelBody}><div className={styles.quoteEditor}><Field label={t["materials.placeholder"]}><textarea className={styles.textarea} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder={t["materials.placeholder"]} /></Field><button className={styles.button} disabled={!material.trim()} onClick={() => setMaterialResult(analyseMaterial(material))}><PackageSearch size={17} />{t["materials.analyse"]}</button><div className={styles.notice}><Info size={17} />{t["materials.offerNotice"]}</div></div></div></section>{materialResult ? <section className={styles.panel}><div className={styles.panelBody}><div className={styles.radarResult}><div className={styles.detailGrid}><div className={styles.detail}><span>{t["materials.normalized"]}</span><strong>{materialResult.normalized}</strong></div><div className={styles.detail}><span>{t["materials.category"]}</span><strong>{materialResult.category}</strong></div></div>{([["materials.uses", materialResult.uses],["materials.equivalents",materialResult.equivalents],["materials.complements",materialResult.complements]] as Array<[B1LKey,string[]]>).map(([key, values]) => <div key={key}><strong>{t[key]}</strong><div className={styles.tagList}>{values.map((value) => <span key={value} className={styles.badge}>{value}</span>)}</div></div>)}<div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["materials.supplier"]}</th><th>{t["materials.distance"]}</th><th>{t["materials.price"]}</th></tr></thead><tbody>{materialResult.offers.map((offer) => <tr key={offer.supplier}><td>{offer.supplier}</td><td>{offer.distanceKm} km</td><td><strong>{money.format(offer.price)} / {offer.unit}</strong></td></tr>)}</tbody></table></div></div></div></section> : <section className={styles.panel}><div className={styles.empty}>{t["materials.analyse"]}</div></section>}</div></>; }

  function renderProviders() { return <><PageHead title={t["providers.title"]} subtitle={t["providers.subtitle"]} /><div className={styles.providerLayout}><section className={styles.panel}><div className={styles.panelHead}><h2>{t["providers.map"]}</h2><MapPinned size={16} /></div><ProviderMap providers={data.providers} /></section><section className={styles.panel}><div className={styles.panelHead}><h2>{t["providers.directory"]}</h2></div><div className={styles.providerList}>{data.providers.map((provider) => <article className={styles.provider} key={provider.id}><h3>{provider.name}</h3><p>{provider.category}</p><p>{provider.address}, {provider.city} · {provider.distanceKm} km</p><div className={styles.providerActions}><a className={styles.buttonSecondary} href={directionsUrl(provider.lat, provider.lng, provider.name)} target="_blank" rel="noreferrer"><ExternalLink size={14} />{t["common.openMaps"]}</a><a className={styles.iconButton} href={`tel:${provider.phone}`} aria-label={t["common.call"]}><Phone size={14} /></a></div></article>)}</div></section></div></>; }

  function renderTeam() { function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const f = new FormData(event.currentTarget); update((current) => ({ ...current, team: [...current.team, { id: newId("team"), name: String(f.get("name")), role: String(f.get("role")), phone: String(f.get("phone")), email: String(f.get("email")), active: true }] })); event.currentTarget.reset(); } return <><PageHead title={t["team.title"]} subtitle={t["team.subtitle"]} /><div className={styles.dashboardGrid}><section className={styles.panel}><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["common.name"]}</th><th>{t["team.role"]}</th><th>{t["common.phone"]}</th><th>{t["common.status"]}</th><th>{t["common.actions"]}</th></tr></thead><tbody>{data.team.map((member) => <tr key={member.id}><td data-label={t["common.name"]}><div className={styles.rowTitle}>{member.name}</div><div className={styles.rowMeta}>{member.email}</div></td><td data-label={t["team.role"]}>{member.role}</td><td data-label={t["common.phone"]}>{member.phone}</td><td data-label={t["common.status"]}><Badge value={member.active ? "active" : "inactive"} t={t} /></td><td><button className={`${styles.iconButton} ${styles.danger}`} onClick={() => deleteRow("team", member.id)} aria-label={t["common.delete"]}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div></section><section className={styles.panel}><div className={styles.panelHead}><h2>{t["team.new"]}</h2></div><div className={styles.panelBody}><form className={styles.quoteEditor} onSubmit={submit}><Field label={t["common.name"]}><input required className={styles.field} name="name" /></Field><Field label={t["team.role"]}><input required className={styles.field} name="role" /></Field><Field label={t["common.phone"]}><input className={styles.field} name="phone" /></Field><Field label={t["common.email"]}><input className={styles.field} name="email" type="email" /></Field><button className={styles.button}><Plus size={16} />{t["common.add"]}</button></form></div></section></div></>; }

  function renderPlans() { const select = (plan: "local"|"europe") => update((current) => ({ ...current, settings: { ...current.settings, plan } })); return <><PageHead title={t["plans.title"]} subtitle={t["plans.subtitle"]} /><div className={styles.plans}>{(["local","europe"] as const).map((plan) => { const price = plan === "local" ? 19.95 : 49.95; const current = data.settings.plan === plan; return <article key={plan} className={`${styles.plan} ${current ? styles.planCurrent : ""}`}><h2>{t[`plans.${plan}`]}</h2><p>{t[`plans.${plan}Desc`]}</p><div className={styles.price}>{money.format(price)} <small>/ {t["plans.month"]}</small></div><div className={styles.annual}>{money.format(price * 12 * .9)} / {t["plans.year"]} · {t["plans.annualSaving"]}</div><button className={current ? styles.buttonSecondary : styles.button} disabled={current} onClick={() => select(plan)}>{current ? <Check size={16} /> : <WalletCards size={16} />}{current ? t["plans.current"] : t["plans.choose"]}</button></article>; })}</div><br /><div className={styles.notice}><ShieldCheck size={17} />{t["plans.billingNotice"]}</div></>; }

  function renderSettings() { function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const f = new FormData(event.currentTarget); update((current) => ({ ...current, settings: { ...current.settings, companyName: String(f.get("companyName")), taxId: String(f.get("taxId")), email: String(f.get("email")), phone: String(f.get("phone")), address: String(f.get("address")), city: String(f.get("city")), country: f.get("country") as CountryCode, currency: f.get("currency") as "EUR"|"CHF"|"GBP", defaultTaxRate: Number(f.get("tax")) } })); } function exportData() { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); link.download = "regi-works-backup.json"; link.click(); URL.revokeObjectURL(link.href); } function importData() { const il = IMPORT_LABELS[locale] || IMPORT_LABELS.en; const input = document.createElement("input"); input.type = "file"; input.accept = "application/json"; input.onchange = async () => { const file = input.files?.[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); if (parsed && parsed.version === 1 && Array.isArray(parsed.clients) && Array.isArray(parsed.projects) && Array.isArray(parsed.quotes)) { update(() => parsed as typeof data); } else { window.alert(il.invalid); } } catch { window.alert(il.invalid); } }; input.click(); } return <><PageHead title={t["settings.title"]} subtitle={t["settings.subtitle"]} /><div className={styles.settingsGrid}><section className={styles.panel}><div className={styles.panelHead}><h2>{t["settings.company"]}</h2><Building2 size={16} /></div><div className={styles.panelBody}><form onSubmit={submit}><div className={styles.formGrid}><Field label={t["settings.company"]}><input className={styles.field} name="companyName" defaultValue={data.settings.companyName} /></Field><Field label={t["settings.taxId"]}><input className={styles.field} name="taxId" defaultValue={data.settings.taxId} /></Field><Field label={t["common.email"]}><input className={styles.field} name="email" type="email" defaultValue={data.settings.email} /></Field><Field label={t["common.phone"]}><input className={styles.field} name="phone" defaultValue={data.settings.phone} /></Field><Field label={t["common.address"]}><input className={styles.field} name="address" defaultValue={data.settings.address} /></Field><Field label={t["common.city"]}><input className={styles.field} name="city" defaultValue={data.settings.city} /></Field><Field label={t["common.country"]}><CountrySelect name="country" locale={locale} defaultValue={data.settings.country} /></Field><Field label={t["settings.currency"]}><select className={styles.select} name="currency" defaultValue={data.settings.currency}><option>EUR</option><option>CHF</option><option>GBP</option></select></Field><Field label={t["settings.defaultTax"]}><input className={styles.field} name="tax" type="number" defaultValue={data.settings.defaultTaxRate} /></Field></div><div className={styles.formActions}><button className={styles.button}><Check size={16} />{t["common.save"]}</button></div></form></div></section><section className={styles.stack}><section className={styles.panel}><div className={styles.panelHead}><h2>{t["settings.data"]}</h2><ShieldCheck size={16} /></div><div className={styles.panelBody}><div className={styles.quoteEditor}><p className={styles.notice}><CloudOff size={17} />{t["settings.privacyNotice"]}</p><button className={styles.buttonSecondary} onClick={exportData}><Download size={16} />{t["settings.export"]}</button><button className={styles.buttonSecondary} onClick={importData}><RefreshCw size={16} />{(IMPORT_LABELS[locale] || IMPORT_LABELS.en).import}</button><CloudUsage locale={locale} /><button className={`${styles.buttonSecondary} ${styles.danger}`} onClick={() => { if (resetArmed) { reset(); setResetArmed(false); } else { setResetArmed(true); window.setTimeout(() => setResetArmed(false), 4000); } }}><Trash2 size={16} />{resetArmed ? t["common.confirmReset"] : t["common.resetData"]}</button></div></div></section></section></div></>; }

  const views: Record<B1LTab, () => React.ReactNode> = { dashboard: renderDashboard, leads: renderLeads, clients: renderClients, projects: renderProjects, quotes: renderQuotes, documents: renderDocuments, materials: renderMaterials, providers: renderProviders, team: renderTeam, plans: renderPlans, settings: renderSettings };
  if (!hydrated) return <div className={styles.app} />;
  return <div className={styles.app}><PwaRegister /><div className={styles.shell}><aside className={styles.sidebar}><Link href="/" className={styles.brand}><span className={styles.brandMark}>W</span><span><strong>Regi Works</strong><span>by Regi Kaha</span></span></Link><nav className={styles.nav}>{navItems.map(({ id, icon: Icon }) => <button key={id} className={`${styles.navButton} ${tab === id ? styles.navActive : ""}`} onClick={() => openTab(id)}><Icon size={17} />{t[navKey(id)]}</button>)}</nav><div className={styles.sidebarFoot}><Link className={styles.backLink} href="/"><ArrowLeft size={15} />{t["app.back"]}</Link></div></aside><main className={styles.main}><header className={styles.mobileTop}><button className={styles.mobileBrand} onClick={() => setModal("menu")} aria-label={t["app.subtitle"]}><span className={styles.mobileWordmark}>REGI <b>WORKS</b></span><Menu size={19} /></button><LocaleSelect locale={locale} onChange={saveLocale} /></header><header className={styles.topbar}><div className={styles.topTitle}><strong>REGI WORKS</strong><span>{t[navKey(tab)]}</span></div><div className={styles.topActions}><span className={styles.saveState}>{saveState === "saving" ? <CloudOff size={14} /> : <Check size={14} />}{saveState === "saving" ? t["app.saving"] : saveState === "saved" ? t["app.saved"] : t["app.local"]}</span><CloudIndicator status={cloudStatus} locale={locale} /><LocaleSelect locale={locale} onChange={saveLocale} /></div></header><div className={styles.content}>{views[tab]()}</div></main></div>
  <nav className={styles.bottomNav}>{(["dashboard","projects","quotes","materials","settings"] as B1LTab[]).map((id) => { const Item = navItems.find((item) => item.id === id)!; return <button key={id} className={tab === id ? styles.bottomActive : ""} onClick={() => openTab(id)}><Item.icon />{t[navKey(id)]}</button>; })}</nav>
  {modal === "client" && <ClientDialog t={t} locale={locale} close={() => setModal(null)} onCreate={(client) => { update((current) => ({ ...current, clients: [client, ...current.clients] })); setModal(null); }} />}
  {modal === "project" && <ProjectDialog t={t} locale={locale} clients={data.clients} close={() => setModal(null)} onCreate={(project) => { update((current) => ({ ...current, projects: [project, ...current.projects] })); setModal(null); }} />}
  {modal === "quote" && <QuoteDialog t={t} locale={locale} data={data} close={() => setModal(null)} onCreate={(quote) => { update((current) => ({ ...current, quotes: [quote, ...current.quotes] })); setModal(null); }} />}
  {modal === "menu" && <Dialog title="Regi Works" closeLabel={t["common.close"]} onClose={() => setModal(null)}><nav className={styles.nav}>{navItems.map(({ id, icon: Icon }) => <button key={id} className={`${styles.navButton} ${tab === id ? styles.navActive : ""}`} style={{ color: "#17382c" }} onClick={() => openTab(id)}><Icon size={17} />{t[navKey(id)]}</button>)}</nav><Link className={styles.backLink} style={{ color: "#17382c", marginTop: 12 }} href="/"><ArrowLeft size={15} />{t["app.back"]}</Link></Dialog>}
  {signQuote && <SignatureDialog t={t} quote={signQuote} close={() => setSignQuote(null)} onSave={(dataUrl, signer) => { update((current) => ({ ...current, quotes: current.quotes.map((quote) => quote.id === signQuote.id ? { ...quote, status: "accepted", signature: { dataUrl, signer, consent: true, signedAt: new Date().toISOString() }, updatedAt: new Date().toISOString() } : quote) })); setSignQuote(null); }} />}
  </div>;
}

function LocaleSelect({ locale, onChange }: { locale: B1LLocale; onChange: (locale: B1LLocale) => void }) { return <label><span className="sr-only">{b1lLanguageNames[locale]}</span><select className={styles.language} value={locale} onChange={(event) => onChange(event.target.value as B1LLocale)}>{b1lLocales.map((code) => <option key={code} value={code}>{b1lLanguageNames[code]}</option>)}</select></label>; }

function TableProjects({ rows, t, money, clientName, onStatus, onDelete, onPhotos, onPhotoDelete }: { rows: ReturnType<typeof useB1LStore>["data"]["projects"]; t: B1LDictionary; money: Intl.NumberFormat; clientName: (id: string) => string; onStatus?: (id: string, status: ProjectStatus) => void; onDelete?: (id: string) => void; onPhotos?: (id: string, files: FileList | null) => void; onPhotoDelete?: (projectId: string, photoId: string) => void }) { return <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["projects.title"]}</th><th>{t["quotes.client"]}</th><th>{t["common.status"]}</th><th>{t["projects.due"]}</th><th>{t["projects.budget"]}</th>{onStatus && <th>{t["common.actions"]}</th>}</tr></thead><tbody>{rows.map((project) => <tr key={project.id}><td data-label={t["projects.title"]}><div className={styles.rowTitle}>{project.title}</div><div className={styles.rowMeta}>{project.city} · {project.trade}</div>{onPhotos && <div className={styles.photoGrid}>{project.photos.map((photo) => <div className={styles.photo} key={photo.id}><img src={photo.url || photo.dataUrl} alt={photo.name} /><button onClick={() => onPhotoDelete?.(project.id, photo.id)} aria-label={t["common.delete"]}><X size={13} /></button></div>)}</div>}</td><td data-label={t["quotes.client"]}>{clientName(project.clientId)}</td><td data-label={t["common.status"]}>{onStatus ? <select className={styles.select} value={project.status} onChange={(e) => onStatus(project.id, e.target.value as ProjectStatus)}>{(["planning","active","paused","completed"] as ProjectStatus[]).map((status) => <option key={status} value={status}>{t[statusKey(status)]}</option>)}</select> : <Badge value={project.status} t={t} />}</td><td data-label={t["projects.due"]}>{project.dueDate}</td><td data-label={t["projects.budget"]}><strong>{money.format(project.budget)}</strong></td>{onStatus && <td data-label={t["common.actions"]}><div className={styles.rowActions}>{onPhotos && project.photos.length < 5 && <label className={styles.iconButton} title={t["projects.addPhotos"]}><Plus size={15} /><input hidden type="file" accept="image/*" multiple onChange={(e) => void onPhotos(project.id, e.target.files)} /></label>}<button className={`${styles.iconButton} ${styles.danger}`} onClick={() => onDelete?.(project.id)} aria-label={t["common.delete"]}><Trash2 size={15} /></button></div></td>}</tr>)}</tbody></table></div>; }

function TableQuotes({ rows, t, money, clientName, onStatus, onPdf, onSign, onDelete }: { rows: Quote[]; t: B1LDictionary; money: Intl.NumberFormat; clientName: (id: string) => string; onStatus?: (id: string, status: QuoteStatus) => void; onPdf?: (quote: Quote) => void; onSign?: (quote: Quote) => void; onDelete?: (id: string) => void }) { return <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>{t["quotes.number"]}</th><th>{t["quotes.client"]}</th><th>{t["common.status"]}</th><th>{t["quotes.validUntil"]}</th><th>{t["quotes.total"]}</th>{onStatus && <th>{t["common.actions"]}</th>}</tr></thead><tbody>{rows.map((quote) => <tr key={quote.id}><td data-label={t["quotes.number"]}><div className={styles.rowTitle}>{quote.number}</div></td><td data-label={t["quotes.client"]}>{clientName(quote.clientId)}</td><td data-label={t["common.status"]}>{onStatus ? <select className={styles.select} value={quote.status} onChange={(e) => onStatus(quote.id, e.target.value as QuoteStatus)}>{(["draft","sent","accepted","rejected","expired"] as QuoteStatus[]).map((status) => <option key={status} value={status}>{t[statusKey(status)]}</option>)}</select> : <Badge value={quote.status} t={t} />}</td><td data-label={t["quotes.validUntil"]}>{quote.validUntil}</td><td data-label={t["quotes.total"]}><strong>{money.format(quoteTotals(quote).total)}</strong></td>{onStatus && <td data-label={t["common.actions"]}><div className={styles.rowActions}><button className={styles.iconButton} onClick={() => onPdf?.(quote)} aria-label={t["quotes.pdf"]} title={t["quotes.pdf"]}><Download size={15} /></button><button className={styles.iconButton} onClick={() => onSign?.(quote)} aria-label={t["quotes.sign"]} title={t["quotes.sign"]}><FileCheck2 size={15} /></button><button className={`${styles.iconButton} ${styles.danger}`} onClick={() => onDelete?.(quote.id)} aria-label={t["common.delete"]}><Trash2 size={15} /></button></div></td>}</tr>)}</tbody></table></div>; }
