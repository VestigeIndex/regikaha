"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MailCheck, TriangleAlert } from "lucide-react";

export function EmailVerification() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Estamos confirmando tu dirección de email.");

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "No se pudo verificar el email");
        if (!cancelled) {
          setState("success");
          setMessage("Email verificado. Ya puedes aceptar el contrato y activar tu suscripción.");
        }
      } catch (error) {
        if (!cancelled) {
          setState("error");
          setMessage(error instanceof Error ? error.message : "No se pudo verificar el email");
        }
      }
    }
    if (token) verify();
    else {
      setState("error");
      setMessage("Falta el token de verificación.");
    }
    return () => { cancelled = true; };
  }, [token]);

  const Icon = state === "success" ? CheckCircle2 : state === "error" ? TriangleAlert : MailCheck;
  return (
    <section className="card mx-auto max-w-lg p-7 text-center sm:p-10">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-forest-500/10 text-forest-700">
        <Icon size={28} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-ink">Verificación de email</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{message}</p>
      {state === "success" ? (
        <Link href="/suscripcion" className="btn btn-primary mt-6 w-full">Continuar a suscripción</Link>
      ) : state === "error" ? (
        <Link href="/panel" className="btn btn-secondary mt-6 w-full">Volver al panel</Link>
      ) : null}
    </section>
  );
}
