import { DashboardHeader } from "@/components/dashboard/DashboardShell";

export default function ClienteFavoritosPage() {
  return (
    <>
      <DashboardHeader title="Favoritos cliente" subtitle="Guarda profesionales para comparar y contactar más tarde." />
      <div className="card p-8 text-sm text-muted">Todavía no has guardado profesionales favoritos.</div>
    </>
  );
}
