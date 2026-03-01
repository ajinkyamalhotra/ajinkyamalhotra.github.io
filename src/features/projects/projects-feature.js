import { debounce } from "@shared/utils/async.js";
import { escapeHtml, normalize } from "@shared/utils/text.js";

function buildTopTags(projects) {
  const counts = projects.reduce((bucket, project) => {
    (project.tags || []).forEach((tag) => {
      bucket[tag] = (bucket[tag] || 0) + 1;
    });
    return bucket;
  }, {});

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 12)
    .map(([tag]) => tag);
}

function matches(project, query, activeTag) {
  const tagMatches = activeTag === "All" || (project.tags || []).includes(activeTag);
  if (!tagMatches) {
    return false;
  }

  if (!query) {
    return true;
  }

  const blob = normalize([project.title, project.desc, ...(project.tags || [])].join(" "));
  return blob.includes(normalize(query));
}

function card(project, index) {
  return `
    <article class="project reveal" role="button" tabindex="0" data-project-index="${index}">
      <div class="project__top">
        <div class="project__title">${escapeHtml(project.title)}</div>
        <div class="project__period">${escapeHtml(project.period || "")}</div>
      </div>
      <div class="project__desc">${escapeHtml(project.desc || "")}</div>
      <div class="project__tags">${(project.tags || [])
        .slice(0, 4)
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("")}</div>
    </article>
  `;
}

export function createProjectsFeature({ projects, reveal, onProjectOpen }) {
  const grid = document.getElementById("projectsGrid");
  const searchInput = document.getElementById("projectSearch");
  const filtersHost = document.getElementById("projectFilters");

  const topTags = buildTopTags(projects);

  let activeFilter = "All";
  let query = "";
  let currentRenderSet = projects;

  function renderFilters() {
    if (!filtersHost) {
      return;
    }

    const labels = ["All", ...topTags];

    filtersHost.innerHTML = labels
      .map((label) => {
        const className = label === activeFilter ? "chip chip--active" : "chip";
        return `<button class="${className}" type="button" data-project-filter="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
      })
      .join("");

    filtersHost.querySelectorAll("[data-project-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.getAttribute("data-project-filter") || "All";
        renderFilters();
        render();
      });
    });
  }

  function render() {
    if (!grid) {
      return;
    }

    currentRenderSet = projects.filter((project) => matches(project, query, activeFilter));
    grid.innerHTML = currentRenderSet.map(card).join("");

    reveal.observe(grid);

    grid.querySelectorAll("[data-project-index]").forEach((node) => {
      node.addEventListener("click", () => {
        const index = Number(node.getAttribute("data-project-index"));
        const project = currentRenderSet[index];
        if (project) {
          onProjectOpen?.(project);
        }
      });
    });
  }

  function init() {
    renderFilters();
    render();

    searchInput?.addEventListener(
      "input",
      debounce(() => {
        query = searchInput.value;
        render();
      }, 100),
    );

    grid?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
      }

      const cardNode = event.target.closest("[data-project-index]");
      cardNode?.click();
    });
  }

  return {
    init,
    render,
    setFilter(value) {
      activeFilter = value;
      renderFilters();
      render();
    },
  };
}
