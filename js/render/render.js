import { createCard, createProjectCard } from "../components/card.js";
import { getSkillsHTML, initSkillsComponent } from "../components/skills.js";

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
    // Get the HTML for the skills component from the component module
    container.innerHTML = getSkillsHTML(skills);

    // Initialize component logic (event listeners, animations, etc.)
    initSkillsComponent(container, skills);
}
