// Normaliza el workspace antes de guardarlo en la nube. Puro/isomórfico.
// Regla clave de coste: NUNCA base64 ni imágenes pesadas dentro del JSON de D1.
// Las imágenes viven en R2 y el workspace solo guarda su referencia (url/key).

export interface StripResult {
  data: any;
  bytes: number;
  strippedImages: number;
}

export function byteLength(value: string): number {
  if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(value).length;
  // Fallback en entornos sin TextEncoder.
  return unescape(encodeURIComponent(value)).length;
}

function stripPhoto(photo: any): boolean {
  if (!photo || typeof photo !== "object") return false;
  if (typeof photo.dataUrl === "string" && photo.dataUrl.startsWith("data:")) {
    delete photo.dataUrl; // la imagen real vive en R2 (photo.url / photo.key)
    return !photo.url && !photo.key; // se perdió la imagen si no había referencia R2
  }
  return false;
}

/** Devuelve una copia del workspace sin base64, lista para D1, y su tamaño. */
export function stripWorkspaceForCloud(input: any): StripResult {
  let strippedImages = 0;
  const data = JSON.parse(JSON.stringify(input ?? {}));
  if (Array.isArray(data.projects)) {
    for (const project of data.projects) {
      if (Array.isArray(project?.photos)) {
        for (const photo of project.photos) {
          if (stripPhoto(photo)) strippedImages += 1;
        }
      }
    }
  }
  if (data.settings && typeof data.settings.logoDataUrl === "string" && data.settings.logoDataUrl.startsWith("data:")) {
    delete data.settings.logoDataUrl;
    if (!data.settings.logoUrl) strippedImages += 1;
  }
  const json = JSON.stringify(data);
  return { data, bytes: byteLength(json), strippedImages };
}

/** Conteos para cuotas. */
export function workspaceCounts(data: any) {
  return {
    clients: Array.isArray(data?.clients) ? data.clients.length : 0,
    projects: Array.isArray(data?.projects) ? data.projects.length : 0,
    quotes: Array.isArray(data?.quotes) ? data.quotes.length : 0,
  };
}
