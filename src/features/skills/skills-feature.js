import { createSkillsRadarFeature } from "@features/skills/skills-radar-feature.js";
import { escapeHtml } from "@shared/utils/text.js";

export function createSkillsFeature({ skillCategories }) {
  function renderSkillGroups() {
    const host = document.getElementById("skillsList");
    if (!host) {
      return;
    }

    host.innerHTML = skillCategories
      .map(
        (category) => `
          <article class="skillGroup">
            <div class="skillGroup__head">
              <div class="skillGroup__name">${escapeHtml(category.name)}</div>
              <div class="skillGroup__level">${escapeHtml(String(category.level))}/10</div>
            </div>
            <div class="subskills">
              ${(category.subSkills || []).map((skill) => `<span class="subskill">${escapeHtml(skill.name)}</span>`).join("")}
            </div>
          </article>
        `,
      )
      .join("");
  }

  function init() {
    renderSkillGroups();
    createSkillsRadarFeature({ skills: skillCategories }).init();
  }

  return {
    init,
    render: renderSkillGroups,
  };
}
