import { beforeEach, describe, expect, it, vi } from "vitest";
import { createContactFeature } from "@features/contact/contact-feature.js";

function setupDom() {
  document.body.innerHTML = `
    <div id="contactMeta"></div>
    <a id="emailLink" href="#"></a>
    <a id="linkedinLink" href="#"></a>
    <a id="githubLink" href="#"></a>
    <a id="phoneLink" href="#"></a>
    <a id="profileLink" href="#"></a>
    <button id="copyEmail" data-copy-key="email"></button>
  `;
}

function setupClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return { writeText };
}

describe("contact feature", () => {
  beforeEach(() => {
    setupDom();
  });

  it("hydrates contact links and metadata", () => {
    const toast = { show: vi.fn() };
    const profile = {
      email: "me@example.com",
      phone: "+1 (555) 123-4567",
      location: "Boston, MA",
      social: {
        linkedin: "https://linkedin.test/me",
        github: "https://github.test/me",
      },
    };

    createContactFeature({ profile, toast }).init();

    expect(document.getElementById("contactMeta").textContent).toContain("me@example.com");
    expect(document.getElementById("emailLink").getAttribute("href")).toBe("mailto:me@example.com");
    expect(document.getElementById("linkedinLink").getAttribute("href")).toBe(
      "https://linkedin.test/me",
    );
    expect(document.getElementById("githubLink").getAttribute("href")).toBe(
      "https://github.test/me",
    );
    expect(document.getElementById("phoneLink").getAttribute("href")).toBe("tel:+15551234567");
  });

  it("copies values by key and shows success toast", async () => {
    const { writeText } = setupClipboard();
    const toast = { show: vi.fn() };
    const profile = {
      email: "me@example.com",
      phone: "+1 (555) 123-4567",
      location: "Boston, MA",
      social: {
        linkedin: "https://linkedin.test/me",
        github: "https://github.test/me",
      },
    };

    const feature = createContactFeature({ profile, toast });
    await feature.copyByKey("email");

    expect(writeText).toHaveBeenCalledWith("me@example.com");
    expect(toast.show).toHaveBeenCalledWith("Email copied.");
  });

  it("shows failure toast for unknown copy key", async () => {
    const toast = { show: vi.fn() };
    const profile = {
      email: "me@example.com",
      phone: "+1 (555) 123-4567",
      location: "Boston, MA",
      social: {
        linkedin: "https://linkedin.test/me",
        github: "https://github.test/me",
      },
    };

    const feature = createContactFeature({ profile, toast });
    await feature.copyByKey("unknown");

    expect(toast.show).toHaveBeenCalledWith("Copy failed.");
  });
});
