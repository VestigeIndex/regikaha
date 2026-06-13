import { Check, X, AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { pendingReviews, publishedReviews, getProfessionalById } from "@/lib/data";
import { Stars } from "@/components/ui/Stars";

export default function ModeracionResenasPage() {
  return (
    <>
      <DashboardHeader
        title="Moderación de reseñas"
        subtitle="Filtra fraude e insultos. Las reseñas legítimas no se eliminan."
      />

      <h2 className="font-bold text-ink mb-3 inline-flex items-center gap-2">
        <AlertTriangle size={18} className="text-amber-500" /> Pendientes ({pendingReviews.length})
      </h2>

      {pendingReviews.length === 0 ? (
        <p className="card p-6 text-muted">No hay reseñas pendientes de moderación.</p>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map((r) => {
            const pro = getProfessionalById(r.professionalId);
            return (
              <article key={r.id} className="card p-5 ring-1 ring-amber-300/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{r.clientName} <span className="text-muted font-normal">sobre {pro?.publicName}</span></p>
                    <Stars value={r.rating} size={14} className="mt-1" />
                  </div>
                  <span className="chip bg-amber-100 text-amber-800 ring-0">Sin verificar</span>
                </div>
                <p className="mt-3 text-sm text-ink/80">{r.comment}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn btn-primary text-sm py-2"><Check size={15} /> Publicar</button>
                  <button className="btn btn-secondary text-sm py-2 text-red-700"><X size={15} /> Rechazar (fraude/insultos)</button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <h2 className="font-bold text-ink mb-3 mt-10">Publicadas recientes ({publishedReviews.length})</h2>
      <div className="card divide-y divide-[var(--hairline)]">
        {publishedReviews.slice(0, 6).map((r) => {
          const pro = getProfessionalById(r.professionalId);
          return (
            <div key={r.id} className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{r.clientName} <span className="text-muted font-normal">· {pro?.publicName}</span></p>
                <p className="text-sm text-muted truncate">{r.comment}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Stars value={r.rating} size={13} />
                <span className="chip bg-forest-500/12 text-forest-800 ring-0">Verificada</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
