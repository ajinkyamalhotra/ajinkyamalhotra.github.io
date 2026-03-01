import { escapeHtml } from "@shared/utils/text.js";

export function createImpactFeature({ metrics }) {
  function render() {
    const host = document.getElementById("impactGrid");
    if (!host) {
      return;
    }

    host.innerHTML = metrics
      .map(
        (entry) => `
          <article class="impact reveal">
            <div class="impact__value">${escapeHtml(entry.value)}</div>
            <div class="impact__label">${escapeHtml(entry.label)}</div>
            <div class="impact__desc">${escapeHtml(entry.desc)}</div>
            <div class="impact__meta">
              ${(entry.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </article>
        `,
      )
      .join("");
  }

  return { render };
}
