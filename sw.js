/* TORII — Service Worker
   Compatible con GitHub Pages en /manga-reader/
*/
const CACHE_NAME = "torii-shell-v46-cbr-fix";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./torii-banner.svg",
  "./worker-bundle.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => (key.startsWith("torii-shell-") || key.startsWith("yomibako-shell-")) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Solo manejar solicitudes GET del mismo origen.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // No interceptar archivos de manga ni descargas del usuario.
  const isAppNavigation = request.mode === "navigate";
  const isAppAsset = /\.(?:html|css|js|json|svg|png|webp|ico)$/i.test(url.pathname);

  if (!isAppNavigation && !isAppAsset) return;

  if (isAppNavigation) {
    // Primero intenta la red para recibir la versión más reciente.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("./index.html")) || (await cache.match("./"));
        })
    );
    return;
  }

  // Para recursos de la aplicación: caché primero y red como respaldo.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
