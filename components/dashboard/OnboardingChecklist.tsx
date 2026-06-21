"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import type { AccountRole } from "@/lib/accounts";
import { useI18n } from "@/lib/i18n/context";
import { dashboardDictionaries } from "@/lib/i18n/dashboard";

export function OnboardingChecklist({ role }: { role: AccountRole }) {
  const { locale } = useI18n();
  const copy = dashboardDictionaries[locale];
  const [hidden, setHidden] = useState(false);
  const storageKey = `regikaha:onboarding:${role}`;

  useEffect(() => setHidden(window.localStorage.getItem(storageKey) === "1"), [storageKey]);

  const steps = useMemo(() => {
    if (role === "client") return [
      [copy.onboarding.clientProject, "/publicar-proyecto"],
      [copy.onboarding.clientDetails, "/publicar-proyecto"],
      [copy.onboarding.clientSearch, "/buscar"],
      [copy.onboarding.clientFavorites, "/panel/cliente/favoritos"],
      [copy.onboarding.clientCompare, "/panel/cliente/proyectos"],
    ];
    if (role === "professional") return [
      [copy.onboarding.proProfile, "/panel/perfil"],
      [copy.onboarding.proServices, "/panel/servicios"],
      [copy.onboarding.proPreferences, "/panel/preferencias"],
      [copy.onboarding.proWorks, "/regi-works"],
      [copy.onboarding.proQuote, "/regi-works"],
    ];
    return [
      [copy.onboarding.companyData, role === "company" ? "/panel/empresa" : "/panel/subcontrata"],
      [copy.onboarding.companySpecialties, "/panel/servicios"],
      [copy.onboarding.companyRequests, "/panel/solicitudes"],
      [copy.onboarding.companyTeam, "/regi-works"],
      [copy.onboarding.companyDocs, "/regi-works"],
    ];
  }, [copy, role]);

  if (hidden || role === "admin" || role === "superadmin") return null;

  return (
    <section className="mb-8 rounded-[28px] border border-forest-600/10 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest-700">{copy.onboarding.eyebrow}</p><h2 className="mt-2 text-xl font-bold text-ink">{copy.onboarding.title}</h2><p className="mt-1 max-w-2xl text-sm text-muted">{copy.onboarding.subtitle}</p></div>
        <button type="button" onClick={() => { window.localStorage.setItem(storageKey, "1"); setHidden(true); }} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-forest-500/8" aria-label={copy.onboarding.hide}><X size={18} /></button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {steps.map(([label, href], index) => <Link key={label} href={href} className="group rounded-2xl border border-forest-600/10 bg-mint/40 p-4 transition hover:-translate-y-0.5 hover:bg-mint"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-forest-700 ring-1 ring-forest-600/10">{index + 1}</span><ChevronRight size={16} className="text-forest-600 transition group-hover:translate-x-0.5" /></div><p className="mt-3 text-sm font-semibold text-ink">{label}</p></Link>)}
      </div>
      <p className="mt-4 text-xs text-forest-700">{copy.onboarding.note}</p>
    </section>
  );
}
