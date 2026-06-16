import type { Metadata } from "next";
import Link from "next/link";
import { Globe, FolderKanban, Inbox, Star, Scale, Wallet, BadgeCheck, Check } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatIntervalPrice, professionalPlans } from "@/lib/pricing";

export const metadata: Metadata = buildMetadata({
  title: "Para profesionales",
  description:
    "Consigue clientes para tus servicios de reformas, construcción o mantenimiento en tu país o en más regiones europeas. Página SEO propia, portfolio, solicitudes directas y ranking justo. Sin pagar por leads.",
  path: "/para-profesionales",
});

const benefits = [
  { icon: Globe, title: "Página SEO propia", text: "Tu perfil indexable en Google con tu nombre, ciudad y servicios." },
  { icon: FolderKanban, title: "Portfolio y servicios ilimitados", text: "Muestra tus trabajos realizados y publica todos tus servicios." },
  { icon: Inbox, title: "Solicitudes de clientes", text: "Recibe solicitudes reales y responde con pre-presupuestos iniciales no vinculantes." },
  { icon: Star, title: "Reseñas verificadas", text: "Construye reputación con valoraciones reales de clientes." },
  { icon: Scale, title: "Ranking justo", text: "Destaca por mérito. Nadie compra posiciones por encima de ti." },
  { icon: Wallet, title: "Sin pagar por leads", text: "Cuota fija simple. Sin comisiones por mensaje ni por contacto." },
];

export default function ParaProfesionalesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Para profesionales"
        title="Consigue clientes en tu país y escala hacia Europa cuando estés listo"
        description="Crea tu perfil profesional, publica tus servicios, muestra tu portfolio y recibe solicitudes de clientes según tu zona real de cobertura."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Para profesionales" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/registro" className="btn btn-primary text-base">Crear mi perfil</Link>
          <Link href="/precios" className="btn btn-secondary text-base">Ver precios</Link>
        </div>
      </PageHeader>

      <section className="container-x py-16">
        <SectionHeading eyebrow="Beneficios" title="Todo lo que necesitas para captar clientes" align="center" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 70}>
              <div className="card card-hover p-6 h-full">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-forest-500/12 text-forest-600">
                  <b.icon size={21} />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-canvas border-y hairline">
        <div className="container-x py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="eyebrow">Oferta fundadores</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink text-balance">
              Primeros {site.founderSlots} verificados: {site.founderFreeMonths} meses gratis
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Únete ahora como miembro fundador. Después puedes empezar con {formatIntervalPrice(professionalPlans[0], "monthly")} o ampliar con{" "}
              {formatIntervalPrice(professionalPlans[1], "monthly")}.
            </p>
            <ul className="mt-5 space-y-2.5">
              {["Sin comisiones por lead", "Sin rankings comprados", "Sin pagar por aparecer primero", "Cancela cuando quieras"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-ink/80">
                  <span className="grid place-items-center h-6 w-6 rounded-full bg-forest-500/12 text-forest-600 shrink-0"><Check size={14} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/registro" className="btn btn-primary mt-7">Unirme como fundador</Link>
          </div>
          <div className="card p-7">
            <div className="flex items-center gap-2 text-forest-700">
              <BadgeCheck size={20} /> <span className="font-semibold">Planes profesionales</span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{professionalPlans[0].shortName}</span>
                <span className="text-lg font-bold text-ink">{formatIntervalPrice(professionalPlans[0], "monthly")}</span>
              </p>
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{professionalPlans[1].shortName}</span>
                <span className="text-lg font-bold text-ink">{formatIntervalPrice(professionalPlans[1], "monthly")}</span>
              </p>
            </div>
            <p className="text-sm text-muted mt-2">Las tarifas anuales tienen un 10% de descuento.</p>
            <div className="mt-5 rounded-xl bg-mint/60 ring-1 ring-forest-600/12 p-4 text-sm text-forest-800">
              Si estás entre los primeros 300 verificados, tus primeros {site.founderFreeMonths} meses son gratis.
            </div>
            <Link href="/registro" className="btn btn-primary w-full mt-5">Empezar gratis</Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Empieza a recibir solicitudes de clientes"
        text="Crea tu perfil en minutos y destaca por tu trabajo, no por tu presupuesto en publicidad."
        primary={{ label: "Crear mi perfil", href: "/registro" }}
        secondary={{ label: "Cómo funciona", href: "/como-funciona" }}
      />
    </>
  );
}
