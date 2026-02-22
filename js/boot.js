import { sleep } from "./utils.js";

const SESSION_KEY = "aj_boot_seen";

export function initBootSequence({ force = false } = {}) {
  const boot = document.getElementById("boot");
  const logEl = document.getElementById("bootLog");
  const skipBtn = document.getElementById("bootSkip");

  if (!boot || !logEl) return;

  const seen = sessionStorage.getItem(SESSION_KEY) === "1";
  if (seen && !force) return;

  sessionStorage.setItem(SESSION_KEY, "1");

  const lines = [
    "AJINKYA.OS :: bootloader v1.0",
    "-------------------------------------------",
    "[ ok ] init canvas renderer",
    "[ ok ] mount sections: overview impact experience projects skills resume contact",
    "[ ok ] load profile: Ajinkya Malhotra",
    "[ ok ] compile command palette",
    "[ ok ] spawn terminal subsystem",
    "[ ok ] schedule reveal animations",
    "[ .. ] sync GitHub radar (public API)",
    "-------------------------------------------",
    "Tip: Ctrl+K opens command palette · ~ opens terminal",
    "",
  ];

  let cancelled = false;
  const close = async () => {
    cancelled = true;
    boot.setAttribute("data-open", "false");
    boot.setAttribute("aria-hidden", "true");
    await sleep(220);
    boot.style.display = "none";
  };

  if (skipBtn) {
    skipBtn.addEventListener("click", close, { once: true });
  }

  boot.style.display = "flex";
  boot.setAttribute("data-open", "true");
  boot.setAttribute("aria-hidden", "false");

  (async () => {
    logEl.textContent = "";
    for (const l of lines) {
      if (cancelled) return;
      logEl.textContent += l + "\n";
      logEl.scrollTop = logEl.scrollHeight;
      await sleep(85 + Math.random() * 40);
    }
    if (cancelled) return;

    await sleep(320);
    await close();
  })();
}
