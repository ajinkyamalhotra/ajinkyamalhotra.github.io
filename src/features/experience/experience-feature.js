import { debounce } from "@shared/utils/async.js";
import { escapeHtml, normalize } from "@shared/utils/text.js";

function renderCompanyCard(entry) {
  const roles = entry.roles
    .map(
      (role) => `
        <article class="role">
          <div class="role__head">
            <div class="role__title">${escapeHtml(role.title)}</div>
            <div class="role__period">${escapeHtml(role.period)}</div>
          </div>
          <ul class="role__bullets">${(role.bullets || []).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
        </article>
      `,
    )
    .join("");

  const tags = (entry.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  const company = entry.link
    ? `<a href="${escapeHtml(entry.link)}" target="_blank" rel="noreferrer" class="xp__company">${escapeHtml(entry.company)}</a>`
    : `<div class="xp__company">${escapeHtml(entry.company)}</div>`;

  return `
    <article class="xp reveal">
      <div class="xp__top">
        ${company}
        <div class="xp__period">${escapeHtml(entry.period)} | ${escapeHtml(entry.location)}</div>
      </div>
      <div class="xp__roles">${roles}</div>
      ${tags ? `<div class="tags xp__tags">${tags}</div>` : ""}
    </article>
  `;
}

function matchesQuery(entry, query) {
  if (!query) {
    return true;
  }

  const blob = normalize(
    [
      entry.company,
      entry.location,
      entry.period,
      ...(entry.tags || []),
      ...entry.roles.flatMap((role) => [role.title, role.period, ...(role.bullets || [])]),
    ].join(" "),
  );

  return blob.includes(normalize(query));
}

export function createExperienceFeature({ experienceContent, reveal }) {
  const searchInput = document.getElementById("experienceSearch");
  const timelineButton = document.getElementById("expViewTimeline");
  const cardsButton = document.getElementById("expViewCards");
  const container = document.getElementById("experienceContainer");

  let currentView = "timeline";
  let currentQuery = "";

  function setView(viewMode) {
    currentView = viewMode;
    timelineButton?.classList.toggle("seg__btn--active", viewMode === "timeline");
    cardsButton?.classList.toggle("seg__btn--active", viewMode === "cards");
    render();
  }

  function readMatchedRecords() {
    return experienceContent.records.filter((entry) => matchesQuery(entry, currentQuery));
  }

  function render() {
    if (!container) {
      return;
    }

    const records = readMatchedRecords();
    const wrapperClass = currentView === "timeline" ? "timeline" : "cards";

    container.innerHTML = `
      <div class="${wrapperClass}">
        ${records.map(renderCompanyCard).join("")}
      </div>
    `;

    reveal.observe(container);
  }

  function syncSearchPlaceholder() {
    if (!searchInput) {
      return;
    }

    const compact = window.innerWidth <= 620;
    searchInput.setAttribute(
      "placeholder",
      compact ? experienceContent.searchPlaceholderCompact : experienceContent.searchPlaceholder,
    );
  }

  function init() {
    render();
    syncSearchPlaceholder();

    searchInput?.addEventListener(
      "input",
      debounce(() => {
        currentQuery = searchInput.value;
        render();
      }, 120),
    );

    timelineButton?.addEventListener("click", () => setView("timeline"));
    cardsButton?.addEventListener("click", () => setView("cards"));

    window.addEventListener("resize", debounce(syncSearchPlaceholder, 150), { passive: true });
  }

  return {
    init,
    render,
    setView,
  };
}
