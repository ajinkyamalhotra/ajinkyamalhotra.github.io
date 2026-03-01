import { SESSION_KEYS } from "@shared/constants/storage-keys.js";
import { sleep } from "@shared/utils/async.js";

const FALLBACK_VERSION = "v1.15";

async function readServiceWorkerVersion() {
  try {
    const response = await fetch("./sw.js", { cache: "no-store" });
    if (!response.ok) {
      return FALLBACK_VERSION;
    }

    const source = await response.text();
    const cacheMatch = source.match(/const\s+CACHE\s*=\s*["']([^"']+)["']/);
    const cacheName = cacheMatch?.[1] || "";
    const versionMatch = cacheName.match(/v[0-9]+(?:\.[0-9]+)*/i);
    return versionMatch?.[0] || FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
}

function bootLogLines(swVersion, shell) {
  const osLabel = shell?.osLabel || "PORTFOLIO.OS";
  const machineLabel = shell?.bootMachineLabel || "DEV-01";
  const tipLine = shell?.bootTipLine || "Tip: Ctrl+K opens command palette | ~ opens terminal";

  return [
    `${osLabel} BOOTMGR ${swVersion}`,
    `Machine: ${machineLabel}  |  CPU: 8C/16T  |  RAM: 32GB`,
    "----------------------------------------------------",
    "[  0.000] UEFI: POST start",
    "[  0.121] UEFI: memory training..........pass",
    "[  0.214] UEFI: NVMe0 detected (1TB)",
    "[  0.281] UEFI: TPM2 ready",
    "[  0.349] UEFI: secure boot policy loaded",
    `[  0.422] BOOT: selecting entry ${osLabel}`,
    "[  0.563] KERNEL: decompress image........ok",
    "[  0.704] KERNEL: init scheduler / vfs / ipc",
    "[  0.843] KERNEL: mount rootfs.............ok",
    "[  0.962] KERNEL: bring up display stack...ok",
    "[  1.081] INIT: launch system services",
    "[  1.164] SVC : compositor..................ready",
    "[  1.231] SVC : input manager...............ready",
    "[  1.307] SVC : network stack...............online",
    `[  1.387] SVC : cache daemon (sw.js ${swVersion})..active`,
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
    tipLine,
    "",
  ];
}

function phase(line) {
  if (line.includes("UEFI")) return { percent: 8, stage: "Firmware init" };
  if (line.includes("BOOT:")) return { percent: 18, stage: "Boot manager" };
  if (line.includes("KERNEL:")) return { percent: 34, stage: "Kernel startup" };
  if (line.includes("INIT:") || line.includes("SVC :"))
    return { percent: 52, stage: "System services" };
  if (line.includes("LOGIN:")) return { percent: 60, stage: "User auth" };
  if (line.includes("USERSPACE:")) return { percent: 68, stage: "Entering user-space" };
  if (line.includes("APP  : load section /")) return { percent: 84, stage: "Portfolio sections" };
  if (line.includes("APP  : command palette") || line.includes("APP  : terminal subsystem")) {
    return { percent: 92, stage: "Interactive tooling" };
  }
  if (line.includes("APP  : reveal animations")) return { percent: 97, stage: "UI compositor" };
  if (line.includes("Tip:")) return { percent: 100, stage: "Session ready" };
  return null;
}

export function createBootFeature({ shell } = {}) {
  const overlay = document.getElementById("boot");
  const logHost = document.getElementById("bootLog");
  const skipButton = document.getElementById("bootSkip");
  const stage = document.getElementById("bootStage");
  const percent = document.getElementById("bootPct");
  const bar = document.getElementById("bootBar");
  const track = bar?.parentElement || null;

  if (!overlay || !logHost) {
    return { init() {} };
  }

  function setProgress(value, label) {
    const bounded = Math.max(0, Math.min(100, Math.round(value)));

    if (label && stage) {
      stage.textContent = label;
    }

    if (percent) {
      percent.textContent = `${bounded}%`;
    }

    if (bar) {
      bar.style.width = `${bounded}%`;
    }

    if (track) {
      track.setAttribute("aria-valuenow", String(bounded));
    }
  }

  async function close() {
    setProgress(100, shell?.bootReadyStage || "Session ready");
    overlay.dataset.open = "false";
    overlay.setAttribute("aria-hidden", "true");
    await sleep(220);
    overlay.style.display = "none";
  }

  async function init({ force = false } = {}) {
    const seen = sessionStorage.getItem(SESSION_KEYS.bootSeen) === "1";
    if (seen && !force) {
      return;
    }

    sessionStorage.setItem(SESSION_KEYS.bootSeen, "1");

    let cancelled = false;

    skipButton?.addEventListener(
      "click",
      async () => {
        cancelled = true;
        await close();
      },
      { once: true },
    );

    overlay.style.display = "flex";
    overlay.dataset.open = "true";
    overlay.setAttribute("aria-hidden", "false");

    setProgress(0, shell?.bootInitialStage || "Firmware init");

    const swVersion = await readServiceWorkerVersion();
    const lines = bootLogLines(swVersion, shell);

    logHost.textContent = "";

    for (const [index, line] of lines.entries()) {
      if (cancelled) {
        return;
      }

      logHost.textContent += `${line}\n`;
      logHost.scrollTop = logHost.scrollHeight;

      const details = phase(line);
      if (details) {
        const detailedPercent = Math.min(100, details.percent + (index / lines.length) * 6);
        setProgress(detailedPercent, details.stage);
      }

      await sleep(62 + Math.random() * 48);
    }

    if (cancelled) {
      return;
    }

    await sleep(320);
    await close();
  }

  return { init };
}
