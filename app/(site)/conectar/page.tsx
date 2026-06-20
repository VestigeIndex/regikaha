import type { Metadata } from "next";
import { ConnectAccountChooser } from "@/components/auth/ConnectAccountChooser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conecta con RegiKaha",
  description: "Elige si entras como cliente, profesional, empresa, subcontrata o admin para continuar en RegiKaha.",
  path: "/conectar",
});

export default function ConectarPage() {
  return <ConnectAccountChooser />;
}
