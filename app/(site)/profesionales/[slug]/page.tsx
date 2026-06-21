import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Clock, Briefcase, CalendarCheck, Languages, ShieldCheck, FileText,
  BadgeCheck, Phone, Award, Building2, Star,
} from "lucide-react";
import {
  getProfessionalBySlug, publicProfessionals, getServicesByProfessional,
  getReviewsByProfessional, getPortfolioByProfessional, getCategoryById,
} from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge, StatusBadge, TrustChip } from "@/components/ui/Badges";
import { Stars, RatingInline } from "@/components/ui/Stars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { PortfolioCard } from "@/components/marketplace/PortfolioCard";
import { ReviewCard } from "@/components/marketplace/ReviewCard";
import { QuoteForm } from "@/components/marketplace/QuoteForm";
import { ServiceAreaMap } from "@/components/marketplace/ServiceAreaMap";
import { JsonLd } from "@/components/ui/JsonLd";
import { professionalSchema, breadcrumbSchema, professionalSeoTitle } from "@/lib/seo";
import { formatPriceFrom, plural } from "@/lib/utils";

export function generateStaticParams() {
  const params = publicProfessionals.map((p) => ({ slug: p.slug }));
  return params.length ? params : [{ slug: "__dynamic__" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  if (!pro) return { title: "Profesional no encontrado" };
  const primary = getCategoryById(pro.categoryIds[0]);
  const country = pro.country || "Europa";
  return {
    title: professionalSeoTitle(pro, primary),
    description: `${pro.shortTagline}. Compara precios orientativos, portfolio, valoraciones reales (${pro.averageRating}/5) y zona de servicio de ${pro.publicName} en ${pro.city}, ${country}. Pide pre-presupuesto gratis en Regi Kaha.`,
    alternates: { canonical: `/profesionales/${pro.slug}` },
  };
}

const subRatings = [
  { key: "qualityRating", label: "Calidad" },
  { key: "priceRating", label: "Precio" },
  { key: "communicationRating", label: "Comunicación" },
  { key: "punctualityRating", label: "Puntualidad" },
  { key: "professionalismRating", label: "Profesionalidad" },
] as const;

export default async function ProfessionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pro = getProfessionalBySlug(slug);
  if (!pro) notFound();

  const categories = pro.categoryIds.map((id) => getCategoryById(id)).filter(Boolean);
  const categoryNames = categories.map((c) => c!.name);
  const servicesList = getServicesByProfessional(pro.id);
  const reviews = getReviewsByProfessional(pro.id);
  const portfolio = getPortfolioByProfessional(pro.id);
  const country = pro.country || "Europa";

  const avgSub = (key: (typeof subRatings)[number]["key"]) =>
    reviews.length ? reviews.reduce((s, r) => s + r[key], 0) / reviews.length : 0;

  const facts = [
    { icon: Briefcase, label: "Proyectos", value: `${pro.completedProjects}` },
    { icon: CalendarCheck, label: "Experiencia", value: `${pro.yearsExperience} años` },
    { icon: Clock, label: "Responde en", value: `${pro.responseTimeHours} h` },
    { icon: Star, label: "Valoración", value: pro.reviewCount ? `${pro.averageRating}/5` : "—" },
  ];

  return (
    <article>
      <JsonLd
        data={[
          professionalSchema(pro, categoryNames),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Profesionales", path: "/buscar" },
            { name: pro.publicName, path: `/profesionales/${pro.slug}` },
          ]),
        ]}
      />

      {/* Portada */}
      <div className="relative h-44 sm:h-56 lg:h-64 overflow-hidden bg-gradient-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pro.coverImage} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
      </div>

      <div className="container-x">
        <div className="-mt-12 relative">
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Profesionales", path: "/buscar" },
              { name: pro.publicName },
            ]}
          />
        </div>

        {/* Cabecera del perfil */}
        <div className="mt-4 flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={pro.publicName} color={pro.logoColor} src={pro.logoImage} size={92} className="ring-4 ring-white shadow-card" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">{pro.publicName}</h1>
              {pro.verificationStatus === "verified" ? <VerifiedBadge /> : <StatusBadge status={pro.verificationStatus} />}
              {pro.founderMember && (
                <span className="chip bg-ink text-white ring-0">
                  <Award size={13} /> Fundador
                </span>
              )}
            </div>
            <p className="mt-1.5 text-muted inline-flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1"><Building2 size={15} className="text-forest-500" />{pro.typeLabel}</span>
              <span className="inline-flex items-center gap-1"><MapPin size={15} className="text-forest-500" />{pro.city}, {pro.province}, {country}</span>
            </p>
            <div className="mt-2.5">
              <RatingInline value={pro.averageRating} count={pro.reviewCount} size={16} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {categoryNames.map((n) => (
                <span key={n} className="chip">{n}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-10 items-start pb-8">
          <div className="space-y-12 min-w-0">
            {/* Stats rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {facts.map((f) => (
                <div key={f.label} className="card p-4">
                  <f.icon size={18} className="text-forest-600" />
                  <p className="mt-2 text-lg font-bold text-ink leading-none">{f.value}</p>
                  <p className="text-xs text-muted mt-1">{f.label}</p>
                </div>
              ))}
            </div>

            {/* Sobre */}
            <section>
              <h2 className="text-xl font-bold text-ink">Sobre {pro.publicName}</h2>
              <p className="mt-3 text-ink/80 leading-relaxed">{pro.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {pro.insuranceDeclared && <TrustChip icon="insurance" label="Seguro de responsabilidad civil" />}
                {pro.invoiceDeclared && <TrustChip icon="invoice" label="Trabaja con factura" />}
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <InfoRow icon={MapPin} label="Zona de servicio" value={`${pro.serviceArea} · radio ${pro.serviceRadiusKm} km`} />
                <InfoRow icon={Languages} label="Idiomas" value={pro.languages.join(", ")} />
                <InfoRow icon={Award} label="Especialidades" value={pro.specialties.join(", ")} />
                {pro.certifications.length > 0 && (
                  <InfoRow icon={ShieldCheck} label="Certificaciones" value={pro.certifications.join(", ")} />
                )}
              </div>
            </section>

            <ServiceAreaMap
              query={`${pro.serviceArea}, ${pro.city}, ${pro.province}, ${country}`}
              label={`${pro.serviceArea}, ${country}`}
              radiusKm={pro.serviceRadiusKm}
            />

            {/* Servicios */}
            {servicesList.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-ink">Servicios</h2>
                <p className="text-sm text-muted mt-1">Precios orientativos. Pide una estimación inicial no vinculante.</p>
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  {servicesList.map((s) => (
                    <ServiceCard key={s.id} service={s} pro={pro} />
                  ))}
                </div>
              </section>
            )}

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-ink">Trabajos realizados</h2>
                <p className="text-sm text-muted mt-1">Pasa el cursor sobre una imagen para ver el antes.</p>
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  {portfolio.map((item) => (
                    <PortfolioCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* Reseñas */}
            <section>
              <h2 className="text-xl font-bold text-ink">
                Valoraciones {pro.reviewCount > 0 && <span className="text-muted font-normal text-base">({pro.reviewCount})</span>}
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-muted text-sm">Todavía no tiene valoraciones publicadas.</p>
              ) : (
                <>
                  <div className="mt-4 card p-5 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
                    <div className="text-center sm:pr-6 sm:border-r hairline">
                      <p className="text-4xl font-bold text-ink">{pro.averageRating}</p>
                      <Stars value={pro.averageRating} size={16} className="justify-center mt-1" />
                      <p className="text-xs text-muted mt-1">{pro.reviewCount} {plural(pro.reviewCount, "reseña", "reseñas")}</p>
                    </div>
                    <div className="space-y-2">
                      {subRatings.map((sr) => {
                        const v = avgSub(sr.key);
                        return (
                          <div key={sr.key} className="flex items-center gap-3 text-sm">
                            <span className="w-32 text-muted">{sr.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-canvas-alt overflow-hidden">
                              <div className="h-full rounded-full bg-forest-500" style={{ width: `${(v / 5) * 100}%` }} />
                            </div>
                            <span className="w-8 text-right font-medium text-ink">{v.toFixed(1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {reviews.map((r) => (
                      <ReviewCard key={r.id} review={r} professionalName={pro.publicName} />
                    ))}
                  </div>
                </>
              )}
              <p className="mt-4 text-xs text-muted">
                Las valoraciones son verificadas. Ningún profesional puede pagar para mejorar su puntuación u ocultar opiniones legítimas.{" "}
                <Link href="/legal/politica-resenas" className="underline hover:text-forest-700">Política de reseñas</Link>.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="card p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Estimación desde</span>
                <span className="text-xl font-bold text-ink">{formatPriceFrom(pro.priceFrom)}</span>
              </div>
              <div className="mt-4 border-t hairline pt-4">
                <h3 id="solicitar" className="font-semibold text-ink mb-3">Pide pre-presupuesto gratis</h3>
                <QuoteForm
                  professionalName={pro.publicName}
                  professionalId={pro.id}
                  categoryId={pro.categoryIds[0]}
                  compact
                />
              </div>
            </div>

            <div className="card p-5">
              <a href="#solicitar" className="btn btn-secondary w-full">
                <Phone size={16} /> Contactar
              </a>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center gap-2 text-muted"><BadgeCheck size={15} className="text-forest-600" /> Profesional {pro.verificationStatus === "verified" ? "verificado" : pro.verificationStatus}</li>
                <li className="flex items-center gap-2 text-muted"><Clock size={15} className="text-forest-600" /> Responde en ~{pro.responseTimeHours} h</li>
                {pro.invoiceDeclared && <li className="flex items-center gap-2 text-muted"><FileText size={15} className="text-forest-600" /> Trabaja con factura</li>}
                {pro.insuranceDeclared && <li className="flex items-center gap-2 text-muted"><ShieldCheck size={15} className="text-forest-600" /> Con seguro de R. C.</li>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={17} className="text-forest-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-ink/85">{value}</p>
      </div>
    </div>
  );
}
