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

// Reusable function for cards with detailed content
function renderDetailedCard(item) {
  const markerIcon = getMarkerIcon(item.type);
  return `
    <a href="${item.link}" target="_blank" class="card group block relative">
      ${markerIcon ? `
        <div class="absolute top-2 right-2">
          <span class="bg-gray-700 text-white text-xs uppercase px-2 py-1 rounded">
            ${markerIcon}
          </span>
        </div>
      ` : ""}
      <div class="flex gap-4 items-center">
        <div class="text-gray-300 font-semibold w-1/4">
          ${item.period || ""}
        </div>
        <div class="w-3/4">
          <h3 class="text-lg font-bold text-gray-300 flex items-center gap-2">
            ${item.title}
            ${arrowIcon}
          </h3>
          <p class="text-gray-400 mt-3">
            ${item.description || ""}
          </p>
          <div class="flex flex-wrap gap-2 mt-5">
            ${(item.tags || []).map(tag => `
              <span class="bg-teal-400/10 text-teal-300 px-3 py-1 rounded-full text-xs font-medium">
                ${tag}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </a>
  `;
}

// Main function to create a card. It now supports "experience", "project", and "education" types.
export function createCard(item) {
  return renderDetailedCard(item);
}
