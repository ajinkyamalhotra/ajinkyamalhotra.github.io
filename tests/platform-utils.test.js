import { describe, expect, it, vi } from "vitest";
import {
  isCoarsePointer,
  isLightModePreferred,
  isReducedMotionPreferred,
} from "@shared/utils/platform.js";

describe("platform utilities", () => {
  it("reports media-query preferences when available", () => {
    const map = {
      "(prefers-reduced-motion: reduce)": true,
      "(prefers-color-scheme: light)": false,
      "(hover: none), (pointer: coarse)": true,
    };

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query) => ({ matches: Boolean(map[query]) })),
    });

    expect(isReducedMotionPreferred()).toBe(true);
    expect(isLightModePreferred()).toBe(false);
    expect(isCoarsePointer()).toBe(true);
  });

  it("returns false when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: undefined,
    });

    expect(isReducedMotionPreferred()).toBe(false);
    expect(isLightModePreferred()).toBe(false);
    expect(isCoarsePointer()).toBe(false);
  });
});
