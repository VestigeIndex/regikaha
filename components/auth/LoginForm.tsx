"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LogIn, Mail } from "lucide-react";
import { GoogleConnectButton } from "@/components/auth/GoogleConnectButton";
import { integrations } from "@/lib/integrations";
import { normalizeRole, panelPathForRole, registrationPaths, safeInternalPath, type AccountRole } from "@/lib/accounts";
import { dashboardDictionaries } from "@/lib/i18n/dashboard";
import { useI18n } from "@/lib/i18n/context";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

export function LoginForm({ defaultRole = "client", adminMode = false }: { defaultRole?: AccountRole; adminMode?: boolean }) {
  const params = useSearchParams();
  const { locale } = useI18n();
  const { translate } = useDirectTranslation();
  const selectedRole = normalizeRole(params.get("role"), defaultRole);
  const role = adminMode ? "admin" : selectedRole;
  const redirectTo = safeInternalPath(params.get("next"), panelPathForRole(role));
  const roleLabel = role === "admin" ? "Admin" : dashboardDictionaries[locale].roles[role];
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registerHref = useMemo(() => {
    if (adminMode) return "/conectar";
    const role = selectedRole === "admin" ? "client" : selectedRole;
    return registrationPaths[role as Exclude<AccountRole, "admin">];
  }, [adminMode, selectedRole]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          role: adminMode ? "admin" : selectedRole,
          redirectTo,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("login");
      window.location.assign(safeInternalPath(data.redirectTo, redirectTo));
    } catch {
      setError(translate("No se pudo iniciar sesión"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card p-6 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-500/12 text-forest-700">
          <LogIn size={21} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink">{translate("Entrar como {role}").replace("{role}", roleLabel.toLowerCase())}</h2>
          <p className="mt-1 text-sm text-muted">
            {translate("Usa email y contraseña. Google Connect queda disponible como acceso rápido cuando esté configurado.")}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{translate("Email")}</span>
          <input name="email" type="email" required className="reg-input mt-1.5" autoComplete="email" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{translate("Contraseña")}</span>
          <input name="password" type="password" required className="reg-input mt-1.5" autoComplete="current-password" />
        </label>
        <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
          <Mail size={16} /> {translate(pending ? "Entrando..." : "Iniciar sesión")}
        </button>
      </form>

      {!adminMode && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-[var(--hairline)]" />
            {translate("o")}
            <span className="h-px flex-1 bg-[var(--hairline)]" />
          </div>
          <GoogleConnectButton clientId={integrations.googleClientId} redirectTo={redirectTo} />
          <p className="mt-5 text-sm text-muted">
            {translate("¿Todavía no tienes cuenta?")}{" "}
            <Link href={registerHref} className="font-semibold text-forest-700 hover:underline">
              {translate("Crear cuenta")}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
