import { describe, expect, it, vi } from "vitest";
import { createServiceWorkerProvider } from "@app/providers/service-worker-provider.js";

describe("service worker provider", () => {
  it("registers service worker on window load", async () => {
    const register = vi.fn().mockResolvedValue({});
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    });

    createServiceWorkerProvider({ scriptUrl: "./sw.js" }).register();
    window.dispatchEvent(new Event("load"));
    await Promise.resolve();

    expect(register).toHaveBeenCalledWith("./sw.js");
  });

  it("no-ops when serviceWorker API is unavailable", () => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: undefined,
    });

    expect(() => createServiceWorkerProvider().register()).not.toThrow();
  });

  it("swallows registration errors", async () => {
    const register = vi.fn().mockRejectedValue(new Error("fail"));
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register },
    });

    createServiceWorkerProvider({ scriptUrl: "./sw.js" }).register();
    window.dispatchEvent(new Event("load"));
    await Promise.resolve();

    expect(register).toHaveBeenCalledWith("./sw.js");
  });
});
