"use client";

import { useEffect, useRef, useState } from "react";

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
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[src='https://accounts.google.com/gsi/client']");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      if (window.google?.accounts?.id) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Connect"));
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

export function GoogleConnectButton({ clientId, redirectTo = "/panel" }: GoogleConnectButtonProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        await loadGoogleScript();
        if (cancelled || !targetRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: async (response) => {
            setError(null);
            const credential = response.credential;
            if (!credential) {
              setError("Google no devolvió credenciales");
              return;
            }
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ credential }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setError(data.error || "No se pudo conectar con Google");
              return;
            }
            window.location.href = data.professional?.slug
              ? `/profesionales/${data.professional.slug}`
              : redirectTo;
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
        setError(e instanceof Error ? e.message : "Google Connect no está disponible");
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [clientId, redirectTo]);

  return (
    <div>
      <div ref={targetRef} className={ready ? "" : "h-11 w-[280px] rounded-full bg-canvas animate-pulse"} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
