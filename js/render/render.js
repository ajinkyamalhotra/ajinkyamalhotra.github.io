import { createCard, createProjectCard } from "../components/card.js";

export function renderExperiences(container, data) {
    container.innerHTML = "";
    data.forEach(item => {
        container.insertAdjacentHTML("beforeend", createCard(item));
    });
}

export function renderProjects(container, data) {
    container.innerHTML = "";
    data.forEach(item => {
        container.insertAdjacentHTML("beforeend", createProjectCard(item));
    });
}

export function renderSkills(skills, container) {
    let html = "";
    skills.forEach(skill => {
        html += `
      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <div class="text-lg font-bold text-gray-300">${skill.name}</div>
          <span class="text-lg font-bold text-gray-300 skill-percentage" data-target="${skill.level}">0%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div class="bg-teal-400 h-2.5 rounded-full progress-bar" style="width: 0;"></div>
        </div>
      </div>
    `;
    });
    container.innerHTML = html;

    // Animate progress bars and number counters
    setTimeout(() => {
        container.querySelectorAll(".progress-bar").forEach((bar, index) => {
            const skillLevel = skills[index].level;
            bar.style.width = skillLevel + "%";
        });
        container.querySelectorAll(".skill-percentage").forEach(span => {
            const target = parseInt(span.getAttribute("data-target"));
            let current = 0;
            const stepTime = 20;
            const step = target / (2000 / stepTime);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                span.textContent = Math.round(current) + '%';
            }, stepTime);
        });
    }, 500);
}
