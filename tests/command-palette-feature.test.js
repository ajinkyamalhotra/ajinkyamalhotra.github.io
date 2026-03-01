import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCommandPaletteFeature } from "@features/command-palette/command-palette-feature.js";

function setupDom() {
  document.body.innerHTML = `
    <button id="paletteBtn" type="button"></button>
    <div id="paletteOverlay" aria-hidden="true">
      <div data-close="palette"></div>
      <input id="paletteInput" />
      <ul id="paletteList"></ul>
    </div>
  `;
}

describe("command palette feature", () => {
  beforeEach(() => {
    setupDom();
  });

  it("opens, filters actions, and executes active action", () => {
    const runProjects = vi.fn();
    const runTheme = vi.fn();

    const feature = createCommandPaletteFeature({
      actions: [
        { label: "Go Projects", meta: "#projects", keywords: "projects", run: runProjects },
        { label: "Theme Midnight", meta: "theme", keywords: "theme midnight", run: runTheme },
      ],
    });

    feature.open();
    const overlay = document.getElementById("paletteOverlay");
    const input = document.getElementById("paletteInput");

    expect(overlay.getAttribute("aria-hidden")).toBe("false");

    input.value = "theme";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(runTheme).toHaveBeenCalledTimes(1);
    expect(overlay.getAttribute("aria-hidden")).toBe("true");
    expect(runProjects).not.toHaveBeenCalled();
  });

  it("shows no-results row for unmatched query", () => {
    const feature = createCommandPaletteFeature({
      actions: [{ label: "Open Projects", meta: "#projects", keywords: "projects", run: vi.fn() }],
    });

    feature.open();
    const input = document.getElementById("paletteInput");
    const list = document.getElementById("paletteList");

    input.value = "does-not-exist";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(list.textContent).toContain("No results");
  });

  it("toggles with Ctrl+K", () => {
    createCommandPaletteFeature({
      actions: [{ label: "Open Projects", meta: "#projects", keywords: "projects", run: vi.fn() }],
    });

    const overlay = document.getElementById("paletteOverlay");
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true }),
    );
    expect(overlay.getAttribute("aria-hidden")).toBe("false");

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true }),
    );
    expect(overlay.getAttribute("aria-hidden")).toBe("true");
  });
});
