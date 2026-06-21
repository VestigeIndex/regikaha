import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { ClientStartCards } from "@/components/dashboard/ClientStartCards";

export default function ClientePanelPage() {
  return (
    <>
      <RoleDashboard role="client" />
      <ClientStartCards />
    </>
  );
}
