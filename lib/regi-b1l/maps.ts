export function directionsUrl(lat: number, lng: number, label: string): string {
  const destination = `${lat},${lng}`;
  if (typeof navigator !== "undefined" && /iPhone|iPad|Macintosh/i.test(navigator.userAgent)) {
    return `https://maps.apple.com/?daddr=${destination}&q=${encodeURIComponent(label)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
}
