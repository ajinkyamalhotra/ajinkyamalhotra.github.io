/* AjinkyaOS service worker — simple offline-first caching.
   NOTE: GitHub Pages serves with HTTPS so SW works in production.
*/

const CACHE = "ajinkyaos-v6.1";

const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./js/utils.js",
  "./js/theme.js",
  "./js/boot.js",
  "./js/toast.js",
  "./js/background.js",
  "./js/github.js",
  "./js/palette.js",
  "./js/terminal.js",
  "./js/modal.js",
  "./js/radar.js",
  "./resume.pdf",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/favicon.ico",
  "./assets/og.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    // Don't cache cross-origin (e.g., GitHub API).
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return resp;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
