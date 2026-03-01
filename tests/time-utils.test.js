import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDateInEastern, formatRelativeAge } from "@shared/utils/time.js";

describe("time utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats eastern datetime strings", () => {
    const output = formatDateInEastern("2025-01-15T13:45:30.000Z");
    expect(output).toContain("2025");
    expect(output).toMatch(/(EST|EDT)/);
  });

  it("returns placeholder for missing or invalid values", () => {
    expect(formatDateInEastern("")).toBe("--");
    expect(formatRelativeAge("invalid-date")).toBe("--");
  });

  it("formats relative age in minutes, hours, and days", () => {
    expect(formatRelativeAge("2026-03-01T11:45:00.000Z")).toBe("15m ago");
    expect(formatRelativeAge("2026-03-01T09:00:00.000Z")).toBe("3h ago");
    expect(formatRelativeAge("2026-02-26T12:00:00.000Z")).toBe("3d ago");
  });

  it("returns just now for future timestamps", () => {
    expect(formatRelativeAge("2026-03-01T12:30:00.000Z")).toBe("just now");
  });
});
