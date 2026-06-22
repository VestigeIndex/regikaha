"use client";

import { optimizeImageForUpload } from "@/packages/image-optimizer";

// Sube una foto de proyecto a R2 (WebP comprimido + thumbnail) vía la API.
// Devuelve null si no hay sesión o falla, para que el llamador caiga a base64 local.
export async function uploadProjectPhoto(
  file: File,
  projectId: string,
): Promise<{ id: string; url: string; thumbnailUrl: string } | null> {
  try {
    const optimized = await optimizeImageForUpload(file, "autonomo_nacional");
    const form = new FormData();
    form.set("file", optimized.image.file);
    form.set("thumbnail", optimized.thumbnail.file);
    form.set("width", String(optimized.image.width));
    form.set("height", String(optimized.image.height));
    form.set("projectId", projectId);
    const res = await fetch("/api/regiworks/media", { method: "POST", credentials: "same-origin", body: form });
    if (!res.ok) return null;
    const body = await res.json().catch(() => ({}));
    if (!body?.url) return null;
    return { id: String(body.id), url: String(body.url), thumbnailUrl: String(body.thumbnailUrl || body.url) };
  } catch {
    return null;
  }
}

export async function deleteProjectPhoto(mediaId: string): Promise<void> {
  try {
    await fetch(`/api/regiworks/media/${encodeURIComponent(mediaId)}`, { method: "DELETE", credentials: "same-origin" });
  } catch {
    // best-effort: si falla, la limpieza puede reintentarse luego
  }
}
