export function createToastController({ elementId = "toast", durationMs = 1800 } = {}) {
  const host = document.getElementById(elementId);
  let timeoutId;

  return {
    show(message) {
      if (!host) {
        return;
      }

      host.textContent = String(message ?? "");
      host.dataset.show = "true";

      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        host.dataset.show = "false";
      }, durationMs);
    },
  };
}
