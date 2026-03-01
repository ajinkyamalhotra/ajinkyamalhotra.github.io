import { escapeHtml } from "@shared/utils/text.js";

function list(items = []) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function createStaffFeature({ staffData }) {
  function renderCaseStudies() {
    const host = document.getElementById("caseStudiesGrid");
    if (!host) {
      return;
    }

    host.innerHTML = staffData.caseStudies
      .map(
        (study) => `
          <article class="caseStudy reveal">
            <div class="caseStudy__top">
              <div class="caseStudy__title">${escapeHtml(study.title)}</div>
              <div class="caseStudy__period">${escapeHtml(study.period)}</div>
            </div>
            <div class="caseStudy__meta">${escapeHtml(study.scope)} | ${escapeHtml(study.role)}</div>
            <div class="caseStudy__section"><strong>Problem:</strong> ${escapeHtml(study.problem)}</div>
            <div class="caseStudy__section"><strong>Constraints:</strong>${list(study.constraints)}</div>
            <div class="caseStudy__section"><strong>Architecture:</strong>${list(study.architecture)}</div>
            <div class="caseStudy__section"><strong>Tradeoffs:</strong>${list(study.tradeoffs)}</div>
            <div class="caseStudy__section"><strong>Outcomes:</strong>${list(study.outcomes)}</div>
            <div class="caseStudy__tags">${(study.stack || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
          </article>
        `,
      )
      .join("");
  }

  function renderDecisionArtifacts() {
    const host = document.getElementById("decisionArtifactsGrid");
    if (!host) {
      return;
    }

    host.innerHTML = staffData.decisionArtifacts
      .map(
        (artifact) => `
          <article class="artifact reveal">
            <div class="artifact__head">
              <span class="artifact__type mono">${escapeHtml(artifact.type)}</span>
              <span class="badge">${escapeHtml(artifact.type.toUpperCase())}</span>
            </div>
            <div class="artifact__title">${escapeHtml(artifact.title)}</div>
            <div class="artifact__row"><strong>Context:</strong> ${escapeHtml(artifact.context)}</div>
            <div class="artifact__row"><strong>Decision:</strong> ${escapeHtml(artifact.decision)}</div>
            <div class="artifact__row"><strong>Alternatives:</strong>${list(artifact.alternatives)}</div>
            <div class="artifact__row"><strong>Result:</strong> ${escapeHtml(artifact.result)}</div>
          </article>
        `,
      )
      .join("");
  }

  function renderSystemsTimeline() {
    const host = document.getElementById("systemsTimeline");
    if (!host) {
      return;
    }

    host.innerHTML = staffData.systemsTimeline
      .map(
        (phase) => `
          <article class="systemPhase reveal">
            <div class="systemPhase__top">
              <div class="systemPhase__name">${escapeHtml(phase.phase)}</div>
              <div class="systemPhase__period">${escapeHtml(phase.period)}</div>
            </div>
            <div class="systemPhase__theme">${escapeHtml(phase.theme)}</div>
            <ul class="systemPhase__list">${(phase.details || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
        `,
      )
      .join("");
  }

  function renderTestStrategy() {
    const host = document.getElementById("testStrategyPanel");
    if (!host) {
      return;
    }

    host.innerHTML = `
      <div class="strategy reveal">
        <div class="strategy__group">
          <div class="strategy__title">Principles</div>
          ${list(staffData.testStrategy.principles)}
        </div>

        <div class="strategy__group">
          <div class="strategy__title">Test Pyramid</div>
          <div class="strategy__pyramid">
            ${staffData.testStrategy.pyramid
              .map(
                (layer) => `
                  <article class="strategy__layer">
                    <div class="strategy__layerName">${escapeHtml(layer.layer)}</div>
                    <div class="strategy__layerFocus">${escapeHtml(layer.focus)}</div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>

        <div class="strategy__group">
          <div class="strategy__title">Release Gates</div>
          ${list(staffData.testStrategy.releaseGates)}
        </div>

        <div class="strategy__group">
          <div class="strategy__title">Quality Operations</div>
          ${list(staffData.testStrategy.qualityOps)}
        </div>
      </div>
    `;
  }

  function renderWriting() {
    const host = document.getElementById("writingList");
    if (!host) {
      return;
    }

    host.innerHTML = staffData.writing
      .map(
        (entry) => `
          <article class="writingItem reveal">
            <div class="writingItem__top">
              <div class="writingItem__title">${escapeHtml(entry.title)}</div>
              <span class="badge">${escapeHtml(entry.status)}</span>
            </div>
            <div class="writingItem__meta">${escapeHtml(entry.type)}</div>
            ${entry.summary ? `<div class="writingItem__summary">${escapeHtml(entry.summary)}</div>` : ""}
          </article>
        `,
      )
      .join("");
  }

  function render() {
    renderCaseStudies();
    renderDecisionArtifacts();
    renderSystemsTimeline();
    renderTestStrategy();
    renderWriting();
  }

  return { render };
}
