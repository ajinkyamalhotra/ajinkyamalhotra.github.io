// js/main.js

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

/* Populate DOM on content loaded */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("siteName").textContent = siteData.name;
  document.getElementById("jobTitle").textContent = siteData.jobTitle;
  document.getElementById("tagline").textContent = siteData.tagline;

  const aboutEl = document.getElementById("aboutContent");
  const frag = document.createDocumentFragment();
  siteData.about.forEach(paragraph => {
    const p = document.createElement("p");
    p.className = "mb-4";
    p.textContent = paragraph;
    frag.appendChild(p);
  });
  aboutEl.appendChild(frag);

  document.getElementById("socialContainer").innerHTML = `
    <a href="${siteData.socialLinks.github}" target="_blank" 
       aria-label="GitHub">
      <i class="fab fa-github"></i>
    </a>
    <a href="${siteData.socialLinks.linkedin}" target="_blank" 
       aria-label="LinkedIn">
      <i class="fab fa-linkedin"></i>
    </a>
    <a href="${siteData.socialLinks.email}" aria-label="Email">
      <i class="fas fa-envelope"></i>
    </a>
  `;

  const expContainer = document.getElementById("experienceContainer");
  experiences.forEach(item => {
    expContainer.insertAdjacentHTML("beforeend", createCard(item));
  });

  const projContainer = document.getElementById("projectsContainer");
  projects.forEach(item => {
    projContainer.insertAdjacentHTML("beforeend", createProjectCard(item));
  });

  document.getElementById("btn-section1")
    .classList.add("nav-active");

  // Remove preloader with fade-out animation
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
    setTimeout(() => preloader.remove(), 500);
  }

  // Back-to-Top Button functionality
  const backToTop = document.getElementById("backToTop");
  const rightSection = document.getElementById("rightSection");
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

  // Initialize fancy theme toggle switch
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
  }
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  });

  // For mobile devices, attach a pointerup event to the toggle's label
  // This ensures that a tap reliably toggles the checkbox state.
  if ("ontouchstart" in window || navigator.maxTouchPoints) {
    const toggleLabel = themeToggle.parentElement; // Assuming the label wraps the checkbox
    toggleLabel.addEventListener("pointerup", (e) => {
      // Prevent the default to avoid potential double-tap issues
      e.preventDefault();
      e.stopPropagation();
      // Manually toggle the checkbox
      themeToggle.checked = !themeToggle.checked;
      // Dispatch the change event so the theme updates
      themeToggle.dispatchEvent(new Event("change"));
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

function updateActiveNav(activeId) {
  const navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach(btn => btn.classList.remove("nav-active"));
  document.getElementById("btn-" + activeId)
    .classList.add("nav-active");
}

/* Update nav active state on document scroll */
document.addEventListener("scroll", () => {
  const sections = document.querySelectorAll(".fade-in");
  const navButtons = document.querySelectorAll(".nav-button");
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
      navButtons.forEach(btn => btn.classList.remove("nav-active"));
      navButtons[index].classList.add("nav-active");
    }
  });
});

/* Update nav active state on rightSection scroll */
function updateNavActiveOnScroll() {
  const sections = document.querySelectorAll(".fade-in");
  const navButtons = document.querySelectorAll(".nav-button");
  let closestSectionIndex = 0;
  let minDistance = Infinity;
  const containerRect = rightSection.getBoundingClientRect();
  const scrollBottom = rightSection.scrollTop +
    rightSection.clientHeight;
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

/* Throttle rightSection scroll updates */
let ticking = false;
const rightSection = document.getElementById("rightSection");
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
