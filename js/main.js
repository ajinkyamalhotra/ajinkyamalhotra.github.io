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
                xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </h3>
            <p class="text-gray-400 mt-3">
              ${item.description}
            </p>
            <div class="flex flex-wrap gap-2 mt-5">
              ${item.tags.map(function (tag) {
      return `<span class="bg-teal-400/10 text-teal-300 
                        px-3 py-1 rounded-full text-xs font-medium">
                        ${tag}</span>`;
    }).join('')}
            </div>
          </div>
        </div>
      </a>
    `;
  } else if (item.type === "resume") {
    return `
      <a href="${item.link}" target="_blank" class="card group block">
        <div class="flex gap-4 items-center">
          <h3 class="text-medium font-bold text-gray-300 flex items-center 
              gap-2">
            ${item.title}
            <svg class="w-5 h-5 text-gray-300 transition-transform 
              transform rotate-45 group-hover:rotate-[-45deg]"
              xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
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
              xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </h3>
          <p class="text-gray-400 mt-3">
            ${item.description}
          </p>
          <div class="flex flex-wrap gap-2 mt-5">
            ${item.tags.map(function (tag) {
    return `<span class="bg-teal-400/10 text-teal-300 
                      px-3 py-1 rounded-full text-xs font-medium">
                      ${tag}</span>`;
  }).join('')}
          </div>
        </div>
      </div>
    </a>
  `;
}

/* Populate DOM on content loaded */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("siteName").textContent = siteData.name;
  document.getElementById("jobTitle").textContent = siteData.jobTitle;
  document.getElementById("tagline").textContent = siteData.tagline;
  var aboutEl = document.getElementById("aboutContent");
  siteData.about.forEach(function (paragraph) {
    aboutEl.innerHTML += `<p class="mb-4">${paragraph}</p>`;
  });
  document.getElementById("socialContainer").innerHTML = `
    <a href="${siteData.socialLinks.github}" target="_blank">
      <i class="fab fa-github"></i></a>
    <a href="${siteData.socialLinks.linkedin}" target="_blank">
      <i class="fab fa-linkedin"></i></a>
    <a href="${siteData.socialLinks.email}">
      <i class="fas fa-envelope"></i></a>
  `;
  var expContainer = document.getElementById("experienceContainer");
  experiences.forEach(function (item) {
    expContainer.insertAdjacentHTML("beforeend", createCard(item));
  });
  var projContainer = document.getElementById("projectsContainer");
  projects.forEach(function (item) {
    projContainer.insertAdjacentHTML(
      "beforeend",
      createProjectCard(item)
    );
  });
  document.getElementById("btn-section1")
    .classList.add("nav-active");
});

/* Smooth scrolling on nav button click */
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
  updateActiveNav(id);
}

function updateActiveNav(activeId) {
  var navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach(function (btn) {
    btn.classList.remove("nav-active");
  });
  document.getElementById("btn-" + activeId)
    .classList.add("nav-active");
}

/* Update nav active state on document scroll */
document.addEventListener("scroll", function () {
  var sections = document.querySelectorAll(".fade-in");
  var navButtons = document.querySelectorAll(".nav-button");
  sections.forEach(function (section, index) {
    var rect = section.getBoundingClientRect();
    if (rect.top >= 0 &&
      rect.top <= window.innerHeight / 2) {
      navButtons.forEach(function (btn) {
        btn.classList.remove("nav-active");
      });
      navButtons[index].classList.add("nav-active");
    }
  });
});

/* Update nav active state on rightSection scroll */
function updateNavActiveOnScroll() {
  var sections = document.querySelectorAll(".fade-in");
  var navButtons = document.querySelectorAll(".nav-button");
  var closestSectionIndex = 0;
  var minDistance = Infinity;
  var containerRect = rightSection.getBoundingClientRect();
  var scrollBottom = rightSection.scrollTop +
    rightSection.clientHeight;
  var scrollHeight = rightSection.scrollHeight;
  if (scrollBottom >= scrollHeight - 5) {
    navButtons.forEach(function (btn) {
      btn.classList.remove("nav-active");
    });
    navButtons[sections.length - 1].classList.add("nav-active");
    return;
  }
  sections.forEach(function (section, index) {
    var rect = section.getBoundingClientRect();
    var distance = Math.abs(rect.top - containerRect.top);
    if (distance < minDistance) {
      minDistance = distance;
      closestSectionIndex = index;
    }
  });
  navButtons.forEach(function (btn) {
    btn.classList.remove("nav-active");
  });
  navButtons[closestSectionIndex].classList.add("nav-active");
}

/* Throttle rightSection scroll updates */
var ticking = false;
var rightSection = document.getElementById("rightSection");
rightSection.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      updateNavActiveOnScroll();
      ticking = false;
    });
    ticking = true;
  }
});

/* Fade-in animation using IntersectionObserver */
var fadeElements = document.querySelectorAll(".fade-in");
var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);
fadeElements.forEach(function (element) {
  observer.observe(element);
});

/* Spotlight effect */
document.addEventListener("mousemove", function (e) {
  var spotlight = document.getElementById("spotlight");
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top = e.clientY + "px";
});

/* Smooth scrolling for rightSection on wheel events */
window.addEventListener("wheel", function (event) {
  var scrollSpeed = 4;
  rightSection.scrollBy({
    top: event.deltaY * scrollSpeed,
    behavior: "smooth"
  });
});
