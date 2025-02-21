// render.js

import { createCard } from "../components/card.js";
import { getSkillsHTML, initSkillsComponent } from "../components/skills.js";
import { initTimeline } from "../components/timeline.js";
import {
    renderPreloader, renderThemeToggle, renderExtraUI
} from "../components/misc.js";
import { renderSidebar } from "../components/nav.js";
import { renderMainContent } from "../components/mainContainer.js";
import { logAction } from "../logger.js";

export function renderExperiences(container, data) {
    logAction(`${renderExperiences.name}()`, () => {
        container.innerHTML = "";
        data.forEach(item => {
            container.insertAdjacentHTML("beforeend", createCard(item));
        });
    });
}

export function renderProjects(container, data) {
    logAction(`${renderProjects.name}()`, () => {
        container.innerHTML = "";
        data.forEach(item => {
            container.insertAdjacentHTML("beforeend", createCard(item));
        });
    });
}

export function renderEducations(container, data) {
    logAction(`${renderEducations.name}()`, () => {
        container.innerHTML = "";
        data.forEach(item => {
            container.insertAdjacentHTML("beforeend", createCard(item));
        });
    });
}

export function renderSkills(skills, container) {
    logAction(`${renderSkills.name}()`, () => {
        container.innerHTML = getSkillsHTML(skills);

        initSkillsComponent(container, skills);
    });
}

export function renderTimeline(container, timelineData) {
    logAction(`${renderTimeline.name}()`, () => {
        initTimeline(container, timelineData);
    });
}

/**
 * Combines all components to render the entire application's initial state.
 * @returns all combined components
 */
export function renderApp() {
    // Create a fragment to build the app
    return logAction(`${renderApp.name}()`, () => {
        const fragment = document.createDocumentFragment();

        // Append the components in order
        fragment.appendChild(renderPreloader());
        fragment.appendChild(renderThemeToggle());
        // Create the main container that holds the sidebar and main content.
        const mainContainer = document.createElement("div");
        mainContainer.id = "outerContainer";
        mainContainer.className = "flex justify-center items-center h-screen p-3 pt-0 pb-0 overflow-hidden";

        // Create a "spotlight" element
        const spotlight = document.createElement("div");
        spotlight.id = "spotlight";
        spotlight.className = "spotlight";
        mainContainer.appendChild(spotlight);

        // Create the inner container that holds sidebar and main content
        const innerContainer = document.createElement("div");
        innerContainer.id = "mainContainer";
        innerContainer.className = "w-full max-w-6xl h-full " +
            "rounded-lg flex overflow-hidden gap-4";

        // Append sidebar and main content
        innerContainer.appendChild(renderSidebar());
        innerContainer.appendChild(renderMainContent());

        mainContainer.appendChild(innerContainer);
        fragment.appendChild(mainContainer);

        // Append extra UI elements (back-to-top, search, info popup)
        fragment.appendChild(renderExtraUI());

        return fragment;
    });
}