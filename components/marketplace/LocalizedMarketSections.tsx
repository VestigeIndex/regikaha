"use client";

import Link from "next/link";
import { BadgeCheck, BriefcaseBusiness, Building2, CalendarClock, ClipboardList, FileCheck2, Map, ShieldCheck } from "lucide-react";
import { ProjectRequestForm } from "@/components/marketplace/ProjectRequestForm";
import { PublishGate } from "@/components/marketplace/PublishGate";
import { useT } from "@/lib/i18n/context";

export function SearchFallback({ kind }: { kind: "search" | "map" }) {
  const t = useT();
  return <div className="container-x py-16 text-center text-muted">{t.ui.pageHeaders[kind].fallback}</div>;
}

export function PublishProjectBody() {
  const t = useT();
  return (
    <section className="container-x py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <PublishGate next="/publicar-proyecto">
        <ProjectRequestForm />
      </PublishGate>
      <aside className="card p-6 lg:sticky lg:top-24">
        <h2 className="font-bold text-ink">{t.ui.pages.publishProjectHelpTitle}</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          {t.ui.pages.publishProjectSteps.map((step, index) => (
            <li key={step}><strong className="text-ink">{index + 1}.</strong> {step}</li>
          ))}
        </ol>
        <p className="mt-5 rounded-xl bg-mint/70 p-4 text-sm text-forest-800">
          {t.ui.pages.publishProjectNotice}
        </p>
      </aside>
    </section>
  );
}

export function PublishSubcontractBody() {
  const t = useT();
  return (
    <section className="container-x py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <PublishGate next="/publicar-subcontrata">
        <ProjectRequestForm mode="b2b" />
      </PublishGate>
      <aside className="card p-6 lg:sticky lg:top-24">
        <h2 className="font-bold text-ink">{t.ui.pages.publishSubcontractHelpTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          {t.ui.pages.publishSubcontractBullets.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </aside>
    </section>
  );
}

export function BuildersActions() {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/publicar-subcontrata" className="btn btn-primary">{t.ui.projectForm.publishB2b}</Link>
      <Link href="/mapa" className="btn btn-secondary">{t.ui.actions.searchMap}</Link>
    </div>
  );
}

export function SubcontractorsActions() {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/registro" className="btn btn-primary">{t.ui.register.createProfile}</Link>
      <Link href="/mapa" className="btn btn-secondary">{t.ui.actions.searchMap}</Link>
    </div>
  );
}

export function BuildersCards() {
  const t = useT();
  const icons = [ClipboardList, Map, FileCheck2, Building2];
  return (
    <section className="container-x py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {t.ui.pages.buildersCards.map((item, index) => {
        const Icon = icons[index];
        return (
          <article key={item.title} className="card p-5">
            <Icon size={21} className="text-forest-600" />
            <h2 className="mt-3 font-bold text-ink">{item.title}</h2>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.text}</p>
          </article>
        );
      })}
    </section>
  );
}

export function SubcontractorsCards() {
  const t = useT();
  const icons = [BriefcaseBusiness, ShieldCheck, CalendarClock, BadgeCheck];
  return (
    <section className="container-x py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {t.ui.pages.subcontractorsCards.map((item, index) => {
        const Icon = icons[index];
        return (
          <article key={item.title} className="card p-5">
            <Icon size={21} className="text-forest-600" />
            <h2 className="mt-3 font-bold text-ink">{item.title}</h2>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.text}</p>
          </article>
        );
      })}
    </section>
  );
}
