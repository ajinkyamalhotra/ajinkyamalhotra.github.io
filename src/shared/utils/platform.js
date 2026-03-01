export function isReducedMotionPreferred() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function isLightModePreferred() {
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ?? false;
}

export function isCoarsePointer() {
  return window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches ?? false;
}
