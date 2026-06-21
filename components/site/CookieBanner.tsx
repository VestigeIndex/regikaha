"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Settings2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cookieDictionaries } from "@/lib/i18n/cookies";

const KEY = "regikaha-cookie-consent";
const VERSION = "2026-06-21";

interface ConsentPreferences {
  id: string;
  necessary: true;
  analytics: boolean;
  maps: boolean;
  marketing: boolean;
  policyVersion: string;
  decidedAt: string;
}

const optionalKeys = ["analytics", "maps", "marketing"] as const;

function newConsentId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readConsent(): ConsentPreferences | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!parsed || parsed.policyVersion !== VERSION) return null;
    return { ...parsed, necessary: true } as ConsentPreferences;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const { locale } = useI18n();
  const t = cookieDictionaries[locale];
  const [show, setShow] = useState(false);
  const [configure, setConfigure] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [preferences, setPreferences] = useState({ analytics: false, maps: false, marketing: false });

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setHasDecision(true);
      setPreferences({ analytics: stored.analytics, maps: stored.maps, marketing: stored.marketing });
    } else {
      setShow(true);
    }
  }, []);

  function persist(next: typeof preferences) {
    const previous = readConsent();
    const value: ConsentPreferences = {
      id: previous?.id || newConsentId(),
      necessary: true,
      ...next,
      policyVersion: VERSION,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("regikaha:consent", { detail: value }));
    } catch {
      /* The preference remains active for this page view. */
    }
    setPreferences(next);
    setHasDecision(true);
    setShow(false);
    setConfigure(false);
    void fetch("/api/cookie-consent", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...value, locale }),
      keepalive: true,
    }).catch(() => undefined);
  }

  function chooseAll(enabled: boolean) {
    persist({ analytics: enabled, maps: enabled, marketing: enabled });
  }

  const panel = (show || configure) && (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4 animate-fade-up" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div className="mx-auto max-w-3xl rounded-lg border border-ink/10 bg-white p-5 shadow-elevated sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-forest-500/12 text-forest-700"><Cookie size={20} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="cookie-title" className="text-lg font-bold text-ink">{t.title}</h2>
              {hasDecision && <button type="button" onClick={() => { setShow(false); setConfigure(false); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink" aria-label={t.close} title={t.close}><X size={18} /></button>}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{t.intro} <Link href="/legal/cookies" className="font-semibold text-forest-700 underline">{t.policy}</Link>.</p>
          </div>
        </div>

        {configure && (
          <div className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
            <div className="flex items-center justify-between gap-4 py-4">
              <div><h3 className="text-sm font-bold text-ink">{t.categories.necessary.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted">{t.categories.necessary.body}</p></div>
              <span className="shrink-0 text-xs font-semibold text-forest-700">{t.alwaysOn}</span>
            </div>
            {optionalKeys.map((key) => (
              <label key={key} className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span><span className="block text-sm font-bold text-ink">{t.categories[key].title}</span><span className="mt-1 block text-xs leading-relaxed text-muted">{t.categories[key].body}</span></span>
                <input type="checkbox" checked={preferences[key]} onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked }))} className="h-5 w-5 shrink-0 accent-forest-600" />
              </label>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {configure ? (
            <button type="button" onClick={() => persist(preferences)} className="btn btn-primary sm:col-span-3">{t.save}</button>
          ) : (
            <>
              <button type="button" onClick={() => chooseAll(false)} className="btn btn-secondary">{t.reject}</button>
              <button type="button" onClick={() => setConfigure(true)} className="btn btn-secondary"><Settings2 size={17} /> {t.configure}</button>
              <button type="button" onClick={() => chooseAll(true)} className="btn btn-secondary">{t.accept}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {panel}
      {hasDecision && !show && !configure && (
        <button type="button" onClick={() => setConfigure(true)} className="fixed bottom-4 right-4 z-[60] grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white text-forest-700 shadow-soft" aria-label={t.settings} title={t.settings}>
          <Cookie size={19} />
        </button>
      )}
    </>
  );
}
