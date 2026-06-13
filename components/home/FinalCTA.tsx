import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="container-x pb-20">
      <div className="rounded-3xl border hairline bg-canvas p-8 sm:p-12 text-center">
        <h2 className="text-3xl lg:text-[2.3rem] font-bold tracking-tight text-ink text-balance max-w-2xl mx-auto">
          Tu próximo proyecto empieza comparando profesionales verificados
        </h2>
        <p className="mt-4 text-muted leading-relaxed max-w-xl mx-auto">
          Gratis para clientes. Sin rankings comprados. Solo profesionales verificados que destacan
          por su trabajo.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/buscar" className="btn btn-primary text-base">
            Buscar profesionales <ArrowRight size={18} />
          </Link>
          <Link href="/registro" className="btn btn-secondary text-base">
            Unirme como profesional
          </Link>
        </div>
      </div>
    </section>
  );
}
