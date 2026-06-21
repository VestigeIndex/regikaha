"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const copy = {
  es: { eyebrow: "Regi Works", title: "El centro de trabajo para profesionales de obras y reformas", text: "Convierte oportunidades en clientes, obras, presupuestos, documentos, materiales y proveedores sin depender del ordenador.", cta: "Abrir guía", steps: ["Oportunidad", "Cliente", "Obra", "Presupuesto", "Documento", "Materiales"] },
  fr: { eyebrow: "Regi Works", title: "Le centre de travail pour les professionnels du bâtiment", text: "Transformez les opportunités en clients, chantiers, devis, documents, matériaux et fournisseurs depuis mobile ou ordinateur.", cta: "Ouvrir le guide", steps: ["Opportunité", "Client", "Chantier", "Devis", "Document", "Matériaux"] },
  it: { eyebrow: "Regi Works", title: "Il centro operativo per professionisti di lavori e ristrutturazioni", text: "Trasforma opportunità in clienti, cantieri, preventivi, documenti, materiali e fornitori da mobile o desktop.", cta: "Apri guida", steps: ["Opportunità", "Cliente", "Cantiere", "Preventivo", "Documento", "Materiali"] },
  pt: { eyebrow: "Regi Works", title: "O centro de trabalho para profissionais de obras", text: "Converta oportunidades em clientes, obras, orçamentos, documentos, materiais e fornecedores a partir do telemóvel ou computador.", cta: "Abrir guia", steps: ["Oportunidade", "Cliente", "Obra", "Orçamento", "Documento", "Materiais"] },
  de: { eyebrow: "Regi Works", title: "Die Arbeitszentrale für Bau- und Renovierungsprofis", text: "Verwandeln Sie Chancen in Kunden, Projekte, Angebote, Dokumente, Materialien und Lieferanten – mobil oder am Desktop.", cta: "Hilfe öffnen", steps: ["Chance", "Kunde", "Projekt", "Angebot", "Dokument", "Materialien"] },
  nl: { eyebrow: "Regi Works", title: "Het werkcentrum voor bouw- en renovatieprofessionals", text: "Zet kansen om in klanten, projecten, offertes, documenten, materialen en leveranciers vanaf mobiel of desktop.", cta: "Gids openen", steps: ["Kans", "Klant", "Project", "Offerte", "Document", "Materialen"] },
  en: { eyebrow: "Regi Works", title: "The work hub for construction and renovation professionals", text: "Turn opportunities into clients, jobs, quotes, documents, materials and suppliers from mobile or desktop.", cta: "Open guide", steps: ["Lead", "Client", "Job", "Quote", "Document", "Materials"] },
} as const;

export function RegiWorksIntro() {
  const { locale } = useI18n();
  const t = copy[locale] || copy.en;
  return <section className="container-x pt-8 sm:pt-10"><div className="rounded-[32px] border border-forest-600/10 bg-white p-6 shadow-soft sm:p-8"><div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.32em] text-forest-700">{t.eyebrow}</p><h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.title}</h1><p className="mt-3 max-w-2xl text-base text-muted">{t.text}</p><Link href="/ayuda" className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest-700 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-forest-800">{t.cta}<ArrowRight size={16} /></Link></div><div className="grid gap-2 sm:grid-cols-2">{t.steps.map((step, index) => <div key={step} className="rounded-2xl border border-forest-600/10 bg-mint/50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-ink"><CheckCircle2 size={16} className="text-forest-700" />{index + 1}. {step}</div></div>)}</div></div></div></section>;
}
