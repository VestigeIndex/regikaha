import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Admin login | Regi Kaha",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <section className="container-x py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Acceso interno Regi Kaha</h1>
          <p className="mt-2 text-muted">Panel protegido para operaciones internas.</p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-sm text-muted">Preparando acceso...</div>}>
          <LoginForm defaultRole="admin" adminMode />
        </Suspense>
      </section>
    </main>
  );
}
