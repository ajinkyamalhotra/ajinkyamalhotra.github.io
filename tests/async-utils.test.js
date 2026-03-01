import { afterEach, describe, expect, it, vi } from "vitest";
import { debounce, sleep } from "@shared/utils/async.js";

describe("async utilities", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounce calls callback only once with latest arguments", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounce(callback, 120);

    debounced("first");
    debounced("second");
    debounced("final");

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(119);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("final");
  });

  it("sleep resolves after requested delay", async () => {
    vi.useFakeTimers();
    const marker = vi.fn();

    const promise = sleep(80).then(marker);
    vi.advanceTimersByTime(79);
    await Promise.resolve();
    expect(marker).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    await promise;
    expect(marker).toHaveBeenCalledTimes(1);
  });
});
