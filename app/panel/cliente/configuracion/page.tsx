import { DashboardHeader } from "@/components/dashboard/DashboardShell";

export default function ClienteConfiguracionPage() {
  return (
    <>
      <DashboardHeader title="Configuración cliente" subtitle="Gestiona los datos básicos de tu cuenta cliente." />
      <div className="card p-8 text-sm text-muted">La configuración avanzada de cliente se activará junto con mensajes y seguimiento de proyectos.</div>
    </>
  );
}
