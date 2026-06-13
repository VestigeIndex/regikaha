import { Plus, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { getProfessionalById, getServicesByProfessional, getCategoryById } from "@/lib/data";
import { formatPriceFrom, priceTypeLabel } from "@/lib/utils";

const ME = "pro-reformas-costa";

export default function ServiciosPage() {
  const pro = getProfessionalById(ME)!;
  const services = getServicesByProfessional(ME);

  return (
    <>
      <DashboardHeader
        title="Mis servicios"
        subtitle="Publica servicios ilimitados. Cada uno genera su página SEO."
        action={<button className="btn btn-primary text-sm"><Plus size={16} /> Nuevo servicio</button>}
      />

      <div className="space-y-3">
        {services.map((s) => {
          const cat = getCategoryById(s.categoryId);
          return (
            <article key={s.id} className="card p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-ink">{s.title}</h2>
                  {cat && <span className="chip">{cat.name}</span>}
                  <span className="inline-flex items-center gap-1 text-xs text-forest-700 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-forest-500" /> Activo
                  </span>
                </div>
                <p className="text-sm text-muted mt-1.5 line-clamp-1 max-w-xl">{s.description}</p>
                <p className="text-sm mt-2">
                  <span className="text-muted">{priceTypeLabel(s.priceType)} </span>
                  <span className="font-bold text-ink">{formatPriceFrom(s.priceFrom)}</span>
                  <span className="text-muted"> · {s.estimatedTime}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/profesionales/${pro.slug}/${s.slug}`} className="btn btn-secondary text-sm py-2">
                  <Eye size={15} /> Ver
                </Link>
                <button className="btn btn-secondary text-sm py-2"><Pencil size={15} /> Editar</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
