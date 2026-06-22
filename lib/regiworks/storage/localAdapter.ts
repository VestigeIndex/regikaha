"use client";

import type { B1LData } from "@/lib/regi-b1l/types";

const STORAGE_KEY = "regikaha:b1l:v1";

export function readLocal(): { data: B1LData | null; hadLocal: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: null, hadLocal: false };
    const parsed = JSON.parse(raw) as B1LData;
    return { data: parsed, hadLocal: true };
  } catch {
    return { data: null, hadLocal: false };
  }
}

export function writeLocal(data: B1LData): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
