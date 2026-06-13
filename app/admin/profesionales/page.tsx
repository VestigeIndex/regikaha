import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { professionals, getCategoryById } from "@/lib/data";
import { StatusBadge } from "@/components/ui/Badges";
import { Avatar } from "@/components/ui/Avatar";

export default function AdminProfesionalesPage() {
  return (
    <>
      <DashboardHeader
        title="Profesionales"
        subtitle={`${professionals.length} profesionales en la plataforma.`}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b hairline bg-canvas">
                <th className="px-4 py-3 font-semibold">Profesional</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Ciudad</th>
                <th className="px-4 py-3 font-semibold">Valoración</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {professionals.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.publicName} color={p.logoColor} size={34} />
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{p.publicName}</p>
                        <p className="text-xs text-muted">{p.typeLabel}{p.founderMember ? " · Fundador" : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{getCategoryById(p.categoryIds[0])?.name}</td>
                  <td className="px-4 py-3 text-muted">{p.city}</td>
                  <td className="px-4 py-3">
                    {p.reviewCount > 0 ? (
                      <span className="inline-flex items-center gap-1 font-medium text-ink">
                        <Star size={13} className="text-amber-500" fill="currentColor" /> {p.averageRating}
                        <span className="text-muted font-normal">({p.reviewCount})</span>
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.verificationStatus} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/profesionales/${p.slug}`} className="text-forest-700 hover:underline inline-flex items-center gap-1">
                      <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
