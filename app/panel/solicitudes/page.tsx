import { Mail, Phone, MapPin } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { QuoteStatusBadge } from "@/components/dashboard/QuoteStatusBadge";
import { getQuotesByProfessional } from "@/lib/data/operations";
import { getCategoryById } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

const ME = "pro-reformas-costa";

export default function SolicitudesPage() {
  const quotes = getQuotesByProfessional(ME);

  return (
    <>
      <DashboardHeader title="Solicitudes de presupuesto" subtitle="Clientes que han contactado a través de tu perfil." />

      <div className="space-y-4">
        {quotes.map((q) => {
          const cat = getCategoryById(q.categoryId);
          return (
            <article key={q.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-ink">{q.clientName}</h2>
                    {cat && <span className="chip">{cat.name}</span>}
                  </div>
                  <p className="text-xs text-muted mt-1 inline-flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-forest-500" />{q.location}</span>
                    <span>{q.budgetRange}</span>
                    <span>{timeAgo(q.createdAt)}</span>
                  </p>
                </div>
                <QuoteStatusBadge status={q.status} />
              </div>

              <p className="mt-3 text-sm text-ink/80 leading-relaxed">{q.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${q.clientEmail}`} className="btn btn-secondary text-sm py-2">
                  <Mail size={15} /> {q.clientEmail}
                </a>
                <a href={`tel:${q.clientPhone}`} className="btn btn-secondary text-sm py-2">
                  <Phone size={15} /> {q.clientPhone}
                </a>
                <button className="btn btn-primary text-sm py-2">Enviar presupuesto</button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted">
        Los datos de contacto se muestran completos solo a profesionales verificados. En RegiNova no
        se cobra por lead ni por mensaje.
      </p>
    </>
  );
}
