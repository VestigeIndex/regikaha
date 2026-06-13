import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { getProfessionalById, getCategoryById } from "@/lib/data";
import { VerifiedBadge } from "@/components/ui/Badges";

const ME = "pro-reformas-costa";

export default function PerfilPage() {
  const pro = getProfessionalById(ME)!;

  return (
    <>
      <DashboardHeader
        title="Mi perfil"
        subtitle="Esta información se muestra en tu página pública."
        action={<button className="btn btn-primary text-sm">Guardar cambios</button>}
      />

      <form className="grid lg:grid-cols-2 gap-6">
        <section className="card p-6 space-y-4">
          <h2 className="font-bold text-ink">Datos básicos</h2>
          <L label="Nombre comercial"><input className="reg-input" defaultValue={pro.publicName} /></L>
          <L label="Tagline"><input className="reg-input" defaultValue={pro.shortTagline} /></L>
          <L label="Descripción">
            <textarea className="reg-input" rows={5} defaultValue={pro.description} />
          </L>
          <div className="grid grid-cols-2 gap-3">
            <L label="Ciudad"><input className="reg-input" defaultValue={pro.city} /></L>
            <L label="Provincia"><input className="reg-input" defaultValue={pro.province} /></L>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-6 space-y-4">
            <h2 className="font-bold text-ink">Actividad</h2>
            <L label="Zona de servicio"><input className="reg-input" defaultValue={pro.serviceArea} /></L>
            <div className="grid grid-cols-2 gap-3">
              <L label="Años de experiencia"><input className="reg-input" defaultValue={pro.yearsExperience} /></L>
              <L label="Radio (km)"><input className="reg-input" defaultValue={pro.serviceRadiusKm} /></L>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Categorías</p>
              <div className="flex flex-wrap gap-2">
                {pro.categoryIds.map((id) => (
                  <span key={id} className="chip">{getCategoryById(id)?.name}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Idiomas</p>
              <div className="flex flex-wrap gap-2">
                {pro.languages.map((l) => <span key={l} className="chip">{l}</span>)}
              </div>
            </div>
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-ink">Verificación</h2>
              <VerifiedBadge />
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <Item label="Seguro de responsabilidad civil" on={pro.insuranceDeclared} />
              <Item label="Trabaja con factura" on={pro.invoiceDeclared} />
              <Item label="Atiende urgencias" on={pro.offersUrgent} />
            </ul>
          </section>
        </div>
      </form>
    </>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Item({ label, on }: { label: string; on: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-ink/80">{label}</span>
      <span className={`text-xs font-semibold ${on ? "text-forest-700" : "text-muted"}`}>{on ? "Sí" : "No"}</span>
    </li>
  );
}
