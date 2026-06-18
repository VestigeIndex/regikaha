export function normalizeGeoText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function geoSlug(value: string): string {
  return normalizeGeoText(value).replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 90);
}

export function compactSearchText(parts: Array<string | undefined | null>) {
  return normalizeGeoText(parts.filter(Boolean).join(" "));
}
