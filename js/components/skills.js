export function getSkillsHTML(skills) {
  let html = "";

  // Button container aligned to the right with an elegant, transparent button that animates on hover.
  html += `
    <div class="expand-all-container mb-4 flex justify-end">
      <button id="expand-all-btn" class="px-3 py-1 rounded border border-gray-400 text-gray-300 bg-transparent flex items-center transition duration-200 ease-in-out transform hover:scale-105 hover:bg-gray-700">
        <span class="expansion-icon mr-2">&#9662;</span>
        <span class="btn-text">Expand</span>
      </button>
    </div>
  `;

  skills.forEach((skill, index) => {
    const hasSubSkills = Array.isArray(skill.subSkills) && skill.subSkills.length > 0;
    html += `
      <div class="skill-item ${hasSubSkills ? "has-subskills" : ""}" data-index="${index}" ${hasSubSkills ? 'data-has-subskills="true"' : ""}>
        <div class="flex justify-between items-center mb-1 cursor-default">
          <div class="flex items-center text-lg font-bold text-gray-300">
            ${skill.name}
            ${hasSubSkills ? `<span class="ml-2 arrow text-gray-400">&#9662;</span>` : ""}
          </div>
          <span class="text-lg font-bold text-gray-300 skill-percentage" data-target="${skill.level}">0</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden progress-container">
          <div class="bg-teal-400 h-2.5 rounded-full progress-bar" style="width: 0;"></div>
        </div>
        ${hasSubSkills
        ? `
            <div class="sub-skills mt-2 ml-4" style="display: none;">
              <div class="flex flex-wrap -mx-2">
                ${skill.subSkills
          .map(
            (sub) => `
                    <div class="sub-skill-item mb-3 w-full md:w-1/2 px-2">
                      <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center">
                          <span class="sub-skill-bullet mr-2 text-gray-400">&#8226;</span>
                          <span class="text-sm font-medium text-gray-300">${sub.name}</span>
                        </div>
                        <span class="text-sm font-medium text-gray-300 sub-skill-percentage" data-target="${sub.level}">0</span>
                      </div>
                      <div class="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div class="bg-teal-400 h-2.5 rounded-full sub-progress-bar" style="width: 0;"></div>
                      </div>
                    </div>
                  `
          )
          .join("")}
              </div>
            </div>
          `
        : ""
      }
      </div>
    `;
  });

  return html;
}

export function initSkillsComponent(container, skills) {
  // Toggle individual sub-skills on click
  container.querySelectorAll('[data-has-subskills="true"]').forEach((skillItem) => {
    skillItem.addEventListener("click", () => {
      const subSkillsContainer = skillItem.querySelector(".sub-skills");
      if (subSkillsContainer) {
        const isHidden = subSkillsContainer.style.display === "none";
        subSkillsContainer.style.display = isHidden ? "block" : "none";
        // Rotate the arrow to indicate expanded/collapsed state
        const arrow = skillItem.querySelector(".arrow");
        if (arrow) {
          arrow.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
        }
        // Toggle a class for additional styling if needed
        if (isHidden) {
          skillItem.classList.add("expanded-box");
        } else {
          skillItem.classList.remove("expanded-box");
        }
      }
    });
  });

  // Event listener for the expand/collapse all button
  const expandAllBtn = container.querySelector("#expand-all-btn");
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      // Check if we should expand (if any sub-skills container is hidden)
      const subSkillsContainers = container.querySelectorAll(".sub-skills");
      let shouldExpand = false;
      subSkillsContainers.forEach((sub) => {
        if (sub.style.display === "none") {
          shouldExpand = true;
        }
      });
      // Toggle each sub-skills container accordingly
      subSkillsContainers.forEach((sub) => {
        const parentSkill = sub.closest(".skill-item");
        const arrow = parentSkill.querySelector(".arrow");
        if (shouldExpand) {
          sub.style.display = "block";
          if (arrow) arrow.style.transform = "rotate(180deg)";
          parentSkill.classList.add("expanded-box");
        } else {
          sub.style.display = "none";
          if (arrow) arrow.style.transform = "rotate(0deg)";
          parentSkill.classList.remove("expanded-box");
        }
      });
      // Update button icon and text based on the new state
      if (shouldExpand) {
        expandAllBtn.innerHTML = '<span class="expansion-icon mr-2" style="transform: rotate(180deg);">&#9662;</span><span class="btn-text">Collapse</span>';
      } else {
        expandAllBtn.innerHTML = '<span class="expansion-icon mr-2">&#9662;</span><span class="btn-text">Expand</span>';
      }
    });
  }

  // Animate progress bars and counters after a short delay
  setTimeout(() => {
    // Animate main skill progress bars and percentages
    container.querySelectorAll(".progress-bar").forEach((bar, index) => {
      const skillLevel = skills[index].level;
      bar.style.width = skillLevel * 10 + "%";
    });

    container.querySelectorAll(".skill-percentage").forEach((span) => {
      const target = parseFloat(span.getAttribute("data-target"));
      let current = 0;
      const stepTime = 20;
      const step = target / (2000 / stepTime);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        span.textContent = current.toFixed(1);
      }, stepTime);
    });

    // Animate sub-skill progress bars and percentages
    container.querySelectorAll(".sub-progress-bar").forEach((bar) => {
      const parentSkillEl = bar.closest(".skill-item");
      const skillIndex = parentSkillEl.getAttribute("data-index");
      const subSkills = skills[skillIndex].subSkills;
      const subSkillIndex = Array.from(
        parentSkillEl.querySelectorAll(".sub-progress-bar")
      ).indexOf(bar);
      const subSkill = subSkills[subSkillIndex];
      bar.style.width = subSkill.level * 10 + "%";
    });

    container.querySelectorAll(".sub-skill-percentage").forEach((span) => {
      const target = parseFloat(span.getAttribute("data-target"));
      let current = 0;
      const stepTime = 20;
      const step = target / (2000 / stepTime);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        span.textContent = current.toFixed(1);
      }, stepTime);
    });
  }, 500);
}