export const dynamic = "force-dynamic";

import Link from "next/link";

export default function ClientMessagesPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Panel cliente</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Mensajes</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Aquí aparecerán las conversaciones con profesionales cuando empiecen a responder a tus proyectos.
        </p>
      </div>

      <div className="rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/70 p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-950">Todavía no tienes mensajes</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Publica una solicitud y RegiKaha te ayudará a recibir respuestas de profesionales verificados.
        </p>
        <Link href="/publicar-proyecto" className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
          Publicar proyecto gratis
        </Link>
      </div>
    </section>
  );
}
