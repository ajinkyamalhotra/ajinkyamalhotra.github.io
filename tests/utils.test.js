import { describe, expect, it } from "vitest";
import { clamp } from "@shared/utils/math.js";
import { escapeHtml, formatNumber, normalize } from "@shared/utils/text.js";

describe("text utilities", () => {
  it("normalizes case and whitespace", () => {
    expect(normalize("  HeLLo WoRLD  ")).toBe("hello world");
  });

  it("escapes HTML-sensitive characters", () => {
    expect(escapeHtml('<div class="x">& test</div>')).toBe(
      "&lt;div class=&quot;x&quot;&gt;&amp; test&lt;/div&gt;",
    );
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
});
