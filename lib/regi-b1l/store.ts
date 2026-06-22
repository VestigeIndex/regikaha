"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { b1lSeed, b1lEmpty } from "./seed";
import type { B1LData } from "./types";
import { readLocal, writeLocal } from "@/lib/regiworks/storage/localAdapter";
import { pullSnapshot } from "@/lib/regiworks/storage/cloudAdapter";
import { createSyncQueue, type SyncStatus } from "@/lib/regiworks/storage/syncQueue";

const SEED_JSON = JSON.stringify(b1lSeed);

function cloneSeed(): B1LData {
  return JSON.parse(JSON.stringify(b1lSeed)) as B1LData;
}

function cloneEmpty(): B1LData {
  return JSON.parse(JSON.stringify(b1lEmpty)) as B1LData;
}

function isData(value: unknown): value is B1LData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<B1LData>;
  return data.version === 1 && Array.isArray(data.clients) && Array.isArray(data.projects) && Array.isArray(data.quotes);
}

export type SaveState = "local" | "saving" | "saved";
export type CloudStatus = SyncStatus;

export function useB1LStore() {
  const [data, setData] = useState<B1LData>(cloneSeed);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("local");
  const [cloudStatus, setCloudStatus] = useState<SyncStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadLocalRef = useRef(false);
  const localIsDemoRef = useRef(true);
  const authedRef = useRef(false);
  const dirtyRef = useRef(false);
  const queueRef = useRef<ReturnType<typeof createSyncQueue> | null>(null);

  // Cola de sincronización cloud (debounce + last-write-wins).
  useEffect(() => {
    queueRef.current = createSyncQueue(setCloudStatus);
    return () => queueRef.current?.stop();
  }, []);

  // Hidratación local (local-first).
  useEffect(() => {
    const { data: local, hadLocal } = readLocal();
    hadLocalRef.current = hadLocal;
    if (local && isData(local)) {
      setData(local);
      localIsDemoRef.current = JSON.stringify(local) === SEED_JSON;
    } else {
      localIsDemoRef.current = true; // arranca con la demo (escaparate anónimo)
    }
    setHydrated(true);
  }, []);

  // Una sola lectura del estado cloud tras hidratar.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    pullSnapshot().then(({ authed, snapshot }) => {
      if (cancelled) return;
      authedRef.current = authed;
      if (!authed) { setCloudStatus("offline"); return; }
      if (dirtyRef.current) { setCloudStatus("idle"); return; } // el usuario ya empezó a trabajar
      const hasCloud = !!(snapshot?.data && isData(snapshot.data));
      if (hasCloud && localIsDemoRef.current) {
        // Con sesión y datos en la nube: carga su workspace real (descarta la demo).
        setData(snapshot!.data as B1LData);
        writeLocal(snapshot!.data as B1LData);
        localIsDemoRef.current = false;
        setCloudStatus("synced");
      } else if (!hasCloud && localIsDemoRef.current) {
        // Con sesión y sin datos en la nube: empieza en blanco, nunca la demo.
        const empty = cloneEmpty();
        setData(empty);
        writeLocal(empty);
        localIsDemoRef.current = false;
        setCloudStatus("synced");
      } else {
        // Hay trabajo local real sin sincronizar: se conserva y se subirá.
        setCloudStatus("idle");
      }
    });
    return () => { cancelled = true; };
  }, [hydrated]);

  // Guardado local (debounce) + encolado cloud solo en cambios reales.
  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveState(writeLocal(data) ? "saved" : "local");
      if (authedRef.current && dirtyRef.current) queueRef.current?.enqueue(data);
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, hydrated]);

  const update = useCallback((recipe: (current: B1LData) => B1LData) => {
    dirtyRef.current = true;
    setData((current) => recipe(current));
  }, []);
  const reset = useCallback(() => {
    dirtyRef.current = true;
    setData(cloneSeed());
  }, []);

  return useMemo(
    () => ({ data, update, reset, hydrated, saveState, cloudStatus }),
    [data, update, reset, hydrated, saveState, cloudStatus],
  );
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function compressImage(file: File, maxSide = 1280): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("image-load"));
      image.src = objectUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.78);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
