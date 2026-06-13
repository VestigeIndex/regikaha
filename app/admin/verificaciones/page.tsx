import { Check, X, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { verificationRequests } from "@/lib/data/operations";
import { getProfessionalById } from "@/lib/data";
import { StatusBadge } from "@/components/ui/Badges";

const checkLabels: Record<string, string> = {
  identity: "Identidad",
  nifCif: "NIF / CIF",
  email: "Email",
  phone: "Teléfono",
  insurance: "Seguro R. C.",
  portfolio: "Portfolio real",
};

export default function VerificacionesPage() {
  return (
    <>
      <DashboardHeader title="Verificaciones" subtitle="Comprueba la documentación antes de mostrar el sello de verificado." />

      <div className="space-y-4">
        {verificationRequests.map((v) => {
          const pro = getProfessionalById(v.professionalId);
          return (
            <article key={v.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="font-semibold text-ink">{v.professionalName}</h2>
                  <p className="text-xs text-muted mt-0.5">
                    {pro?.typeLabel} · {pro?.city} · enviado el {new Date(v.submittedAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(v.checks).map(([key, ok]) => (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                      ok ? "bg-forest-500/12 text-forest-800 ring-forest-500/25" : "bg-slate-50 text-slate-500 ring-slate-200"
                    }`}
                  >
                    {ok ? <Check size={13} /> : <Clock size={13} />}
                    {checkLabels[key] ?? key}
                  </span>
                ))}
              </div>

              {v.notes && <p className="mt-3 text-sm text-muted bg-canvas rounded-xl px-3.5 py-2.5">{v.notes}</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn btn-primary text-sm py-2"><Check size={15} /> Aprobar verificación</button>
                <button className="btn btn-secondary text-sm py-2">Marcar como limitado</button>
                <button className="btn btn-secondary text-sm py-2 text-red-700"><X size={15} /> Rechazar</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
