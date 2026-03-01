import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProjectsFeature } from "@features/projects/projects-feature.js";

function setupDom() {
  document.body.innerHTML = `
    <input id="projectSearch" />
    <div id="projectFilters"></div>
    <div id="projectsGrid"></div>
  `;
}

const projects = [
  {
    title: "Alpha",
    period: "2024",
    desc: "AWS automation",
    tags: ["AWS", "Automation"],
  },
  {
    title: "Beta",
    period: "2025",
    desc: "UI project",
    tags: ["UI"],
  },
];

describe("projects feature", () => {
  beforeEach(() => {
    setupDom();
  });

  it("renders projects and opens project on card click", () => {
    const onProjectOpen = vi.fn();
    const reveal = { observe: vi.fn() };

    const feature = createProjectsFeature({
      projects,
      reveal,
      onProjectOpen,
    });

    feature.init();

    const cards = document.querySelectorAll("[data-project-index]");
    expect(cards.length).toBe(2);
    cards[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onProjectOpen).toHaveBeenCalledWith(projects[0]);
    expect(reveal.observe).toHaveBeenCalled();
  });

  it("applies explicit filter through public API", () => {
    const onProjectOpen = vi.fn();
    const reveal = { observe: vi.fn() };
    const feature = createProjectsFeature({ projects, reveal, onProjectOpen });

    feature.init();
    feature.setFilter("UI");

    const cards = document.querySelectorAll("[data-project-index]");
    expect(cards.length).toBe(1);
    expect(document.getElementById("projectsGrid").textContent).toContain("Beta");
  });
});
