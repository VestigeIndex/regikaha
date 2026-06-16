import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Check, Crown } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getPlatformStats } from "@/lib/data";
import { formatIntervalPrice, professionalPlans } from "@/lib/pricing";

export const metadata: Metadata = buildMetadata({
  title: "Oferta fundadores",
  description:
    "Los primeros 300 profesionales verificados de RegiKaha reciben 5 meses gratis. Sin comisiones por lead, sin rankings comprados. Únete como miembro fundador.",
  path: "/fundadores",
});

export default function FundadoresPage() {
  const stats = getPlatformStats();
  const claimed = site.founderSlots - stats.foundersRemaining;
  const pct = Math.min(100, Math.round((claimed / site.founderSlots) * 100));

  return (
    <>
      <PageHeader
        eyebrow="Oferta fundadores"
        title={`Primeros ${site.founderSlots} verificados: ${site.founderFreeMonths} meses gratis`}
        description="Sé de los primeros en construir tu reputación en RegiKaha a escala nacional y europea. Como miembro fundador, disfrutas de 5 meses gratis y de la insignia de fundador en tu perfil."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Oferta fundadores" }]}
      >
        <div className="max-w-md">
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>{claimed} plazas reservadas</span>
            <span className="font-medium text-forest-700">{stats.foundersRemaining} disponibles</span>
          </div>
          <div className="h-2.5 rounded-full bg-canvas-alt overflow-hidden ring-1 ring-forest-600/10">
            <div className="h-full rounded-full bg-gradient-to-r from-forest-600 to-forest-500" style={{ width: `${pct}%` }} />
          </div>
          <Link href="/registro" className="btn btn-primary mt-5">Unirme como fundador</Link>
        </div>
      </PageHeader>

      <section className="container-x py-16 grid lg:grid-cols-2 gap-10">
        <div className="card p-7">
          <span className="inline-flex items-center gap-2 text-forest-700 font-semibold">
            <Crown size={18} /> Ventajas de fundador
          </span>
          <ul className="mt-5 space-y-3">
            {[
              `${site.founderFreeMonths} meses gratis en el plan profesional que encaje con tu cobertura`,
              "Insignia de “Fundador” en tu perfil",
              "Antigüedad en el marketplace desde el inicio",
              "Más tiempo para acumular reseñas verificadas",
              "Sin permanencia: continúas solo si quieres",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-ink/85">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-forest-500/12 text-forest-600 shrink-0"><Check size={14} /></span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-7 bg-gradient-to-b from-mint/40 to-white">
          <span className="inline-flex items-center gap-2 text-forest-700 font-semibold">
            <Sparkles size={18} /> Después del periodo gratuito
          </span>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-white ring-1 ring-forest-600/10 p-4 flex items-baseline justify-between">
              <span className="font-medium text-ink">{professionalPlans[0].name}</span>
              <span><span className="text-2xl font-bold text-ink">{formatIntervalPrice(professionalPlans[0], "monthly")}</span></span>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-forest-600/10 p-4 flex items-baseline justify-between">
              <span className="font-medium text-ink">{professionalPlans[1].name}</span>
              <span><span className="text-2xl font-bold text-ink">{formatIntervalPrice(professionalPlans[1], "monthly")}</span></span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Sin comisiones por lead. Sin rankings comprados. Sin pagar por aparecer primero.
          </p>
          <Link href="/precios" className="btn btn-secondary w-full mt-5">Ver todos los precios</Link>
        </div>
      </section>

      <CtaBand
        title="Reserva tu plaza de fundador"
        text={`Quedan ${stats.foundersRemaining} de ${site.founderSlots} plazas con 5 meses gratis.`}
        primary={{ label: "Unirme como fundador", href: "/registro" }}
      />
    </>
  );
}
