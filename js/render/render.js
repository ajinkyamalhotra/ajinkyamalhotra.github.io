// render.js

import { createCard } from "../components/card.js";
import { getSkillsHTML, initSkillsComponent } from "../components/skills.js";
import { initTimeline } from "../components/timeline.js";
import { logAction } from "../logger.js";

export function renderExperiences(container, data) {
    logAction("Rendering experiences", () => {
        container.innerHTML = "";
        data.forEach(item => {
            container.insertAdjacentHTML("beforeend", createCard(item));
        });
    });
}

export function renderProjects(container, data) {
    logAction("Rendering projects", () => {
        container.innerHTML = "";
        data.forEach(item => {
            container.insertAdjacentHTML("beforeend", createCard(item));
        });
    });
}

export function renderEducations(container, data) {
    logAction("Rendering education cards", () => {
        container.innerHTML = "";
        data.forEach(item => {
            container.insertAdjacentHTML("beforeend", createCard(item));
        });
    });
}

export function renderSkills(skills, container) {
    // Get the HTML for the skills component from the component module
    logAction("Rendering skills", () => {
        container.innerHTML = getSkillsHTML(skills);

        // Initialize component logic (event listeners, animations, etc.)
        initSkillsComponent(container, skills);
    });
}

export function renderTimeline(container, timelineData) {
    logAction("Rendering timeline", () => {
        initTimeline(container, timelineData);
    });
}

/**
 * Combines all components to render the entire application's stage one.
 * Uses the existing #app div as the container.
 */
export function renderApp() {
    // Create a fragment to build the app
    return logAction("Rendering the full app", () => {
        const fragment = document.createDocumentFragment();

        // Append the components in order
        fragment.appendChild(renderPreloader());
        fragment.appendChild(renderThemeToggle());
        // Create the main container that holds the sidebar and main content.
        const mainContainer = document.createElement("div");
        mainContainer.id = "outerContainer";
        mainContainer.className = "flex justify-center items-center h-screen p-4";

        // Create a "spotlight" element
        const spotlight = document.createElement("div");
        spotlight.id = "spotlight";
        spotlight.className = "spotlight";
        mainContainer.appendChild(spotlight);

        // Create the inner container that holds sidebar and main content
        const innerContainer = document.createElement("div");
        innerContainer.id = "mainContainer";
        innerContainer.className = "mt-14 w-full max-w-7xl h-full shadow-lg " +
            "rounded-lg flex";

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

// Preloader
function renderPreloader() {
    return logAction("Rendering preloader", () => {
        const preloader = document.createElement("div");
        preloader.id = "preloader";
        const loader = document.createElement("div");
        loader.className = "loader";
        preloader.appendChild(loader);
        return preloader;
    });
}

// Theme Toggle (Light/Dark)
function renderThemeToggle() {
    return logAction("Rendering theme toggle", () => {
        const container = document.createElement("div");
        container.id = "themeToggleContainer";

        const label = document.createElement("label");
        label.className = "theme-switch";
        label.setAttribute("for", "themeToggle");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = "themeToggle";
        label.appendChild(input);

        const slider = document.createElement("div");
        slider.className = "slider";
        const sunIcon = document.createElement("span");
        sunIcon.className = "sun-icon";
        sunIcon.innerHTML = "&#9728;";
        const moonIcon = document.createElement("span");
        moonIcon.className = "moon-icon";
        moonIcon.innerHTML = "&#9790;";
        slider.appendChild(sunIcon);
        slider.appendChild(moonIcon);
        label.appendChild(slider);

        container.appendChild(label);
        return container;
    });
}

// Sidebar (Left column)
function renderSidebar() {
    return logAction("Rendering sidebar", () => {
        const aside = document.createElement("aside");
        aside.id = "leftSidebar";
        aside.className = "w-1/3 text-white p-6 flex flex-col";

        // Header Section
        const header = document.createElement("header");
        header.className = "mb-8";

        const h2 = document.createElement("h2");
        h2.id = "siteName";
        h2.className = "text-5xl font-extrabold dark:text-white";
        header.appendChild(h2);

        header.appendChild(document.createElement("br"));

        const jobTitle = document.createElement("p");
        jobTitle.id = "jobTitle";
        jobTitle.className = "mb-4 text-2xl font-bold text-gray-300";
        header.appendChild(jobTitle);

        const tagline = document.createElement("p");
        tagline.id = "tagline";
        tagline.className = "mb-6 text-2xl font-normal text-gray-400";
        header.appendChild(tagline);

        aside.appendChild(header);

        // Navigation Bar
        const nav = document.createElement("nav");
        nav.className = "fancy-nav";

        const navButtons = [
            {
                id: "btn-section1", icon: "fas fa-user",
                text: "About", section: "section1"
            },
            {
                id: "btn-section2", icon: "fas fa-briefcase",
                text: "Experience", section: "section2"
            },
            {
                id: "btn-section3", icon: "fas fa-code",
                text: "Projects", section: "section3"
            },
            {
                id: "btn-section4", icon: "fas fa-chart-bar",
                text: "Skills", section: "section4"
            },
            {
                id: "btn-section5", icon: "fas fa-graduation-cap",
                text: "Education", section: "section5"
            },
            {
                id: "btn-sectionTimeline", icon: "fas fa-stream",
                text: "Timeline", section: "sectionTimeline"
            },
        ];

        navButtons.forEach((btnData) => {
            const button = document.createElement("button");
            button.className = "nav-button";
            button.id = btnData.id;
            button.setAttribute("onclick", `scrollToSection('${btnData.section}')`);
            button.innerHTML = `<i class="${btnData.icon}"></i> ${btnData.text}`;
            nav.appendChild(button);
        });

        // Resume Link
        const resumeLink = document.createElement("a");
        resumeLink.className = "nav-button";
        resumeLink.id = "btn-resume";
        resumeLink.href = "resume.pdf";
        resumeLink.target = "_blank";
        resumeLink.setAttribute("aria-label", "Resume");
        resumeLink.setAttribute("title", "View Resume");
        resumeLink.innerHTML = `<i class="fas fa-file-alt"></i> Resume`;
        nav.appendChild(resumeLink);

        aside.appendChild(nav);

        // Social Icons Container
        const socialContainer = document.createElement("div");
        socialContainer.id = "socialContainer";
        socialContainer.className = "my-14 social-icons";
        aside.appendChild(socialContainer);

        return aside;
    });
}

// Main Content (Right column)
function renderMainContent() {
    return logAction("Rendering main content area", () => {
        const main = document.createElement("main");
        main.id = "rightSection";
        main.className = "w-2/3 overflow-y-auto p-6 h-full custom-scrollbar";

        // About Section
        const aboutSection = document.createElement("section");
        aboutSection.id = "section1";
        aboutSection.className =
            "fade-in mb-10 p-6 rounded-lg text-gray-400 leading-relaxed";
        const aboutContent = document.createElement("div");
        aboutContent.id = "aboutContent";
        aboutSection.appendChild(aboutContent);
        main.appendChild(aboutSection);

        // Experience Section
        const expSection = document.createElement("section");
        expSection.id = "section2";
        expSection.className = "fade-in mb-10 p-6 border-t border-gray-300 mt-4";
        expSection.innerHTML = `
      <br>
      <input type="text" id="experienceSearch" placeholder="Search experiences..."
      class="fancy-search mb-4" />
      <div class="space-y-6 w-full max-w-4xl" id="experienceContainer"></div>
    `;
        main.appendChild(expSection);

        // Projects Section
        const projSection = document.createElement("section");
        projSection.id = "section3";
        projSection.className = "fade-in mb-10 p-6 border-t border-gray-300 mt-4";
        projSection.innerHTML = `
      <br>
      <input type="text" id="projectSearch" placeholder="Search projects..." class
      ="fancy-search mb-4" />
      <div class="space-y-6 w-full max-w-4xl" id="projectsContainer"></div>
    `;
        main.appendChild(projSection);

        // Skills Section
        const skillsSection = document.createElement("section");
        skillsSection.id = "section4";
        skillsSection.className = "fade-in mb-10 p-6 border-t border-gray-300 mt-4";
        skillsSection.innerHTML = `
      <br>
      <div class="space-y-6 w-full max-w-4xl" id="skillsContainer"></div>
    `;
        main.appendChild(skillsSection);

        // Education Section
        const eduSection = document.createElement("section");
        eduSection.id = "section5";
        eduSection.className = "fade-in mb-10 p-6 border-t border-gray-300 mt-4";
        eduSection.innerHTML = `
      <br>
      <div class="space-y-6 w-full max-w-4xl" id="eduContainer"></div>
    `;
        main.appendChild(eduSection);

        // Timeline Section
        const timelineSection = document.createElement("section");
        timelineSection.id = "sectionTimeline";
        timelineSection.className = "fade-in mb-10 p-6 border-t border-gray-300 " +
            "mt-4 relative";
        const toggleBtn = document.createElement("button");
        toggleBtn.id = "toggleSortBtn";
        toggleBtn.className =
            "absolute top-0 right-0 m-4 px-4 py-2 border border-teal-500 text-te" +
            "al-500 rounded hover:bg-teal-500 hover:text-white bg-transparent";
        toggleBtn.textContent = "View Oldest First";
        timelineSection.appendChild(toggleBtn);

        const timelineContainer = document.createElement("div");
        timelineContainer.id = "timelineContainer";
        timelineContainer.className = "timeline-container relative mx-auto";
        timelineSection.appendChild(timelineContainer);
        main.appendChild(timelineSection);

        return main;
    });
}

// Extra UI Elements (Back-to-Top, Global Search, Info Popup)
function renderExtraUI() {
    return logAction("Rendering extra UI elements", () => {
        const container = document.createElement("div");

        // Back to Top Button
        const backToTop = document.createElement("button");
        backToTop.id = "backToTop";
        backToTop.textContent = "Scroll ↑";
        container.appendChild(backToTop);

        // Floating Search Button and Input
        const searchContainer = document.createElement("div");
        searchContainer.id = "searchContainer";

        const searchButton = document.createElement("button");
        searchButton.id = "searchIcon";
        searchButton.innerHTML = "&#128269;";
        searchContainer.appendChild(searchButton);

        const searchWrapper = document.createElement("div");
        searchWrapper.className = "search-input-wrapper";
        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.id = "searchBox";
        searchBox.className = "fancy-search";
        searchBox.placeholder = "Global Search...";
        searchWrapper.appendChild(searchBox);
        const matchCounter = document.createElement("span");
        matchCounter.id = "matchCounter";
        matchCounter.className = "match-counter";
        searchWrapper.appendChild(matchCounter);
        searchContainer.appendChild(searchWrapper);
        container.appendChild(searchContainer);

        // Website Info Button
        const infoButton = document.createElement("button");
        infoButton.id = "infoButton";
        infoButton.setAttribute("onclick", "toggleInfoPopup(event)");
        infoButton.innerHTML = `<i class="fas fa-info-circle"></i> Website Info`;
        container.appendChild(infoButton);

        // Hidden Deployment Details (Info Popup)
        const infoPopup = document.createElement("div");
        infoPopup.id = "infoPopup";
        infoPopup.innerHTML = `
      <p><i class="fas fa-code-branch"></i> Version: <span
      id="versionCount">Loading...</span></p>
      <p><i class="far fa-clock"></i> Last Updated: <span
      id="versionDate">Fetching...</span></p>
      <p><i class="fas fa-terminal"></i> Commit SHA: <span
      id="versionSHA">Fetching...</span></p>
      <p><i class="fas fa-user"></i> Deployed By: <span
      id="versionDeployer">Fetching...</span></p>
      <p><i class="fas fa-star"></i> Stars: <span
      id="repoStars">Loading...</span></p>
      <p><i class="fas fa-code-branch"></i> Forks: <span
      id="repoForks">Loading...</span></p>
      <p><i class="fas fa-exclamation-circle"></i> Open Issues: <span
      id="repoIssues">Loading...</span></p>
      <p><i class="fas fa-code-pull-request"></i> Open PRs: <span
      id="repoPRs">Loading...</span></p>
      <p><i class="fas fa-code"></i> Languages Used:</p>
      <canvas id="languagesChart"></canvas>
    `;
        container.appendChild(infoPopup);

        return container;
    });
}
