import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageHeader } from "@/components/site/PageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Iniciar sesión",
  description: "Inicia sesión en RegiKaha con email y contraseña o Google Connect cuando esté configurado.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Acceso"
        title="Iniciar sesión"
        description="Entra con tu email y contraseña. RegiKaha recordará tu tipo de cuenta y te llevará al panel correcto."
        breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Iniciar sesión" }]}
      />
      <section className="container-x py-14">
        <Suspense fallback={<div className="card p-8 text-center text-sm text-muted">Preparando acceso...</div>}>
          <LoginForm />
        </Suspense>
      </section>
    </>
  );
}
