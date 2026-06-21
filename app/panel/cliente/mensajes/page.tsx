import { DashboardHeader } from "@/components/dashboard/DashboardShell";

export default function ClienteMensajesPage() {
  return (
    <>
      <DashboardHeader title="Mensajes" subtitle="Bandeja de mensajes con los profesionales de tus proyectos." />
      <div className="card p-8 text-sm text-muted">El sistema de mensajes con profesionales estará disponible próximamente.</div>
    </>
  );
}
