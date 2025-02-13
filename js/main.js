// js/main.js

// Helper functions to create HTML cards for experiences and projects
function createCard(item) {
  if (item.type === "experience") {
    return `
      <a href="${item.link}" target="_blank" class="card group block">
        <div class="flex gap-4 items-center">
          <div class="text-gray-300 font-semibold w-1/4">${item.period}</div>
          <div class="w-3/4">
            <h3 class="text-lg font-bold text-gray-300 flex items-center gap-2">
              ${item.title}
              <svg class="w-5 h-5 text-gray-300 transition-transform transform rotate-45 group-hover:rotate-[-45deg]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </h3>
            <p class="text-gray-400 mt-3">${item.description}</p>
            <div class="flex flex-wrap gap-2 mt-5">
              ${item.tags.map(tag => `<span class="bg-teal-400/10 text-teal-300 px-3 py-1 rounded-full text-xs font-medium">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      </a>
    `;
  } else if (item.type === "resume") {
    return `
      <a href="${item.link}" target="_blank" class="card group block">
        <div class="flex gap-4 items-center">
          <h3 class="text-medium font-bold text-gray-300 flex items-center gap-2">
            ${item.title}
            <svg class="w-5 h-5 text-gray-300 transition-transform transform rotate-45 group-hover:rotate-[-45deg]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </h3>
        </div>
      </a>
    `;
  }
}

function createProjectCard(item) {
  return `
    <a href="${item.link}" target="_blank" class="card group block">
      <div class="flex gap-4 items-center">
        <div class="text-gray-300 font-semibold w-1/4">${item.period}</div>
        <div class="w-3/4">
          <h3 class="text-lg font-bold text-gray-300 flex items-center gap-2">
            ${item.title}
            <svg class="w-5 h-5 text-gray-300 transition-transform transform rotate-45 group-hover:rotate-[-45deg]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </h3>
          <p class="text-gray-400 mt-3">${item.description}</p>
          <div class="flex flex-wrap gap-2 mt-5">
            ${item.tags.map(tag => `<span class="bg-teal-400/10 text-teal-300 px-3 py-1 rounded-full text-xs font-medium">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    </a>
  `;
}

// When DOM is loaded, populate personal details, about content, and cards
document.addEventListener("DOMContentLoaded", () => {
  // Populate personal info from siteData
  document.getElementById("siteName").textContent = siteData.name;
  document.getElementById("jobTitle").textContent = siteData.jobTitle;
  document.getElementById("tagline").textContent = siteData.tagline;

  // Populate about section with separate paragraphs
  const aboutContentEl = document.getElementById("aboutContent");
  siteData.about.forEach(paragraph => {
    aboutContentEl.innerHTML += `<p class="mb-4">${paragraph}</p>`;
  });

  // Populate social links
  document.getElementById("socialContainer").innerHTML = `
    <a href="${siteData.socialLinks.github}" target="_blank"><i class="fab fa-github"></i></a>
    <a href="${siteData.socialLinks.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
    <a href="${siteData.socialLinks.email}"><i class="fas fa-envelope"></i></a>
  `;

  // Populate Experiences
  const experienceContainer = document.getElementById("experienceContainer");
  experiences.forEach(item => {
    experienceContainer.insertAdjacentHTML("beforeend", createCard(item));
  });

  // Populate Projects
  const projectsContainer = document.getElementById("projectsContainer");
  projects.forEach(item => {
    projectsContainer.insertAdjacentHTML("beforeend", createProjectCard(item));
  });

  // Ensure Section 1 is active on load
  document.getElementById("btn-section1").classList.add("nav-active");
});

// Navigation and scroll handling functions remain unchanged
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  updateActiveNav(id);
}

function updateActiveNav(activeId) {
  let navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach(btn => btn.classList.remove("nav-active"));
  document.getElementById("btn-" + activeId).classList.add("nav-active");
}

// Highlight active navbar item on document scroll
document.addEventListener("scroll", () => {
  let sections = document.querySelectorAll(".fade-in");
  let navButtons = document.querySelectorAll(".nav-button");
  sections.forEach((section, index) => {
    let rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
      navButtons.forEach(btn => btn.classList.remove("nav-active"));
      navButtons[index].classList.add("nav-active");
    }
  });
});

// Fade-in animation using IntersectionObserver
const fadeElements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);
fadeElements.forEach(element => observer.observe(element));

// Spotlight follow effect
document.addEventListener("mousemove", e => {
  const spotlight = document.getElementById("spotlight");
  spotlight.style.left = `${e.clientX}px`;
  spotlight.style.top = `${e.clientY}px`;
});

// Smooth scrolling for the right section on wheel events
const rightSection = document.getElementById("rightSection");
window.addEventListener("wheel", function (event) {
  const scrollSpeed = 4;
  rightSection.scrollBy({
    top: event.deltaY * scrollSpeed,
    behavior: "smooth"
  });
});

// Update nav active based on scrolling within the right section
rightSection.addEventListener("scroll", () => {
  let sections = document.querySelectorAll(".fade-in");
  let navButtons = document.querySelectorAll(".nav-button");
  let closestSectionIndex = 0;
  let minDistance = Infinity;
  const containerRect = rightSection.getBoundingClientRect();
  const scrollBottom = rightSection.scrollTop + rightSection.clientHeight;
  const scrollHeight = rightSection.scrollHeight;

  // If scrolled to the bottom, activate the last nav button
  if (scrollBottom >= scrollHeight - 5) {
    navButtons.forEach(btn => btn.classList.remove("nav-active"));
    navButtons[sections.length - 1].classList.add("nav-active");
    return;
  }

  // Find section closest to the top of the container
  sections.forEach((section, index) => {
    let rect = section.getBoundingClientRect();
    let distance = Math.abs(rect.top - containerRect.top);
    if (distance < minDistance) {
      minDistance = distance;
      closestSectionIndex = index;
    }
  });
  navButtons.forEach(btn => btn.classList.remove("nav-active"));
  navButtons[closestSectionIndex].classList.add("nav-active");
});
