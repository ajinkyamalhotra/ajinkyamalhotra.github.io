import { describe, expect, it, vi } from "vitest";
import { createNavigationShortcutsFeature } from "@features/navigation/navigation-shortcuts-feature.js";

describe("navigation shortcuts feature", () => {
  it("fires slash and shift+t actions when not typing", () => {
    const onFocusProjectSearch = vi.fn();
    const onCycleThemeBackward = vi.fn();

    createNavigationShortcutsFeature({
      onFocusProjectSearch,
      onCycleThemeBackward,
    }).init();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true, cancelable: true }));
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "T",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onFocusProjectSearch).toHaveBeenCalledTimes(1);
    expect(onCycleThemeBackward).toHaveBeenCalledTimes(1);
  });

  it("ignores shortcuts while typing in form fields", () => {
    const onFocusProjectSearch = vi.fn();
    const onCycleThemeBackward = vi.fn();

    createNavigationShortcutsFeature({
      onFocusProjectSearch,
      onCycleThemeBackward,
    }).init();

    const input = document.createElement("input");
    document.body.appendChild(input);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true, cancelable: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "T",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onFocusProjectSearch).not.toHaveBeenCalled();
    expect(onCycleThemeBackward).not.toHaveBeenCalled();
  });
});
