"use client";

import type { B1LData } from "@/lib/regi-b1l/types";
import { pushSnapshot } from "./cloudAdapter";

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error" | "limit";

// Cola de sincronización con debounce y last-write-wins. Evita escribir en D1
// por cada tecleo: agrupa cambios y solo envía el último estado.
export function createSyncQueue(onStatus: (status: SyncStatus) => void, delay = 1500) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: B1LData | null = null;
  let inflight = false;

  async function flush() {
    if (inflight || !pending) return;
    const data = pending;
    pending = null;
    inflight = true;
    onStatus("syncing");
    const res = await pushSnapshot(data);
    inflight = false;
    if (res.ok) onStatus("synced");
    else if (res.status === 401) onStatus("offline");
    else if (res.status === 413 || res.status === 409) onStatus("limit");
    else onStatus("error");
    if (pending) schedule(0);
  }

  function schedule(ms = delay) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { void flush(); }, ms);
  }

  return {
    enqueue(data: B1LData) {
      pending = data;
      schedule();
    },
    stop() {
      if (timer) clearTimeout(timer);
    },
  };
}
