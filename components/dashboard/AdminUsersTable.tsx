"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  status: string;
  email_verified: number;
  created_at: string;
  display_name: string;
}

const roleLabels: Record<string, string> = {
  client: "Cliente",
  professional: "Profesional",
  company: "Empresa",
  subcontractor: "Subcontrata",
  admin: "Admin",
  superadmin: "Superadmin",
};

export function AdminUsersTable({ fixedRole = "" }: { fixedRole?: string }) {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [role, setRole] = useState(fixedRole);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (search.trim()) params.set("q", search.trim());
    setUsers(null);
    fetch(`/api/admin/users?${params}`, { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("admin users unavailable")))
      .then((data) => { setUsers(data.users || []); setCurrentRole(data.currentRole || ""); })
      .catch(() => setUsers([]));
  }, [role, search]);

  useEffect(() => { load(); }, [load]);

  async function update(userId: string, payload: { status?: string; role?: string }) {
    setBusy(userId);
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, ...payload }),
    });
    setBusy("");
    if (response.ok) load();
  }

  return (
    <>
      <DashboardHeader title={fixedRole === "professional" ? "Profesionales" : "Usuarios"} subtitle="Cuentas reales registradas en la plataforma y su estado de acceso." />
      <form onSubmit={(event) => { event.preventDefault(); load(); }} className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar usuario</span>
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="input pl-10" placeholder="Nombre o email" maxLength={100} />
        </label>
        {!fixedRole && <select value={role} onChange={(event) => setRole(event.target.value)} className="input sm:w-48" aria-label="Filtrar por rol"><option value="">Todos los roles</option>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>}
        <button className="btn btn-secondary" type="submit"><Search size={16} /> Buscar</button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead><tr className="border-b hairline bg-canvas text-left text-xs uppercase text-muted"><th className="px-4 py-3">Cuenta</th><th className="px-4 py-3">Rol</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Alta</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {users === null && Array.from({ length: 4 }).map((_, index) => <tr key={index} aria-hidden="true"><td colSpan={6} className="px-4 py-4"><div className="h-5 animate-pulse rounded bg-ink/10" /></td></tr>)}
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3"><p className="font-semibold text-ink">{user.display_name || user.email.split("@")[0]}</p><p className="text-xs text-muted">{user.email}</p></td>
                  <td className="px-4 py-3">
                    {currentRole === "superadmin" ? <select value={user.role} disabled={busy === user.id || user.role === "superadmin"} onChange={(event) => void update(user.id, { role: event.target.value })} className="rounded border border-ink/15 bg-white px-2 py-1"><option value={user.role}>{roleLabels[user.role] || user.role}</option>{Object.entries(roleLabels).filter(([value]) => value !== user.role).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select> : <span>{roleLabels[user.role] || user.role}</span>}
                  </td>
                  <td className="px-4 py-3">{Number(user.email_verified) === 1 ? <span className="inline-flex items-center gap-1 text-forest-700"><ShieldCheck size={15} /> Verificado</span> : <span className="text-muted">Pendiente</span>}</td>
                  <td className="px-4 py-3 text-muted">{new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(user.created_at))}</td>
                  <td className="px-4 py-3"><span className={user.status === "active" ? "text-forest-700" : "text-red-700"}>{user.status === "active" ? "Activa" : "Suspendida"}</span></td>
                  <td className="px-4 py-3 text-right">{user.role !== "superadmin" && <button type="button" disabled={busy === user.id} onClick={() => void update(user.id, { status: user.status === "active" ? "suspended" : "active" })} className="btn btn-secondary px-3 py-2 text-xs">{user.status === "active" ? <><Ban size={15} /> Suspender</> : <><CheckCircle2 size={15} /> Activar</>}</button>}</td>
                </tr>
              ))}
              {users?.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">No hay cuentas que coincidan con estos filtros.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
