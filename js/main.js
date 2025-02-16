import {
  renderExperiences, renderProjects, renderSkills, renderTimeline,
  renderEducations
} from "./render/render.js";
import { initTheme } from "./theme/theme.js";
import { invokeAPIsAndUpdateUI } from "./api/wrapper.js";
import { scrollToSection, initNav } from "./components/nav.js";
import { initContentSearch } from "./components/search.js";
import { initSpotlight } from "./components/spotlight.js";
import { toggleInfoPopup } from "./components/info.js";
import { initFadeIn } from "./animations/fadeIn.js";
import { initScroll } from "./animations/scroll.js";
import { initSpotlightEffect } from "./animations/spotlightEffect.js";
import { initBackToTop } from "./components/backToTop.js";
import { initCardSearch } from "./components/cardSearch.js";
import { populateSocialLinks } from "./components/social.js";
import { setupTimelineToggle } from "./components/timeline.js";

document.addEventListener("DOMContentLoaded", () => {
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

  invokeAPIsAndUpdateUI();

  // Initialize theme, scroller, website-deployment and timeline info
  initTheme(themeToggle, document.body);
  window.scrollToSection = scrollToSection;
  window.toggleInfoPopup = toggleInfoPopup;
  window.timelineData = timelineData;

  // Populate header info, about sectiom and social links
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
  populateSocialLinks(socialContainerEl, siteData.socialLinks);

  // Render Experiences/Projects cards and skills
  renderExperiences(expContainer, experiences);
  renderProjects(projContainer, projects);
  renderEducations(eduContainer, educations);
  renderSkills(skills, skillsContainer);
  renderTimeline(timelineContainer, window.timelineData);

  // Set initial active nav button
  document.getElementById("btn-section1").classList.add("nav-active");

  // Remove preloader with fade-out animation
  if (preloader) {
    preloader.classList.add("fade-out");
    setTimeout(() => preloader.remove(), 500);
  }

  // Initialize features
  initBackToTop(backToTop, rightSection);
  initCardSearch(expSearchInput, projSearchInput, experiences,
    projects, expContainer, projContainer);
  initContentSearch(
    { searchContainer, searchIcon, searchBox, contentDiv, matchCounter });
  initNav(rightSection);
  initFadeIn();
  initScroll(rightSection);
  initSpotlight();
  initSpotlightEffect();
  setupTimelineToggle(toggleBtn, timelineContainer, window.timelineData);
});
