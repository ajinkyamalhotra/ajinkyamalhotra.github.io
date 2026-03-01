/*
  Portfolio service worker
  Strategy: cache-first for local static assets, network fallback for uncached same-origin files.
*/

const CACHE = "portfolio-v2.0";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.webmanifest",
  "./resume.pdf",
  "./src/main.js",
  "./src/app/bootstrap.js",
  "./src/app/layout/render-app-shell.js",
  "./src/app/providers/document-metadata-provider.js",
  "./src/app/providers/reveal-provider.js",
  "./src/app/providers/service-worker-provider.js",
  "./src/app/providers/spotlight-provider.js",
  "./src/app/providers/theme-provider.js",
  "./src/app/routing/hash-router.js",
  "./src/features/background/background-feature.js",
  "./src/features/boot/boot-feature.js",
  "./src/features/command-palette/command-palette-feature.js",
  "./src/features/contact/contact-feature.js",
  "./src/features/education/education-feature.js",
  "./src/features/experience/experience-feature.js",
  "./src/features/hero/hero-feature.js",
  "./src/features/hero/typewriter.js",
  "./src/features/impact/impact-feature.js",
  "./src/features/navigation/navigation-shortcuts-feature.js",
  "./src/features/project-modal/project-modal-feature.js",
  "./src/features/projects/projects-feature.js",
  "./src/features/ship-radar/ship-radar-feature.js",
  "./src/features/skills/skills-feature.js",
  "./src/features/skills/skills-radar-feature.js",
  "./src/features/staff/staff-feature.js",
  "./src/features/terminal/terminal-feature.js",
  "./src/shared/components/toast.js",
  "./src/shared/config/content-registry.js",
  "./src/shared/constants/events.js",
  "./src/shared/constants/routes.js",
  "./src/shared/constants/storage-keys.js",
  "./src/shared/services/clipboard-service.js",
  "./src/shared/services/storage-repository.js",
  "./src/shared/utils/async.js",
  "./src/shared/utils/dom.js",
  "./src/shared/utils/math.js",
  "./src/shared/utils/platform.js",
  "./src/shared/utils/text.js",
  "./src/shared/utils/time.js",
  "./src/styles/main.css",
  "./src/styles/tokens.css",
  "./src/styles/global.css",
  "./src/styles/layout.css",
  "./src/styles/components.css",
  "./src/styles/features.css",
  "./assets/favicon.ico",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/og.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const snapshot = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, snapshot));
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    }),
  );
});
