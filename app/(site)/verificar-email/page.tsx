import type { Metadata } from "next";
import { Suspense } from "react";
import { EmailVerification } from "@/components/auth/EmailVerification";

export const metadata: Metadata = {
  title: "Verificar email | Regi Kaha",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <main className="container-x py-16 sm:py-24">
      <Suspense fallback={<div className="card mx-auto max-w-lg p-8 text-center text-muted">Verificando email...</div>}>
        <EmailVerification />
      </Suspense>
    </main>
  );
}
