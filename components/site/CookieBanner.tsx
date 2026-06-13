"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const KEY = "reginova-cookie-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* noop */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 animate-fade-up">
      <div className="container-x">
        <div className="card shadow-elevated p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-forest-500/12 text-forest-600 shrink-0">
            <Cookie size={20} />
          </span>
          <p className="text-sm text-ink/80 leading-relaxed flex-1">
            Usamos cookies necesarias para que RegiNova funcione y, con tu permiso, cookies para
            mejorar la experiencia. Consulta nuestra{" "}
            <Link href="/legal/cookies" className="underline text-forest-700 hover:text-forest-800">
              política de cookies
            </Link>
            .
          </p>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button onClick={() => decide("rejected")} className="btn btn-secondary text-sm flex-1 sm:flex-none">
              Rechazar
            </button>
            <button onClick={() => decide("accepted")} className="btn btn-primary text-sm flex-1 sm:flex-none">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
