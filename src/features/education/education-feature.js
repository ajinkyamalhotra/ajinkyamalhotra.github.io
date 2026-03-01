import { escapeHtml } from "@shared/utils/text.js";

export function createEducationFeature({ educationEntries }) {
  function render() {
    const host = document.getElementById("educationGrid");
    if (!host) {
      return;
    }

    host.innerHTML = educationEntries
      .map(
        (entry) => `
          <article class="edu reveal">
            <div class="edu__top">
              <div class="edu__title">${escapeHtml(entry.degree)}</div>
              <div class="edu__period">${escapeHtml(entry.period)}</div>
            </div>
            <div class="edu__meta">
              <div><strong>${escapeHtml(entry.school)}</strong></div>
              <div class="muted mono" style="margin-top:6px;">${escapeHtml(entry.meta)}</div>
              <div style="margin-top:10px;">Coursework:</div>
              <div class="edu__chips">
                ${(entry.coursework || []).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
              </div>
            </div>
          </article>
        `,
      )
      .join("");
  }

  return { render };
}
