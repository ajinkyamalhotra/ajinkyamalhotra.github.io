import { themePresets } from "./data.js";

const STORAGE_KEY = "aj_theme";

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setTheme(id) {
  const exists = themePresets.some((t) => t.id === id);
  const theme = exists ? id : themePresets[0].id;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("aj:theme", { detail: { theme } }));
}

export function cycleTheme(dir = 1) {
  const current = document.documentElement.getAttribute("data-theme") || themePresets[0].id;
  const idx = themePresets.findIndex((t) => t.id === current);
  const next = themePresets[(idx + dir + themePresets.length) % themePresets.length].id;
  setTheme(next);
  return next;
}

export function initTheme({ buttonId = "themeBtn" } = {}) {
  const btn = document.getElementById(buttonId);

  // Initial theme
  const stored = getTheme();
  if (stored) {
    setTheme(stored);
  } else {
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
    setTheme(prefersLight ? "paper" : "midnight");
  }

  if (btn) {
    btn.addEventListener("click", () => {
      cycleTheme(1);
    });
  }

  // Shortcut: T (avoid capturing when user types in inputs)
  window.addEventListener("keydown", (e) => {
    const tag = (e.target?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;
    if (typing) return;

    if (e.key.toLowerCase() === "t") {
      e.preventDefault();
      cycleTheme(1);
    }
  });
}
