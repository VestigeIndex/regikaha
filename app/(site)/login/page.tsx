import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginPageHeader } from "@/components/auth/LoginPageHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Iniciar sesión",
  description: "Inicia sesión en RegiKaha con email y contraseña o Google Connect cuando esté configurado.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <>
      <LoginPageHeader />
      <section className="container-x py-14">
        <Suspense fallback={<div className="card mx-auto h-72 max-w-xl animate-pulse bg-white" />}>
          <LoginForm />
        </Suspense>
      </section>
    </>
  );
}
