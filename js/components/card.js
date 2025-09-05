import { renderExperiences, renderProjects } from "../render/render.js";
import {
  logAction
} from "../logger.js";


// Reusable SVG icon component (for the arrow)
const arrowIcon = `
  <svg class="w-5 h-5 text-gray-300 transition-transform transform rotate-45 group-hover:rotate-[-45deg]"
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
`;

// Returns an icon markup string based on the card type
function getMarkerIcon(type) {
  const icons = {
    experience: '<i class="fas fa-briefcase"></i>',
    project: '<i class="fas fa-code"></i>',
    education: '<i class="fas fa-graduation-cap"></i>'
  };
  return icons[type] || "";
}

// Tiny favicon helper for schools (optional override with item.logoUrl)
function schoolIcon(link = "", size = 128) {
  try {
    const u = new URL(link);
    const host = u.hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`;
  } catch {
    return "";
  }
}

// Reusable function for cards with detailed content
function renderDetailedCard(item) {
  const markerIcon = getMarkerIcon(item.type);

  // Conditional education logo support
  const isEducation = item.type === "education";
  const logoSrc = item.logoUrl || (isEducation ? schoolIcon(item.link) : "");
  const logoImg = logoSrc
    ? `<img src="${logoSrc}" alt="" class="w-10 h-10 rounded-sm opacity-90 shrink-0" loading="lazy">`
    : "";

  return `
    <a href="${item.link}" target="_blank" class="card group block relative">
      ${markerIcon ? `
        <div class="absolute top-2 right-2">
          <span class="text-white text-xs uppercase px-2 py-1 rounded">
            ${markerIcon}
          </span>
        </div>
      ` : ""}
      <div class="flex flex-col md:flex-row gap-1 items-start md:items-center">
        <div class="text-gray-300 font-semibold w-full md:w-1/4">
          ${item.period || ""}
        </div>
        <div class="w-full md:w-3/4">
          <h3 class="text-lg font-bold text-gray-300 flex items-center gap-1">
            ${logoImg}
            ${item.title}
            ${arrowIcon}
          </h3>
          <p class="text-gray-400 mt-3" style="text-align: justify;">
            ${item.description || ""}
          </p>
          <div class="flex flex-wrap gap-1 mt-5">
            ${(item.tags || []).map(tag => `
              <span class="tag-pill px-3 py-1 rounded-full text-xs font-medium">
                ${tag}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </a>
  `;
}

function renderCompanyCard(item) {
  const markerIcon = getMarkerIcon("experience");

  const roles = item.roles || [];
  const rolesHtml = roles.map((r, idx) => {
    // Newest → Oldest array: show Promotion for all except the last (first job)
    const showPromotion = idx < roles.length - 1;
    const promotionBadge = showPromotion ? `
      <span class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                   bg-green-500/10 border border-green-500/20 text-green-400
                   text-[11px] font-medium">
        Promoted
      </span>
    ` : "";

    const verticalDivder = showPromotion ? `
      <hr class="my-4 border-t border-white/10" />
    ` : "";

    return `
      <li class="relative pl-3">
        <span class="absolute left-0 top-2 w-2 h-2 rounded-full bg-current/60"></span>
        <div class="flex flex-wrap items-baseline gap-x-2">
          <span class="text-lg font-bold text-gray-300 flex items-center gap-1">${r.title}</span>
          <span class="text-sm text-gray-300">${r.period || ""} ${promotionBadge} </span>
        </div>
        ${r.description ? `
          <p class="text-gray-400 mt-3" style="text-align: justify;">
            ${r.description}
          </p>
        ` : ""}
      </li>
      ${verticalDivder}
    `;
  }).join("");

  // Tiny favicon helper (optional)
  function companyIcon(link = "") {
    try {
      const u = new URL(link);
      const host = u.hostname.replace(/^www\./, "");
      return `<img src="https://www.google.com/s2/favicons?domain=${host}&sz=64" 
                   alt=""
                   class="w-11 h-11 rounded-sm opacity-90"
                   loading="lazy">`;
    } catch {
      return "";
    }
  }

  return `<a href="${item.link}" target="_blank" class="card group block relative">
      ${markerIcon ? `
        <div class="absolute top-2 right-2">
          <span class="text-white text-xs uppercase px-2 py-1 rounded">
            ${markerIcon}
          </span>
        </div>
      ` : ""}
      <div>
          <!-- Header row -->
          <div class="flex items-start md:items-center gap-3">
            ${companyIcon(item.link)}
            <div class="min-w-0">
              <h3 class="text-lg font-bold text-gray-300 flex items-center gap-1">
                ${item.title}
                ${arrowIcon}
              </h3>
              <div class="text-sm text-gray-300">${item.period || ""}</div>
            </div>
          </div>
          <!-- Roles -->
          <ul class="mt-4 space-y-4">
            ${rolesHtml}
          </ul>
          <!-- Tags -->
          <div class="flex flex-wrap gap-1 mt-5">
            ${(item.tags || []).map(tag => `
              <span class="tag-pill px-3 py-1 rounded-full text-xs font-medium">
                ${tag}
              </span>
            `).join('')}
          </div>
        </div>
    </a>`
}

// Main function to create a card. It now supports "experience", "project", and "education" types.
export function createCard(item) {
  if (item.type === "experience-company") {
    return renderCompanyCard(item);
  }
  // existing fallback for everything else
  return renderDetailedCard(item);
}


export function initCardSearch(expSearchInput, projSearchInput, experiences,
  projects, expContainer, projContainer) {
  logAction(`${initCardSearch.name}()`, () => {
    // Experience card filtering
    expSearchInput.addEventListener("input", function (e) {
      const query = (e.target.value || "").trim().toLowerCase();
      if (!query) {
        // Empty query → show everything
        renderExperiences(expContainer, experiences);
        return;
      }

      const filteredExperiences = experiences.filter(exp => {
        if (exp.type !== "experience-company") return false;

        // Company-level fields
        const companyTitle = (exp.title || "").toLowerCase();
        const companyPeriod = (exp.period || "").toLowerCase();
        const companyTags = Array.isArray(exp.tags) ? exp.tags.map(t => (t || "").toLowerCase()) : [];

        // Role-level fields
        const roles = Array.isArray(exp.roles) ? exp.roles : [];
        const roleTitles = roles.map(r => (r.title || "").toLowerCase());
        const rolePeriods = roles.map(r => (r.period || "").toLowerCase());
        const roleDescriptions = roles.map(r => (r.description || "").toLowerCase());
        const roleTags = roles.flatMap(r =>
          Array.isArray(r.tags) ? r.tags.map(t => (t || "").toLowerCase()) : []
        );

        // Create a single haystack for simple .includes
        const haystackParts = [
          companyTitle,
          companyPeriod,
          ...companyTags,
          ...roleTitles,
          ...rolePeriods,
          ...roleDescriptions,
          ...roleTags
        ];

        const haystack = haystackParts.join(" • ");
        return haystack.includes(query);
      });

      renderExperiences(expContainer, filteredExperiences);
    });

    // Project card filtering
    projSearchInput.addEventListener("input", function (e) {
      const query = e.target.value.toLowerCase();
      const filteredProjects = projects.filter(proj =>
        proj.title.toLowerCase().includes(query) ||
        proj.description.toLowerCase().includes(query) ||
        (proj.tags && proj.tags.some(
          tag => tag.toLowerCase().includes(query)))
      );
      // Call render function with the container and filtered data
      renderProjects(projContainer, filteredProjects);
    });
  });
}