import { beforeEach, describe, expect, it } from "vitest";
import { createLocalStorageRepository } from "@shared/services/storage-repository.js";

describe("storage repository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads fallback when key is missing", () => {
    const repo = createLocalStorageRepository("unit_key", { ok: true });
    expect(repo.read()).toEqual({ ok: true });
  });

  it("writes and reads serialized values", () => {
    const repo = createLocalStorageRepository("unit_key", null);
    repo.write({ count: 2, state: "ready" });
    expect(repo.read()).toEqual({ count: 2, state: "ready" });
  });

  it("returns fallback for invalid JSON payloads", () => {
    localStorage.setItem("unit_key", "{invalid");
    const repo = createLocalStorageRepository("unit_key", ["fallback"]);
    expect(repo.read()).toEqual(["fallback"]);
  });

  it("removes persisted value", () => {
    const repo = createLocalStorageRepository("unit_key", null);
    repo.write("value");
    repo.remove();
    expect(localStorage.getItem("unit_key")).toBeNull();
  });
});
