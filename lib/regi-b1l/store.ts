"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { b1lSeed } from "./seed";
import type { B1LData } from "./types";

const STORAGE_KEY = "regikaha:b1l:v1";

function cloneSeed(): B1LData {
  return JSON.parse(JSON.stringify(b1lSeed)) as B1LData;
}

function isData(value: unknown): value is B1LData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<B1LData>;
  return data.version === 1 && Array.isArray(data.clients) && Array.isArray(data.projects) && Array.isArray(data.quotes);
}

export type SaveState = "local" | "saving" | "saved";

export function useB1LStore() {
  const [data, setData] = useState<B1LData>(cloneSeed);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("local");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canSyncRemote = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let next = cloneSeed();
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isData(parsed)) next = parsed;
        }
      } catch {
        setSaveState("local");
      }

      try {
        const response = await fetch("/api/regi-works", { cache: "no-store", credentials: "same-origin" });
        if (response.ok) {
          const payload = await response.json().catch(() => ({}));
          canSyncRemote.current = payload.canSync === true;
          if (isData(payload.data)) {
            next = payload.data;
            setSaveState("saved");
          } else if (!canSyncRemote.current) {
            setSaveState("local");
          }
        }
      } catch {
        canSyncRemote.current = false;
        setSaveState("local");
      } finally {
        if (!cancelled) {
          setData(next);
          setHydrated(true);
        }
      }
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        setSaveState("local");
      }

      if (!canSyncRemote.current) {
        setSaveState("local");
        return;
      }

      fetch("/api/regi-works", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        credentials: "same-origin",
        body: JSON.stringify({ data }),
      })
        .then((response) => {
          setSaveState(response.ok ? "saved" : "local");
        })
        .catch(() => setSaveState("local"));
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, hydrated]);

  const update = useCallback((recipe: (current: B1LData) => B1LData) => setData((current) => recipe(current)), []);
  const reset = useCallback(() => setData(cloneSeed()), []);

  return useMemo(() => ({ data, update, reset, hydrated, saveState }), [data, update, reset, hydrated, saveState]);
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
