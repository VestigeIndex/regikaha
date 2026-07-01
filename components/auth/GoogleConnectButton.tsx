"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import { safeInternalPath, type PublicAccountRole } from "@/lib/accounts";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface GoogleConnectButtonProps {
  clientId: string;
  redirectTo?: string;
  accountRole?: PublicAccountRole;
}

const errorCopy: Record<Locale, { credential: string; connect: string; unavailable: string }> = {
  es: { credential: "Google no devolvió credenciales", connect: "No se pudo conectar con Google", unavailable: "Google Connect no está disponible" },
  fr: { credential: "Google n’a pas renvoyé d’identifiants", connect: "Impossible de se connecter avec Google", unavailable: "Google Connect n’est pas disponible" },
  it: { credential: "Google non ha restituito le credenziali", connect: "Impossibile connettersi con Google", unavailable: "Google Connect non è disponibile" },
  pt: { credential: "O Google não devolveu credenciais", connect: "Não foi possível ligar ao Google", unavailable: "O Google Connect não está disponível" },
  de: { credential: "Google hat keine Anmeldedaten zurückgegeben", connect: "Die Verbindung mit Google ist fehlgeschlagen", unavailable: "Google Connect ist nicht verfügbar" },
  nl: { credential: "Google heeft geen inloggegevens teruggestuurd", connect: "Verbinding met Google is mislukt", unavailable: "Google Connect is niet beschikbaar" },
  en: { credential: "Google did not return credentials", connect: "Could not connect with Google", unavailable: "Google Connect is unavailable" },
};

let googleScriptPromise: Promise<void> | null = null;
let googleScriptLocale: Locale | null = null;

function loadGoogleScript(locale: Locale): Promise<void> {
  if (googleScriptPromise && googleScriptLocale === locale) return googleScriptPromise;
  document.querySelector("script[data-regikaha-google-locale]")?.remove();
  googleScriptPromise = null;
  googleScriptLocale = locale;
  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://accounts.google.com/gsi/client?hl=${encodeURIComponent(locale)}`;
    script.dataset.regikahaGoogleLocale = locale;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("google_load_failed"));
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

export function GoogleConnectButton({ clientId, redirectTo = "/panel", accountRole = "client" }: GoogleConnectButtonProps) {
  const { locale } = useI18n();
  const copy = errorCopy[locale];
  const targetRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        await loadGoogleScript(locale);
        if (cancelled || !targetRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: async (response) => {
            setError(null);
            const credential = response.credential;
            if (!credential) {
              setError(copy.credential);
              return;
            }
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({ credential, role: accountRole }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setError(copy.connect);
              return;
            }
            window.location.href = data.professional?.slug
              ? `/profesionales/${data.professional.slug}`
              : safeInternalPath(redirectTo, "/panel");
          },
        });
        targetRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(targetRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 280,
        });
        setReady(true);
      } catch (e) {
        setError(e instanceof Error && e.message !== "google_load_failed" ? e.message : copy.unavailable);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [accountRole, clientId, copy, locale, redirectTo]);

  return (
    <div>
      <div ref={targetRef} className={ready ? "" : "h-11 w-[280px] rounded-full bg-canvas animate-pulse"} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
