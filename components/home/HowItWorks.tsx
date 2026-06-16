"use client";

import Link from "next/link";
import { Search, GitCompare, MessageSquareQuote, CheckCircle2, UserPlus, BadgeCheck, FolderOpen, Inbox } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useT } from "@/lib/i18n/context";

const clientIcons = [Search, GitCompare, MessageSquareQuote, CheckCircle2];
const professionalIcons = [UserPlus, BadgeCheck, FolderOpen, Inbox];


export function HowItWorks() {
  const t = useT();
  const clientSteps = t.ui.homeSections.howItWorks.clientSteps.map((step, index) => ({
    ...step,
    icon: clientIcons[index],
  }));
  const proSteps = t.ui.homeSections.howItWorks.professionalSteps.map((step, index) => ({
    ...step,
    icon: professionalIcons[index],
  }));

  return (
    <section className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow={t.ui.homeSections.howItWorks.eyebrow}
        title={t.ui.homeSections.howItWorks.title}
        align="center"
      />

      <div className="mt-12 grid lg:grid-cols-2 gap-10">
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-ink">{t.ui.homeSections.howItWorks.clientsTitle}</h3>
          <ol className="mt-6 space-y-5">
            {clientSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="relative grid place-items-center h-10 w-10 rounded-xl bg-forest-500/12 text-forest-600 shrink-0">
                  <s.icon size={19} />
                  <span className="absolute -top-1.5 -right-1.5 grid place-items-center h-5 w-5 rounded-full bg-forest-600 text-white text-[0.65rem] font-bold">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="text-sm text-muted leading-relaxed mt-0.5">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/buscar" className="btn btn-primary mt-7 w-full">{t.ui.homeSections.howItWorks.clientCta}</Link>
        </div>

        <div className="card p-6 sm:p-8 bg-gradient-to-b from-mint/40 to-white">
          <h3 className="text-lg font-bold text-ink">{t.ui.homeSections.howItWorks.professionalsTitle}</h3>
          <ol className="mt-6 space-y-5">
            {proSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="relative grid place-items-center h-10 w-10 rounded-xl bg-forest-600 text-white shrink-0">
                  <s.icon size={19} />
                  <span className="absolute -top-1.5 -right-1.5 grid place-items-center h-5 w-5 rounded-full bg-ink text-white text-[0.65rem] font-bold">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="text-sm text-muted leading-relaxed mt-0.5">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/registro" className="btn btn-secondary mt-7 w-full">{t.ui.homeSections.howItWorks.professionalCta}</Link>
        </div>
      </div>
    </section>
  );
}
