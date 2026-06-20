const CACHE = "regi-b1l-v2";
const SHELL = ["/regi-b1l", "/regi-b1l/manifest.webmanifest", "/regi-b1l/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("regi-b1l-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || (!url.pathname.startsWith("/regi-b1l") && !url.pathname.startsWith("/_next/static/"))) return;
  event.respondWith(caches.match(request).then((cached) => {
    const network = fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(() => cached || caches.match("/regi-b1l"));
    return cached || network;
  }));
});
