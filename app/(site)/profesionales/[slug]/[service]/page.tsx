import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, Clock, MapPin, ListChecks, HelpCircle, ArrowRight } from "lucide-react";
import {
  getProfessionalBySlug, getServiceBySlug, getServicesByProfessional,
  publicProfessionals, getCategoryById,
} from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badges";
import { RatingInline } from "@/components/ui/Stars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteForm } from "@/components/marketplace/QuoteForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { formatPriceFrom, priceTypeLabel } from "@/lib/utils";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return publicProfessionals.flatMap((p) =>
    getServicesByProfessional(p.id).map((s) => ({ slug: p.slug, service: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}): Promise<Metadata> {
  const { slug, service } = await params;
  const pro = getProfessionalBySlug(slug);
  const svc = pro ? getServiceBySlug(pro.id, service) : undefined;
  if (!pro || !svc) return { title: "Servicio no encontrado" };
  const country = pro.country || "España";
  return {
    title: `${svc.title} en ${pro.city}, ${country} — ${pro.publicName} | ${site.name}`,
    description: `${svc.description} ${priceTypeLabel(svc.priceType)} ${formatPriceFrom(svc.priceFrom)}. Pide pre-presupuesto inicial a ${pro.publicName}, profesional verificado en RegiKaha.`,
    alternates: { canonical: `/profesionales/${pro.slug}/${svc.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}) {
  const { slug, service } = await params;
  const pro = getProfessionalBySlug(slug);
  const svc = pro ? getServiceBySlug(pro.id, service) : undefined;
  if (!pro || !svc) notFound();

  const category = getCategoryById(svc.categoryId);
  const country = pro.country || "España";

  return (
    <article className="pb-8">
      <JsonLd
        data={[
          serviceSchema(svc, pro),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: pro.publicName, path: `/profesionales/${pro.slug}` },
            { name: svc.title, path: `/profesionales/${pro.slug}/${svc.slug}` },
          ]),
          ...(svc.faqs.length ? [faqSchema(svc.faqs)] : []),
        ]}
      />

      <div className="bg-gradient-hero border-b hairline">
        <div className="container-x py-10 lg:py-12">
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: pro.publicName, path: `/profesionales/${pro.slug}` },
              { name: svc.title },
            ]}
          />
          {category && (
            <Link href={`/categorias/${category.slug}`} className="chip mt-5">{category.name}</Link>
          )}
          <h1 className="mt-3 text-3xl lg:text-[2.5rem] font-bold tracking-tight text-ink text-balance max-w-3xl">
            {svc.title} en {pro.city}, {country}
          </h1>
          <p className="mt-3 text-muted inline-flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1"><Clock size={15} className="text-forest-500" />{svc.estimatedTime}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={15} className="text-forest-500" />{svc.serviceArea}</span>
          </p>
        </div>
      </div>

      <div className="container-x mt-10 grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="space-y-10 min-w-0">
          <p className="text-lg text-ink/85 leading-relaxed">{svc.description}</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card p-5">
              <h2 className="font-semibold text-ink inline-flex items-center gap-2">
                <Check size={18} className="text-forest-600" /> Qué incluye
              </h2>
              <ul className="mt-3 space-y-2">
                {svc.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                    <Check size={15} className="text-forest-600 mt-0.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h2 className="font-semibold text-ink inline-flex items-center gap-2">
                <X size={18} className="text-muted" /> Qué no incluye
              </h2>
              <ul className="mt-3 space-y-2">
                {svc.excludes.length ? svc.excludes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <X size={15} className="mt-0.5 shrink-0" /> {i}
                  </li>
                )) : <li className="text-sm text-muted">Se detalla en el pre-presupuesto inicial.</li>}
              </ul>
            </div>
          </div>

          {svc.process.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-ink inline-flex items-center gap-2">
                <ListChecks size={20} className="text-forest-600" /> Cómo trabajamos
              </h2>
              <ol className="mt-4 grid sm:grid-cols-2 gap-3">
                {svc.process.map((step, i) => (
                  <li key={step} className="card p-4 flex items-start gap-3">
                    <span className="grid place-items-center h-7 w-7 rounded-full bg-forest-600 text-white text-sm font-bold shrink-0">{i + 1}</span>
                    <span className="text-sm text-ink/85">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {svc.faqs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-ink inline-flex items-center gap-2">
                <HelpCircle size={20} className="text-forest-600" /> Preguntas frecuentes
              </h2>
              <div className="mt-4 space-y-3">
                {svc.faqs.map((f) => (
                  <details key={f.q} className="card p-5 group">
                    <summary className="font-medium text-ink cursor-pointer list-none flex items-center justify-between gap-3">
                      {f.q}
                      <span className="text-forest-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted">{priceTypeLabel(svc.priceType)}</span>
              <span className="text-2xl font-bold text-ink">{formatPriceFrom(svc.priceFrom)}</span>
            </div>
            <div className="mt-4 pt-4 border-t hairline">
              <QuoteForm
                professionalName={pro.publicName}
                professionalId={pro.id}
                categoryId={svc.categoryId}
                serviceId={svc.id}
                serviceTitle={svc.title}
                compact
              />
            </div>
          </div>

          <Link href={`/profesionales/${pro.slug}`} className="card card-hover p-4 flex items-center gap-3">
            <Avatar name={pro.publicName} color={pro.logoColor} size={46} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-ink truncate">{pro.publicName}</span>
                {pro.verificationStatus === "verified" && <VerifiedBadge size="sm" />}
              </div>
              <div className="mt-0.5"><RatingInline value={pro.averageRating} count={pro.reviewCount} size={13} /></div>
            </div>
            <ArrowRight size={16} className="text-forest-400 ml-auto shrink-0" />
          </Link>
        </aside>
      </div>
    </article>
  );
}
