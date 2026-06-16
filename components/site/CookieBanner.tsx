"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useT } from "@/lib/i18n/context";

const KEY = "regikaha-cookie-consent";

export function CookieBanner() {
  const t = useT();
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
            {t.ui.cookie.textBeforeLink}
            <Link href="/legal/cookies" className="underline text-forest-700 hover:text-forest-800">
              {t.ui.cookie.link}
            </Link>
            {t.ui.cookie.textAfterLink}
          </p>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button onClick={() => decide("rejected")} className="btn btn-secondary text-sm flex-1 sm:flex-none">
              {t.ui.actions.reject}
            </button>
            <button onClick={() => decide("accepted")} className="btn btn-primary text-sm flex-1 sm:flex-none">
              {t.ui.actions.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
