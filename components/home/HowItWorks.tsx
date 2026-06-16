import Link from "next/link";
import { Search, GitCompare, MessageSquareQuote, CheckCircle2, UserPlus, BadgeCheck, FolderOpen, Inbox } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const clientSteps = [
  { icon: Search, title: "Busca el servicio que necesitas", text: "Filtra por categoría, zona, valoración y disponibilidad." },
  { icon: GitCompare, title: "Compara profesionales verificados", text: "Revisa portfolios, precios orientativos y reseñas reales." },
  { icon: MessageSquareQuote, title: "Pide pre-presupuesto o contacta", text: "Envía tu solicitud gratis y recibe estimaciones iniciales no vinculantes." },
  { icon: CheckCircle2, title: "Elige con confianza", text: "Decide con más información y menos riesgo." },
];

const proSteps = [
  { icon: UserPlus, title: "Crea tu perfil", text: "Página profesional con SEO propio en minutos." },
  { icon: BadgeCheck, title: "Verifica tu actividad", text: "Genera confianza con el sello de verificado." },
  { icon: FolderOpen, title: "Publica servicios y portfolio", text: "Muestra tus trabajos realizados y precios desde." },
  { icon: Inbox, title: "Recibe solicitudes", text: "Clientes que buscan exactamente lo que ofreces." },
];

export function HowItWorks() {
  return (
    <section className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Simple para clientes, justo para profesionales"
        align="center"
      />

      <div className="mt-12 grid lg:grid-cols-2 gap-10">
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-ink">Para clientes</h3>
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
          <Link href="/buscar" className="btn btn-primary mt-7 w-full">Buscar profesionales</Link>
        </div>

        <div className="card p-6 sm:p-8 bg-gradient-to-b from-mint/40 to-white">
          <h3 className="text-lg font-bold text-ink">Para profesionales</h3>
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
          <Link href="/registro" className="btn btn-secondary mt-7 w-full">Crear mi perfil profesional</Link>
        </div>
      </div>
    </section>
  );
}
