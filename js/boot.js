import { sleep } from "./utils.js";

const SESSION_KEY = "aj_boot_seen";

export function initBootSequence({ force = false } = {}) {
  const boot = document.getElementById("boot");
  const logEl = document.getElementById("bootLog");
  const skipBtn = document.getElementById("bootSkip");
  const stageEl = document.getElementById("bootStage");
  const pctEl = document.getElementById("bootPct");
  const barEl = document.getElementById("bootBar");
  const trackEl = barEl?.parentElement ?? null;

  if (!boot || !logEl) return;

  const seen = sessionStorage.getItem(SESSION_KEY) === "1";
  if (seen && !force) return;

  sessionStorage.setItem(SESSION_KEY, "1");

  const lines = [
    "AJINKYA.OS BOOTMGR v1.15",
    "Machine: AJK-DEV-01  |  CPU: 8C/16T  |  RAM: 32GB",
    "----------------------------------------------------",
    "[  0.000] UEFI: POST start",
    "[  0.121] UEFI: memory training..........pass",
    "[  0.214] UEFI: NVMe0 detected (1TB)",
    "[  0.281] UEFI: TPM2 ready",
    "[  0.349] UEFI: secure boot policy loaded",
    "[  0.422] BOOT: selecting entry AJINKYA.OS",
    "[  0.563] KERNEL: decompress image........ok",
    "[  0.704] KERNEL: init scheduler / vfs / ipc",
    "[  0.843] KERNEL: mount rootfs.............ok",
    "[  0.962] KERNEL: bring up display stack...ok",
    "[  1.081] INIT: launch system services",
    "[  1.164] SVC : compositor..................ready",
    "[  1.231] SVC : input manager...............ready",
    "[  1.307] SVC : network stack...............online",
    "[  1.387] SVC : cache daemon (sw.js v1.15)..active",
    "[  1.468] SVC : telemetry/GitHub radar......deferred",
    "[  1.551] LOGIN: user authenticated",
    "[  1.620] USERSPACE: start portfolio session",
    "[  1.697] APP  : load section /overview.....ready",
    "[  1.772] APP  : load section /impact.......ready",
    "[  1.847] APP  : load section /staff........ready",
    "[  1.921] APP  : load section /experience...ready",
    "[  1.996] APP  : load section /projects.....ready",
    "[  2.072] APP  : load section /skills.......ready",
    "[  2.147] APP  : load section /education....ready",
    "[  2.224] APP  : load section /resume.......ready",
    "[  2.301] APP  : load section /contact......ready",
    "[  2.382] APP  : command palette............ready",
    "[  2.460] APP  : terminal subsystem.........ready",
    "[  2.541] APP  : reveal animations..........armed",
    "----------------------------------------------------",
    "Tip: Ctrl+K opens command palette | ~ opens terminal",
    "",
  ];

  const setProgress = (value, stage) => {
    const pct = Math.max(0, Math.min(100, Math.round(value)));
    if (stageEl && stage) stageEl.textContent = stage;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
    if (trackEl) trackEl.setAttribute("aria-valuenow", String(pct));
  };

  const getProgressState = (line) => {
    if (line.includes("UEFI")) return { pct: 8, stage: "Firmware init" };
    if (line.includes("BOOT:")) return { pct: 18, stage: "Boot manager" };
    if (line.includes("KERNEL:")) return { pct: 34, stage: "Kernel startup" };
    if (line.includes("INIT:") || line.includes("SVC :")) return { pct: 52, stage: "System services" };
    if (line.includes("LOGIN:")) return { pct: 60, stage: "User auth" };
    if (line.includes("USERSPACE:")) return { pct: 68, stage: "Entering user-space" };
    if (line.includes("APP  : load section /")) return { pct: 84, stage: "Portfolio sections" };
    if (line.includes("APP  : command palette") || line.includes("APP  : terminal subsystem")) {
      return { pct: 92, stage: "Interactive tooling" };
    }
    if (line.includes("APP  : reveal animations")) return { pct: 97, stage: "UI compositor" };
    if (line.includes("Tip:")) return { pct: 100, stage: "Session ready" };
    return null;
  };

  let cancelled = false;
  const close = async () => {
    cancelled = true;
    setProgress(100, "Session ready");
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
  setProgress(0, "Firmware init");

  (async () => {
    logEl.textContent = "";
    for (const [idx, l] of lines.entries()) {
      if (cancelled) return;
      logEl.textContent += l + "\n";
      logEl.scrollTop = logEl.scrollHeight;
      const state = getProgressState(l);
      if (state) {
        const granular = Math.min(100, state.pct + (idx / lines.length) * 6);
        setProgress(granular, state.stage);
      }
      await sleep(62 + Math.random() * 48);
    }
    if (cancelled) return;

    await sleep(320);
    await close();
  })();
}
