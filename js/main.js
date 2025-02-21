import {
  logAction, getUnfinishedTasks, getUnfinishedTaskCount
} from "./logger.js";
import {
  renderExperiences, renderProjects, renderSkills, renderTimeline,
  renderEducations, renderApp
} from "./render/render.js";
import { initTheme } from "./theme/theme.js";
import { githubApiWrapper } from "./api/wrapper.js";
import { scrollToSection, initNav } from "./components/nav.js";
import { initContentSearch } from "./components/search.js";
import { initSpotlight } from "./components/spotlight.js";
import { toggleInfoPopup } from "./components/info.js";
import { initFadeIn } from "./animations/fadeIn.js";
import { initScroll } from "./animations/scroll.js";
import { initBackToTop } from "./components/backToTop.js";
import { initCardSearch } from "./components/card.js";
import { populateSocialLinks, populateInfo } from "./components/misc.js";
import { setupTimelineToggle } from "./components/timeline.js";

document.addEventListener("DOMContentLoaded", () => {
  // Use the existing #app div as our outer container.
  logAction("DOMContentLoaded event", () => {
    // Render the main app structure and caches DOM elements
    const app = document.getElementById("app");
    const appContent = renderApp();
    app.appendChild(appContent);
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
    const backToTopContainer = document.getElementById("backToTopContainer");
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

    // Calling Github API, Initialize theme, scroll func, and timeline data.
    githubApiWrapper();
    initTheme(themeToggle, document.body);
    window.scrollToSection = scrollToSection;
    window.toggleInfoPopup = toggleInfoPopup;
    window.timelineData = timelineData;

    // Start populating/rendering website UI elements.
    populateInfo(siteNameEl, jobTitleEl, taglineEl, siteData, aboutEl);
    populateSocialLinks(socialContainerEl, siteData.socialLinks);
    renderExperiences(expContainer, experiences);
    renderProjects(projContainer, projects);
    renderEducations(eduContainer, educations);
    renderSkills(skills, skillsContainer);
    renderTimeline(timelineContainer, window.timelineData);
    document.getElementById("btn-section1").classList.add("nav-active");

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
    initBackToTop(backToTopContainer, backToTop, rightSection);
    initCardSearch(expSearchInput, projSearchInput, experiences,
      projects, expContainer, projContainer);
    initContentSearch(
      { searchContainer, searchIcon, searchBox, contentDiv, matchCounter });
    initNav(rightSection);
    initFadeIn();
    initScroll(rightSection);
    initSpotlight();
    setupTimelineToggle(toggleBtn, timelineContainer, window.timelineData);
  });

  // After the DOM/APP are built, restore scroll position on the container.
  const savedScroll = sessionStorage.getItem('scrollPosition');
  if (savedScroll) {
    requestAnimationFrame(() => {
      const rightSection = document.getElementById("rightSection");
      if (rightSection) {
        rightSection.scrollTop = parseInt(savedScroll, 10);
        console.log("Container scroll position restored to:", savedScroll);
      }
    });
  }

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
