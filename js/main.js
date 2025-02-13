/* 
 * Main JavaScript File for Ajinkya Malhotra Portfolio
 */

/* Helper functions to create HTML cards */
function createCard(item) {
  if (item.type === "experience") {
    return `
<a href="${item.link}" target="_blank" class="card group block">
  <div class="flex gap-4 items-center">
    <div class="text-gray-300 font-semibold w-1/4">
      ${item.period}
    </div>
    <div class="w-3/4">
      <h3 class="text-lg font-bold text-gray-300 flex items-center gap-2">
        ${item.title}
        <svg class="w-5 h-5 text-gray-300 transition-transform 
transform rotate-45 group-hover:rotate-[-45deg]"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" 
                stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </h3>
      <p class="text-gray-400 mt-3">
        ${item.description}
      </p>
      <div class="flex flex-wrap gap-2 mt-5">
        ${item.tags.map(tag =>
      `<span class="bg-teal-400/10 text-teal-300 px-3 py-1 rounded-full 
text-xs font-medium">
  ${tag}
</span>`
    ).join('')}
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
      <svg class="w-5 h-5 text-gray-300 transition-transform 
transform rotate-45 group-hover:rotate-[-45deg]"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" 
              stroke-width="2"
          d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
    <div class="text-gray-300 font-semibold w-1/4">
      ${item.period}
    </div>
    <div class="w-3/4">
      <h3 class="text-lg font-bold text-gray-300 flex items-center gap-2">
        ${item.title}
        <svg class="w-5 h-5 text-gray-300 transition-transform 
transform rotate-45 group-hover:rotate-[-45deg]"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" 
                stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </h3>
      <p class="text-gray-400 mt-3">
        ${item.description}
      </p>
      <div class="flex flex-wrap gap-2 mt-5">
        ${item.tags.map(tag =>
    `<span class="bg-teal-400/10 text-teal-300 px-3 py-1 rounded-full 
text-xs font-medium">
  ${tag}
</span>`
  ).join('')}
      </div>
    </div>
  </div>
</a>
`;
}

/* Utility: Debounce function to limit rapid event firing */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* Populate DOM on content loaded */
document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements for performance
  const siteNameEl = document.getElementById("siteName");
  const jobTitleEl = document.getElementById("jobTitle");
  const taglineEl = document.getElementById("tagline");
  const aboutEl = document.getElementById("aboutContent");
  const socialContainerEl = document.getElementById("socialContainer");
  const expContainer = document.getElementById("experienceContainer");
  const projContainer = document.getElementById("projectsContainer");
  const preloader = document.getElementById("preloader");
  const themeToggle = document.getElementById("themeToggle");
  const backToTop = document.getElementById("backToTop");
  const rightSection = document.getElementById("rightSection");

  // Auto-detect system theme if no saved preference exists
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    if (savedTheme === "light") {
      document.body.classList.add("light");
      themeToggle.checked = true;
    } else {
      document.body.classList.remove("light");
      themeToggle.checked = false;
    }
  } else {
    // No saved theme; detect system preference
    const prefersLight = window.matchMedia && window.matchMedia(
      "(prefers-color-scheme: light)").matches;
    if (prefersLight) {
      document.body.classList.add("light");
      themeToggle.checked = true;
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      themeToggle.checked = false;
      localStorage.setItem("theme", "dark");
    }
  }

  // Populate header information
  siteNameEl.textContent = siteData.name;
  jobTitleEl.textContent = siteData.jobTitle;
  taglineEl.textContent = siteData.tagline;

  // Populate about section paragraphs
  const frag = document.createDocumentFragment();
  siteData.about.forEach(paragraph => {
    const p = document.createElement("p");
    p.className = "mb-4";
    p.textContent = paragraph;
    frag.appendChild(p);
  });
  aboutEl.appendChild(frag);

  // Populate social links with improved accessibility
  socialContainerEl.innerHTML = `
    <a href="${siteData.socialLinks.github}" target="_blank" aria-label="GitHub">
      <i class="fab fa-github"></i>
    </a>
    <a href="${siteData.socialLinks.linkedin}" target="_blank" aria-label="LinkedIn">
      <i class="fab fa-linkedin"></i>
    </a>
    <a href="${siteData.socialLinks.email}" aria-label="Email">
      <i class="fas fa-envelope"></i>
    </a>
  `;

  // Render initial experience and project cards
  renderExperiences(experiences);
  renderProjects(projects);

  // Set initial active nav button
  document.getElementById("btn-section1").classList.add("nav-active");

  // Remove preloader with fade-out animation
  if (preloader) {
    preloader.classList.add("fade-out");
    setTimeout(() => preloader.remove(), 500);
  }

  // Back-to-Top Button functionality
  if (window.innerWidth <= 768) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 200) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    rightSection.addEventListener("scroll", () => {
      if (rightSection.scrollTop > 200) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });
    backToTop.addEventListener("click", () => {
      rightSection.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Theme toggle event listener with mobile touch support
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  });

  // Flag to prevent double toggling on mobile
  let touchHandled = false;

  // For mobile devices, attach a touchend event to the toggle's label
  if ("ontouchstart" in window || navigator.maxTouchPoints) {
    const toggleLabel = themeToggle.parentElement;
    toggleLabel.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If we haven't just handled a touch event, toggle the checkbox manually.
      if (!touchHandled) {
        touchHandled = true;
        themeToggle.checked = !themeToggle.checked;
        themeToggle.dispatchEvent(new Event("change"));
        setTimeout(() => { touchHandled = false; }, 500);
      }
    });
  }

  const expSearchInput = document.getElementById("experienceSearch");
  const projSearchInput = document.getElementById("projectSearch");

  expSearchInput.addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase();
    // Filter only experiences (exclude resume type) based on the query
    const filteredExperiences = experiences.filter(exp => {
      if (exp.type !== "experience") return false;
      return (
        exp.title.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        (exp.tags && exp.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });
    // Find the resume card, if any, so it is always appended.
    const resumeCard = experiences.find(exp => exp.type === "resume");
    let finalResults = filteredExperiences;
    if (resumeCard) {
      finalResults.push(resumeCard);
    }
    renderExperiences(finalResults);
  });

  projSearchInput.addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase();
    const filtered = projects.filter(proj =>
      proj.title.toLowerCase().includes(query) ||
      proj.description.toLowerCase().includes(query) ||
      (proj.tags && proj.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    renderProjects(filtered);
  });

  /* Helper functions to re-render cards based on filtered data */
  function renderExperiences(data) {
    expContainer.innerHTML = '';
    data.forEach(item => {
      expContainer.insertAdjacentHTML("beforeend", createCard(item));
    });
  }
  function renderProjects(data) {
    projContainer.innerHTML = '';
    data.forEach(item => {
      projContainer.insertAdjacentHTML("beforeend", createProjectCard(item));
    });
  }

});

/* Smooth scrolling on nav button click */
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
  updateActiveNav(id);
}

/* Update active state for navigation buttons */
function updateActiveNav(activeId) {
  const navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach(btn => btn.classList.remove("nav-active"));
  document.getElementById("btn-" + activeId).classList.add("nav-active");
}

/* Update nav active state on document scroll */
document.addEventListener("scroll", debounce(() => {
  const sections = document.querySelectorAll(".fade-in");
  const navButtons = document.querySelectorAll(".nav-button");
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
      navButtons.forEach(btn => btn.classList.remove("nav-active"));
      navButtons[index].classList.add("nav-active");
    }
  });
}, 100));

/* Update nav active state on rightSection scroll */
function updateNavActiveOnScroll() {
  const sections = document.querySelectorAll(".fade-in");
  const navButtons = document.querySelectorAll(".nav-button");
  let closestSectionIndex = 0;
  let minDistance = Infinity;
  const containerRect = rightSection.getBoundingClientRect();
  const scrollBottom = rightSection.scrollTop + rightSection.clientHeight;
  const scrollHeight = rightSection.scrollHeight;

  if (scrollBottom >= scrollHeight - 5) {
    navButtons.forEach(btn => btn.classList.remove("nav-active"));
    navButtons[sections.length - 1].classList.add("nav-active");
    return;
  }

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top - containerRect.top);
    if (distance < minDistance) {
      minDistance = distance;
      closestSectionIndex = index;
    }
  });

  navButtons.forEach(btn => btn.classList.remove("nav-active"));
  navButtons[closestSectionIndex].classList.add("nav-active");
}

/* Throttle rightSection scroll updates using requestAnimationFrame */
let ticking = false;
rightSection.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateNavActiveOnScroll();
      ticking = false;
    });
    ticking = true;
  }
});

/* Fade-in animation using IntersectionObserver */
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

/* Spotlight effect */
document.addEventListener("mousemove", e => {
  const spotlight = document.getElementById("spotlight");
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top = e.clientY + "px";
});

/* Smooth scrolling for rightSection on wheel events */
window.addEventListener("wheel", event => {
  const scrollSpeed = 4;
  rightSection.scrollBy({
    top: event.deltaY * scrollSpeed,
    behavior: "smooth"
  });
});
