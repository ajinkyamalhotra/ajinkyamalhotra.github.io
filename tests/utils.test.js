import { describe, expect, it } from "vitest";
import { clamp, unique } from "@shared/utils/math.js";
import { escapeHtml, formatNumber, normalize, toTitleCase } from "@shared/utils/text.js";

describe("text utilities", () => {
  it("normalizes case and whitespace", () => {
    expect(normalize("  HeLLo WoRLD  ")).toBe("hello world");
  });

  it("escapes HTML-sensitive characters", () => {
    expect(escapeHtml('<div class="x">& test</div>')).toBe(
      "&lt;div class=&quot;x&quot;&gt;&amp; test&lt;/div&gt;",
    );
  });

  it("formats title case", () => {
    expect(toTitleCase("mULTI word VALUE")).toBe("Multi Word Value");
  });

  it("formats numbers and placeholders", () => {
    expect(formatNumber(12345)).toBe("12,345");
    expect(formatNumber(NaN)).toBe("--");
  });
});

describe("math utilities", () => {
  it("clamps values inside a range", () => {
    expect(clamp(5, 1, 3)).toBe(3);
    expect(clamp(0, 1, 3)).toBe(1);
    expect(clamp(2, 1, 3)).toBe(2);
  });

  it("returns unique values preserving order", () => {
    expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });
});
