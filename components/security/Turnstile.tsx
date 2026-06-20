"use client";

import { useEffect, useRef, useState } from "react";
import { integrations } from "@/lib/integrations";

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: Record<string, unknown>): string;
      remove(widgetId: string): void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-regikaha-turnstile="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile_load_failed")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.regikahaTurnstile = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile_load_failed"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function Turnstile({
  action,
  name = "turnstileToken",
  onToken,
}: {
  action: string;
  name?: string;
  onToken?: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    let active = true;
    let widgetId: string | null = null;
    loadTurnstile().then(() => {
      if (!active || !containerRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: integrations.turnstileSiteKey,
        action,
        theme: "light",
        size: "flexible",
        callback: (value: string) => { setToken(value); onToken?.(value); },
        "expired-callback": () => { setToken(""); onToken?.(""); },
        "error-callback": () => { setToken(""); onToken?.(""); },
      });
    }).catch(() => setToken(""));
    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [action, onToken]);

  return (
    <div className="min-h-[65px] overflow-hidden">
      <div ref={containerRef} />
      <input type="hidden" name={name} value={token} readOnly required />
    </div>
  );
}
