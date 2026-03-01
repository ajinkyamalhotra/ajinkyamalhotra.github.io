import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText } from "@shared/services/clipboard-service.js";

function mockClipboardWrite(writeImpl) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: writeImpl,
    },
  });
}

describe("clipboard service", () => {
  let originalExecCommand;

  afterEach(() => {
    if (originalExecCommand) {
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: originalExecCommand,
      });
      originalExecCommand = undefined;
    }
  });

  it("uses navigator clipboard when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboardWrite(writeText);

    const result = await copyText("hello@example.com");

    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello@example.com");
  });

  it("falls back to execCommand copy when clipboard API fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("blocked"));
    mockClipboardWrite(writeText);

    originalExecCommand = document.execCommand;
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });

    const result = await copyText("fallback text");

    expect(result).toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });
});
