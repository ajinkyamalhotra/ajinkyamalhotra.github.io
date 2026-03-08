import { describe, expect, it } from "vitest";
import { APP_EVENTS } from "@shared/constants/events.js";
import { SESSION_KEYS, STORAGE_KEYS } from "@shared/constants/storage-keys.js";

describe("constants", () => {
  it("defines stable app events and storage keys", () => {
    expect(APP_EVENTS.themeChanged).toBe("portfolio:theme-changed");
    expect(STORAGE_KEYS.theme).toBe("aj_theme");
    expect(STORAGE_KEYS.terminalHistory).toBe("portfolio.terminal.history");
    expect(SESSION_KEYS.bootSeen).toBe("aj_boot_seen");
  });
});
