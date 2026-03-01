export function createServiceWorkerProvider({ scriptUrl = "./sw.js" } = {}) {
  return {
    register() {
      if (!("serviceWorker" in navigator)) {
        return;
      }

      window.addEventListener("load", () => {
        navigator.serviceWorker.register(scriptUrl).catch(() => {
          // Ignore service worker registration failures.
        });
      });
    },
  };
}
