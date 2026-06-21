import { DashboardHeader } from "@/components/dashboard/DashboardShell";

export default function ClienteResenasPage() {
  return (
    <>
      <DashboardHeader title="Reseñas cliente" subtitle="Gestiona las reseñas pendientes de tus proyectos completados." />
      <div className="card p-8 text-sm text-muted">Todavía no hay reseñas pendientes.</div>
    </>
  );
}
