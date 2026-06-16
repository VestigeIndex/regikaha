"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Category, Professional, ServiceItem } from "@/lib/types";
import { getCategoryIcon } from "@/lib/icons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProfessionalCard } from "@/components/marketplace/ProfessionalCard";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n/context";
import { useLocalizedCategory } from "@/lib/i18n/useLocalizedContent";
import { site } from "@/lib/site";

export function LocalizedCategoryPage({
  category,
  pros,
  servicesList,
  related,
  serviceProfessionals,
}: {
  category: Category;
  pros: Professional[];
  servicesList: ServiceItem[];
  related: Category[];
  serviceProfessionals: Record<string, Professional>;
}) {
  const t = useT();
  const displayCategory = useLocalizedCategory(category);
  const Icon = getCategoryIcon(displayCategory.icon);
  const categoryNameLower = displayCategory.name.toLocaleLowerCase();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero border-b hairline">
        <div className="absolute inset-0 bg-grid-soft bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="container-x relative py-12 lg:py-16">
          <Breadcrumbs
            items={[
              { name: t.ui.common.home, path: "/" },
              { name: t.ui.common.categories, path: "/categorias" },
              { name: displayCategory.name },
            ]}
          />
          <div className="mt-6 flex items-start gap-4 max-w-3xl">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-forest-600 text-white shadow-soft shrink-0">
              <Icon size={26} />
            </span>
            <div>
              <h1 className="text-[2rem] sm:text-4xl font-bold tracking-tight text-ink text-balance">
                {displayCategory.name}
              </h1>
              <p className="mt-3 text-lg text-muted leading-relaxed">{displayCategory.description}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {displayCategory.popularServices.map((service) => (
              <span key={service} className="chip">{service}</span>
            ))}
          </div>
          <div className="mt-7">
            <Link href={`/buscar?cat=${displayCategory.id}`} className="btn btn-primary">
              {t.ui.categoryPage.ctaView} {pros.length}{" "}
              {pros.length === 1 ? t.ui.categoryPage.professionalsSingular : t.ui.categoryPage.professionalsPlural}{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-ink">{t.ui.categoryPage.professionalsOf} {categoryNameLower}</h2>
            <p className="text-sm text-muted mt-1">{t.ui.categoryPage.meritOrder}</p>
          </div>
          <Link href={`/buscar?cat=${displayCategory.id}`} className="btn btn-secondary shrink-0">
            {t.ui.categoryPage.viewAll} <ArrowRight size={16} />
          </Link>
        </div>

        {pros.length === 0 ? (
          <p className="mt-8 text-muted">{t.ui.categoryPage.empty}</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pros.slice(0, 6).map((pro, index) => (
              <Reveal key={pro.id} delay={(index % 3) * 70}>
                <ProfessionalCard pro={pro} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {servicesList.length > 0 && (
        <section className="bg-canvas border-y hairline">
          <div className="container-x py-14">
            <h2 className="text-2xl font-bold text-ink">{t.ui.categoryPage.popularServices}</h2>
            <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {servicesList.map((service) => {
                const pro = serviceProfessionals[service.professionalId];
                return pro ? <ServiceCard key={service.id} service={service} pro={pro} /> : null;
              })}
            </div>
          </div>
        </section>
      )}

      <section className="container-x py-14">
        <div className="rounded-3xl bg-gradient-brand text-white p-8 sm:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-balance">
              {t.ui.categoryPage.trustTitlePrefix} {categoryNameLower} {t.ui.categoryPage.trustTitleSuffix}
            </h2>
            <p className="mt-3 text-white/85 leading-relaxed">
              {t.ui.categoryPage.trustText}
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {t.ui.categoryPage.trustBullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2.5 text-sm text-white/90">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-white/15 shrink-0"><Check size={14} /></span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-16">
        <h2 className="text-xl font-bold text-ink mb-6">{t.ui.categoryPage.related}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <CategoryCard key={item.id} category={item} variant="compact" />
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          {t.ui.categoryPage.proJoinPrefix} {categoryNameLower}?{" "}
          <Link href="/registro" className="font-semibold text-forest-700 hover:underline">
            {t.ui.categoryPage.proJoinSuffix.replace("RegiKaha", site.name)}
          </Link>{" "}
          {t.ui.categoryPage.joinAndGetClients}
        </p>
      </section>
    </>
  );
}
