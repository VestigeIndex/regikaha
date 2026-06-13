import { Scale, XCircle, CheckCircle2 } from "lucide-react";

const noList = [
  "Ranking comprado",
  "Pago por aparecer primero",
  "Comisión por lead o por mensaje",
  "Créditos artificiales",
];
const yesList = [
  "Calidad y trabajos reales",
  "Valoraciones verificadas",
  "Precio justo y transparente",
  "Rapidez de respuesta",
];

export function FairRanking() {
  return (
    <section className="relative overflow-hidden bg-gradient-brand text-white">
      <div className="absolute inset-0 bg-grid-soft bg-grid opacity-10" />
      <div className="container-x relative py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mint">
              <Scale size={15} /> Ranking justo
            </span>
            <h2 className="mt-3 text-3xl lg:text-[2.4rem] font-bold tracking-tight text-balance">
              En RegiKaha nadie paga por aparecer primero
            </h2>
            <p className="mt-4 text-white/85 leading-relaxed max-w-xl">
              Los profesionales destacan por su reputación, calidad, precio justo, trabajos reales y
              valoraciones verificadas. Todos compiten por mérito, con las mismas reglas.
            </p>
            <p className="mt-4 text-white/85 leading-relaxed max-w-xl">
              Las valoraciones son verificadas. Ningún profesional puede pagar para mejorar su
              puntuación, ocultar opiniones legítimas o comprar posiciones.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 p-5 backdrop-blur">
              <p className="font-semibold text-white/90 mb-3">Lo que no hacemos</p>
              <ul className="space-y-2.5">
                {noList.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-white/85">
                    <XCircle size={17} className="text-white/60 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-5 text-ink shadow-elevated">
              <p className="font-semibold mb-3">Lo que premia el ranking</p>
              <ul className="space-y-2.5">
                {yesList.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-ink/80">
                    <CheckCircle2 size={17} className="text-forest-600 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
