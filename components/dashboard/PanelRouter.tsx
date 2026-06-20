"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { panelPathForRole } from "@/lib/accounts";

export function PanelRouter() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch("/api/me", { cache: "no-store", credentials: "same-origin" });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!data.authenticated) {
        router.replace("/login");
        return;
      }
      router.replace(panelPathForRole(data.user?.role));
    }
    load().catch(() => router.replace("/login"));
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      <DashboardHeader title="Panel" subtitle="Detectando tu tipo de cuenta para abrir el panel correcto." />
      <div className="card p-8 text-sm text-muted">
        Preparando el panel.{" "}
        <Link href="/conectar" className="font-semibold text-forest-700 hover:underline">Elegir acceso manual</Link>
      </div>
    </>
  );
}
