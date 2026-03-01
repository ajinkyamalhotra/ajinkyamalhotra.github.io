import { beforeEach, describe, expect, it, vi } from "vitest";
import { createExperienceFeature } from "@features/experience/experience-feature.js";

function setupDom() {
  document.body.innerHTML = `
    <input id="experienceSearch" />
    <button id="expViewTimeline"></button>
    <button id="expViewCards"></button>
    <div id="experienceContainer"></div>
  `;
}

const experienceContent = {
  searchPlaceholder: "Filter experience",
  searchPlaceholderCompact: "Filter...",
  records: [
    {
      company: "Arm",
      location: "Boston",
      period: "2024 - Present",
      link: "https://example.com",
      roles: [{ title: "Engineer", period: "2024 - Present", bullets: ["Build systems"] }],
      tags: ["Platform"],
    },
    {
      company: "AWS",
      location: "Seattle",
      period: "2020 - 2022",
      roles: [{ title: "Support", period: "2020 - 2022", bullets: ["Ops"] }],
      tags: ["Cloud"],
    },
  ],
};

describe("experience feature", () => {
  beforeEach(() => {
    setupDom();
  });

  it("renders timeline and cards views", () => {
    const reveal = { observe: vi.fn() };
    const feature = createExperienceFeature({ experienceContent, reveal });
    feature.init();

    expect(document.getElementById("experienceContainer").textContent).toContain("Arm");
    feature.setView("cards");
    expect(document.getElementById("experienceContainer").textContent).toContain("AWS");
    expect(reveal.observe).toHaveBeenCalled();
  });

  it("filters records by query", () => {
    vi.useFakeTimers();
    const reveal = { observe: vi.fn() };
    const feature = createExperienceFeature({ experienceContent, reveal });
    feature.init();

    const search = document.getElementById("experienceSearch");
    search.value = "aws";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    vi.advanceTimersByTime(130);

    expect(document.getElementById("experienceContainer").textContent).toContain("AWS");
    expect(document.getElementById("experienceContainer").textContent).not.toContain("Arm");
    vi.useRealTimers();
  });
});
