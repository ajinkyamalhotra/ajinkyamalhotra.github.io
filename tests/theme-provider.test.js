import { beforeEach, describe, expect, it, vi } from "vitest";
import { APP_EVENTS } from "@shared/constants/events.js";
import { createThemeProvider } from "@app/providers/theme-provider.js";

function setupDom() {
  document.documentElement.setAttribute("data-theme", "midnight");
  document.body.innerHTML = "<button id='themeBtn' type='button'></button>";
}

describe("theme provider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("cycles themes and persists selection", () => {
    setupDom();

    const provider = createThemeProvider({
      themes: [{ id: "midnight" }, { id: "paper" }],
    });

    provider.init();
    expect(document.documentElement.getAttribute("data-theme")).toBeTruthy();

    provider.setTheme("paper");
    expect(document.documentElement.getAttribute("data-theme")).toBe("paper");
    expect(localStorage.getItem("aj_theme")).toBe("paper");

    const next = provider.cycle(1);
    expect(next).toBe("midnight");
  });

  it("ignores unknown themes by falling back to default", () => {
    setupDom();

    const provider = createThemeProvider({
      themes: [{ id: "midnight" }, { id: "paper" }],
      buttonId: "themeBtn",
    });

    provider.init();
    provider.setTheme("invalid-theme");

    expect(document.documentElement.getAttribute("data-theme")).toBe("midnight");
  });

  it("cycles theme via keyboard shortcut and emits theme change events", () => {
    setupDom();
    const handler = vi.fn();
    window.addEventListener(APP_EVENTS.themeChanged, handler);

    const provider = createThemeProvider({
      themes: [{ id: "midnight" }, { id: "paper" }],
      buttonId: "themeBtn",
    });

    provider.init();
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "t", bubbles: true, cancelable: true }),
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("paper");
    expect(handler).toHaveBeenCalled();
  });

  it("uses persisted theme and ignores shortcut while typing", () => {
    setupDom();
    localStorage.setItem("aj_theme", "paper");
    const input = document.createElement("input");
    document.body.appendChild(input);

    const provider = createThemeProvider({
      themes: [{ id: "midnight" }, { id: "paper" }],
      buttonId: "themeBtn",
    });

    provider.init();
    expect(provider.getTheme()).toBe("paper");

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "t", bubbles: true, cancelable: true }),
    );

    expect(provider.getTheme()).toBe("paper");
  });
});
