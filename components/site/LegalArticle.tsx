import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export interface LegalSection {
  h: string;
  p: string[];
}

/**
 * Plantilla de página legal. El contenido es un punto de partida realista y
 * debe ser revisado por un profesional jurídico antes de producción.
 */
export function LegalArticle({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container-x py-12 lg:py-16 max-w-3xl">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Legal", path: "/legal/aviso-legal" }, { name: title }]} />
      <h1 className="mt-5 text-3xl lg:text-4xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">Última actualización: {updated}</p>

      {intro && <p className="mt-6 text-muted leading-relaxed">{intro}</p>}

      <div className="mt-8 space-y-7">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-ink">{`${i + 1}. ${s.h}`}</h2>
            {s.p.map((para, j) => (
              <p key={j} className="mt-2.5 text-[0.95rem] text-ink/80 leading-relaxed">{para}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-canvas ring-1 ring-forest-600/10 p-4 text-xs text-muted">
        Este documento es una plantilla orientativa para la fase inicial de RegiNova y debe ser
        revisado y adaptado por un asesor legal antes de su publicación definitiva.
      </div>
    </div>
  );
}
