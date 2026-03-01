import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProjectModalFeature } from "@features/project-modal/project-modal-feature.js";

function setupDom() {
  document.body.innerHTML = `
    <button id="trigger">open</button>
    <div id="modalOverlay" aria-hidden="true">
      <div data-close="modal"></div>
      <div id="modalTitle"></div>
      <div id="modalBody"></div>
      <button data-close="modal">close</button>
    </div>
  `;
}

describe("project modal feature", () => {
  beforeEach(() => {
    setupDom();
  });

  it("opens and closes with project payload", () => {
    const toast = { show: vi.fn() };
    const modal = createProjectModalFeature({ toast });
    const project = {
      title: "Demo Project",
      period: "2024 - 2025",
      desc: "Description",
      tags: ["JS"],
      highlights: ["One"],
      link: "https://example.com/repo",
    };

    modal.open(project);

    expect(document.getElementById("modalOverlay").getAttribute("aria-hidden")).toBe("false");
    expect(document.getElementById("modalTitle").textContent).toBe("Demo Project");
    expect(document.getElementById("modalBody").textContent).toContain("Description");
    expect(modal.getCurrent()).toEqual(project);

    modal.close();
    expect(document.getElementById("modalOverlay").getAttribute("aria-hidden")).toBe("true");
    expect(modal.getCurrent()).toBeUndefined();
  });

  it("copies project link from modal action", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const toast = { show: vi.fn() };
    const modal = createProjectModalFeature({ toast });

    modal.open({
      title: "Project X",
      period: "2024",
      desc: "X",
      link: "https://example.com/project-x",
    });

    document
      .getElementById("projectModalCopyLink")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await Promise.resolve();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith("https://example.com/project-x");
    expect(toast.show).toHaveBeenCalledWith("Copied.");
  });
});
