import { describe, expect, it } from "vitest";
import { APP_EVENTS } from "@shared/constants/events.js";
import { ROUTE_BY_SECTION, SECTION_BY_ROUTE } from "@shared/constants/routes.js";
import { SESSION_KEYS, STORAGE_KEYS } from "@shared/constants/storage-keys.js";

describe("constants", () => {
  it("maps section->route and route->section consistently", () => {
    Object.entries(ROUTE_BY_SECTION).forEach(([section, route]) => {
      expect(SECTION_BY_ROUTE[route]).toBe(section);
    });
  });

  it("defines stable app events and storage keys", () => {
    expect(APP_EVENTS.themeChanged).toBe("portfolio:theme-changed");
    expect(STORAGE_KEYS.theme).toBe("aj_theme");
    expect(STORAGE_KEYS.terminalHistory).toBe("portfolio.terminal.history");
    expect(SESSION_KEYS.bootSeen).toBe("aj_boot_seen");
  });
});
