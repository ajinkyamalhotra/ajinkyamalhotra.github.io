import { createTypewriter } from "@features/hero/typewriter.js";
import { escapeHtml } from "@shared/utils/text.js";

function renderCtaButton(action) {
  if (action.kind === "anchor") {
    return `<a class="btn ${action.label.includes("Read") ? "btn--primary" : "btn--ghost"}" href="${escapeHtml(action.target)}" data-nav>${escapeHtml(action.label)}</a>`;
  }

  return `<button class="btn btn--ghost" type="button" data-hero-action="${escapeHtml(action.action)}">${escapeHtml(action.label)}</button>`;
}

function renderProofCard(item) {
  return `
    <article class="stat statProof">
      <div class="statProof__top">
        <div class="stat__value">${escapeHtml(item.value)}</div>
        <div class="stat__label">${escapeHtml(item.label)}</div>
      </div>
      <div class="statProof__meta"><strong>Baseline:</strong> ${escapeHtml(item.baseline)}</div>
      <div class="statProof__meta"><strong>Current:</strong> ${escapeHtml(item.current)}</div>
      <div class="statProof__meta"><strong>Window:</strong> ${escapeHtml(item.window)}</div>
      <div class="statProof__meta"><strong>Method:</strong> ${escapeHtml(item.method)}</div>
    </article>
  `;
}

export function createHeroFeature({ content, onAction }) {
  const profile = content.profile;

  function render() {
    const thesis = document.getElementById("heroThesis");
    const summary = document.getElementById("heroSummary");
    const scopeHost = document.getElementById("heroScope");
    const chipsHost = document.getElementById("heroChips");
    const ctaHost = document.getElementById("heroCtaList");
    const statHost = document.getElementById("quickStats");

    if (thesis) {
      thesis.textContent = profile.leadershipThesis;
    }

    if (summary) {
      summary.textContent = profile.summary;
    }

    if (scopeHost) {
      scopeHost.innerHTML = profile.scopeChips
        .map((chip) => `<span class="chip chip--scope">${escapeHtml(chip)}</span>`)
        .join("");
    }

    if (chipsHost) {
      chipsHost.innerHTML = profile.focusChips
        .map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`)
        .join("");
    }

    if (ctaHost) {
      ctaHost.innerHTML = content.hero.cta.map(renderCtaButton).join("");
      ctaHost.querySelectorAll("[data-hero-action]").forEach((node) => {
        node.addEventListener("click", () => {
          const actionId = node.getAttribute("data-hero-action");
          onAction?.(actionId);
        });
      });
    }

    if (statHost) {
      statHost.innerHTML = content.overviewProofs.slice(0, 3).map(renderProofCard).join("");
    }

    const typewriterHost = document.getElementById("typewriter");
    const typewriter = createTypewriter({
      host: typewriterHost,
      lines: profile.taglines,
    });
    typewriter.start();
  }

  return {
    render,
  };
}
