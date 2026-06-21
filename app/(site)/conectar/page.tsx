import type { Metadata } from "next";
import { ConnectAccountChooser } from "@/components/auth/ConnectAccountChooser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conecta con Regi Kaha",
  description: "Elige si entras como cliente, profesional, empresa, subcontrata o admin para continuar en Regi Kaha.",
  path: "/conectar",
  noindex: true,
});

export default function ConectarPage() {
  return <ConnectAccountChooser />;
}
