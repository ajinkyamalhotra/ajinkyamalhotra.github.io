import {
  logAction, getUnfinishedTasks, getUnfinishedTaskCount
} from "./logger.js";
import {
  renderExperiences, renderProjects, renderSkills, renderTimeline,
  renderEducations, renderApp
} from "./render/render.js";
import { initTheme } from "./theme/theme.js";
import { invokeAPIsAndUpdateUI } from "./api/wrapper.js";
import { scrollToSection, initNav } from "./components/nav.js";
import { initContentSearch } from "./components/search.js";
import { initSpotlight } from "./components/spotlight.js";
import { toggleInfoPopup } from "./components/info.js";
import { initFadeIn } from "./animations/fadeIn.js";
import { initScroll } from "./animations/scroll.js";
import { initBackToTop } from "./components/backToTop.js";
import { initCardSearch } from "./components/cardSearch.js";
import { populateSocialLinks } from "./components/social.js";
import { setupTimelineToggle } from "./components/timeline.js";

document.addEventListener("DOMContentLoaded", () => {
  // Use the existing #app div as our outer container.
  logAction("DOMContentLoaded event", () => {
    // Render the main app structure.
    const app = document.getElementById("app");
    logAction("Rendering app structure", () => {
      const appContent = renderApp();
      app.appendChild(appContent);
    });

    // Cache DOM elements
    const siteNameEl = document.getElementById("siteName");
    const jobTitleEl = document.getElementById("jobTitle");
    const taglineEl = document.getElementById("tagline");
    const aboutEl = document.getElementById("aboutContent");
    const socialContainerEl = document.getElementById("socialContainer");
    const expContainer = document.getElementById("experienceContainer");
    const projContainer = document.getElementById("projectsContainer");
    const skillsContainer = document.getElementById("skillsContainer");
    const eduContainer = document.getElementById("eduContainer");
    const preloader = document.getElementById("preloader");
    const themeToggle = document.getElementById("themeToggle");
    const backToTop = document.getElementById("backToTop");
    const rightSection = document.getElementById("rightSection");
    const searchContainer = document.getElementById("searchContainer");
    const searchIcon = document.getElementById("searchIcon");
    const searchBox = document.getElementById("searchBox");
    const expSearchInput = document.getElementById("experienceSearch");
    const projSearchInput = document.getElementById("projectSearch");
    const contentDiv = document.querySelector(".content");
    const matchCounter = document.getElementById("matchCounter");
    const timelineContainer = document.getElementById("timelineContainer");
    const toggleBtn = document.getElementById("toggleSortBtn");

    // Invoke APIs and update UI.
    logAction("Invoking APIs and updating UI", () => {
      invokeAPIsAndUpdateUI();
    });

    // Initialize theme, scroll functions, and timeline data.
    logAction("Initializing theme", () => {
      initTheme(themeToggle, document.body);
      window.scrollToSection = scrollToSection;
      window.toggleInfoPopup = toggleInfoPopup;
      window.timelineData = timelineData; // Ensure timelineData is defined.
    });

    // Populate header info and about section.
    logAction("Populating header and about section", () => {
      siteNameEl.textContent = siteData.name;
      jobTitleEl.textContent = siteData.jobTitle;
      taglineEl.textContent = siteData.tagline;
      const frag = document.createDocumentFragment();
      siteData.about.forEach(paragraph => {
        const p = document.createElement("p");
        p.className = "mb-4 text-lg";
        p.textContent = paragraph;
        frag.appendChild(p);
      });
      aboutEl.appendChild(frag);
    });

    // Populate social links.
    logAction("Populating social links", () => {
      populateSocialLinks(socialContainerEl, siteData.socialLinks);
    });

    // Render experiences, projects, education, skills, and timeline.
    logAction("Rendering experiences", () => {
      renderExperiences(expContainer, experiences);
    });
    logAction("Rendering projects", () => {
      renderProjects(projContainer, projects);
    });
    logAction("Rendering education details", () => {
      renderEducations(eduContainer, educations);
    });
    logAction("Rendering skills", () => {
      renderSkills(skills, skillsContainer);
    });
    logAction("Rendering timeline", () => {
      renderTimeline(timelineContainer, window.timelineData);
    });

    // Set initial active nav button
    logAction("Setting active navigation button", () => {
      document.getElementById("btn-section1").classList.add("nav-active");
    });

    // Remove preloader with fade-out animation.
    if (preloader) {
      logAction("Fading out preloader", () => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.remove();
          // Log removal of preloader separately since it's asynchronous.
          console.log("%c🕒 Preloader removed (after delay)",
            "color: #32CD32; font-weight: bold; font-size: 12px;");
        }, 500);
      });
    }

    // Initialize features
    logAction("Initializing Back to Top button", () => {
      initBackToTop(backToTop, rightSection);
    });
    logAction("Initializing card search", () => {
      initCardSearch(expSearchInput, projSearchInput, experiences,
        projects, expContainer, projContainer);
    });
    logAction("Initializing content search", () => {
      initContentSearch(
        { searchContainer, searchIcon, searchBox, contentDiv, matchCounter });
    });
    logAction("Initializing navigation", () => {
      initNav(rightSection);
    });
    logAction("Initializing fade-in animations", () => {
      initFadeIn();
    });
    logAction("Initializing scroll animations", () => {
      initScroll(rightSection);
    });
    logAction("Initializing spotlight", () => {
      initSpotlight();
    });
    logAction("Setting up timeline toggle", () => {
      setupTimelineToggle(toggleBtn, timelineContainer, window.timelineData);
    });
  });

  // After initialization, report any tasks that were started but never finished
  // We delay this report by 1 second to allow asynchronous tasks to complete.
  setTimeout(() => {
    const unfinished = getUnfinishedTasks();
    const count = getUnfinishedTaskCount();
    if (count > 0) {
      console.warn("WARNING: The following tasks were started but never finished:");
      unfinished.forEach(task => {
        console.warn(`Task #${task.taskId}: ${task.action}`);
      });
    } else {
      console.log("%cAll tasks finished successfully!",
        "color: #32CD32; font-weight: bold; font-size: 12px;");
    }
  }, 1000);
});
