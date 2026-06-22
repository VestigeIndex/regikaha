"use client";

import type { B1LData } from "@/lib/regi-b1l/types";

export interface CloudSnapshot {
  data: B1LData | null;
  revision: number;
  updatedAt: string | null;
}

/** Lee el estado cloud. authed=false si no hay sesión (modo local puro). */
export async function pullSnapshot(): Promise<{ authed: boolean; snapshot: CloudSnapshot | null }> {
  try {
    const res = await fetch("/api/regiworks/snapshot", { credentials: "same-origin" });
    if (res.status === 401) return { authed: false, snapshot: null };
    if (!res.ok) return { authed: true, snapshot: null };
    const body = await res.json();
    return {
      authed: true,
      snapshot: { data: body.data || null, revision: Number(body.revision || 0), updatedAt: body.updatedAt || null },
    };
  } catch {
    return { authed: false, snapshot: null };
  }
}

export async function pushSnapshot(
  data: B1LData,
): Promise<{ ok: boolean; status: number; revision?: number; updatedAt?: string | null; error?: string }> {
  try {
    const res = await fetch("/api/regiworks/sync", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data }),
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, revision: body.revision, updatedAt: body.updatedAt, error: body.error };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

export async function fetchUsage(): Promise<any | null> {
  try {
    const res = await fetch("/api/regiworks/usage", { credentials: "same-origin" });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}
