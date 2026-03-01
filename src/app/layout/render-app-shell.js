import { escapeHtml } from "@shared/utils/text.js";

function renderNavLinks(routes) {
  return routes
    .filter((route) => route.inNav)
    .map(
      (route) =>
        `<a href="#${route.id}" data-nav data-route-id="${route.id}">${escapeHtml(route.label)}</a>`,
    )
    .join("");
}

function renderResumeActionButton() {
  return `
    <a class="btn btn--primary btn--icon" id="resumeBtn" href="resume.pdf" download aria-label="Download Resume" title="Download Resume">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 3v12"></path>
        <path d="m7 10 5 5 5-5"></path>
        <path d="M5 21h14"></path>
      </svg>
    </a>
  `;
}

function toPhoneHref(phone) {
  const normalized = String(phone || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "#";
}

export function renderAppShell({ content }) {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    return;
  }

  const { profile, routes, sectionTitles, hero, contactQuickCommands, footer, shell } = content;
  const brandMark = shell?.brandMark || "AM";
  const osLabel = shell?.osLabel || "PORTFOLIO.OS";
  const terminalWindowTitle = shell?.terminalWindowTitle || "portfolio@portfolio";
  const bootInitialStage = shell?.bootInitialStage || "Firmware init";
  const phoneHref = toPhoneHref(profile.phone);

  appRoot.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>

    <canvas id="bg" class="bg" aria-hidden="true"></canvas>

    <div id="boot" class="boot" aria-hidden="true">
      <div class="boot__inner">
        <div class="boot__top">
          <div class="boot__brand">
            <span class="boot__mark" aria-hidden="true">${escapeHtml(brandMark)}</span>
            <span class="boot__title">${escapeHtml(osLabel)}</span>
          </div>
          <button id="bootSkip" class="boot__skip" type="button">Skip</button>
        </div>
        <div class="boot__progress" aria-live="polite">
          <div class="boot__progressMeta">
            <span id="bootStage" class="boot__stage">${escapeHtml(bootInitialStage)}</span>
            <span id="bootPct" class="boot__pct">0%</span>
          </div>
          <div class="boot__track" role="progressbar" aria-label="Boot progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div id="bootBar" class="boot__bar"></div>
          </div>
        </div>
        <pre id="bootLog" class="boot__log"></pre>
      </div>
    </div>

    <div id="paletteOverlay" class="overlay" aria-hidden="true">
      <div class="overlay__backdrop" data-close="palette"></div>
      <div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="palette__top">
          <div class="palette__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.4-3.4"></path>
            </svg>
          </div>
          <input id="paletteInput" class="palette__input" type="text" placeholder="Type a command or search..." autocomplete="off" spellcheck="false" />
          <div class="palette__kbd" aria-hidden="true"><kbd>Esc</kbd></div>
        </div>
        <div class="palette__hint">Try: <span class="mono">projects</span>, <span class="mono">theme neon</span>, <span class="mono">resume</span>, <span class="mono">copy email</span>.</div>
        <ul id="paletteList" class="palette__list" role="listbox" aria-label="Results"></ul>
      </div>
    </div>

    <div id="terminalOverlay" class="overlay" aria-hidden="true">
      <div class="overlay__backdrop" data-close="terminal"></div>
      <div class="terminal" role="dialog" aria-modal="true" aria-label="Terminal">
        <div class="terminal__bar">
          <div class="terminal__windowControls" aria-label="Terminal window controls">
            <button id="terminalMaxBtn" class="terminal__max" type="button" aria-label="Maximize terminal" title="Maximize terminal">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="2"></rect>
              </svg>
            </button>
          </div>
          <div class="terminal__title"><span class="mono">${escapeHtml(terminalWindowTitle)}</span> <span class="muted">:~</span></div>
          <button class="terminal__close" type="button" data-close="terminal" aria-label="Close terminal">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div id="terminalBody" class="terminal__body" tabindex="0" aria-live="polite">
          <div class="terminal__hints mono">
            <span><kbd>Tab</kbd> autocomplete</span>
            <span><kbd>Up/Down</kbd> history</span>
            <span><kbd>Ctrl</kbd>+<kbd>C</kbd> clear line</span>
            <span><kbd>Esc</kbd> close</span>
            <span><span class="mono">help</span> manual</span>
          </div>
          <div id="terminalOutput"></div>
          <div class="terminal__inputInline">
            <span id="terminalPrompt" class="terminal__prompt mono"></span>
            <input id="terminalInput" class="terminal__input mono" type="text" autocomplete="off" spellcheck="false" />
          </div>
        </div>
      </div>
    </div>

    <div id="modalOverlay" class="overlay" aria-hidden="true">
      <div class="overlay__backdrop" data-close="modal"></div>
      <div class="modal" role="dialog" aria-modal="true" aria-label="Project details">
        <div class="modal__bar">
          <div id="modalTitle" class="modal__title"></div>
          <button class="modal__close" type="button" data-close="modal" aria-label="Close">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div id="modalBody" class="modal__body"></div>
      </div>
    </div>

    <header class="topbar" id="topbar">
      <div class="container topbar__inner">
        <a class="brand" href="#overview" data-nav>
          <span class="brand__mark" aria-hidden="true">${escapeHtml(brandMark)}</span>
          <span class="brand__text">
            <span class="brand__name" id="brandName">${escapeHtml(profile.name)}</span>
            <span class="brand__role" id="brandRole">${escapeHtml(profile.navRole)}</span>
          </span>
        </a>

        <nav class="nav" aria-label="Primary">
          ${renderNavLinks(routes)}
        </nav>

        <div class="topbar__actions">
          <button class="icon-btn" id="themeBtn" type="button" aria-label="Change theme" title="Change theme (T)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </button>
          <button class="icon-btn" id="paletteBtn" type="button" aria-label="Open command palette" title="Command palette (Ctrl+K)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.4-3.4"></path>
            </svg>
          </button>
          <button class="icon-btn" id="terminalBtn" type="button" aria-label="Open terminal" title="Terminal (~)">&gt;_</button>
          ${renderResumeActionButton()}
        </div>
      </div>
    </header>

    <main id="main" class="main">
      <section id="overview" class="section section--hero">
        <div class="container hero">
          <div class="hero__left" id="heroMount"></div>
          <div class="hero__right" id="heroAsideMount"></div>
        </div>
      </section>

      <section id="impact" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.impact.code)}</span> ${escapeHtml(sectionTitles.impact.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.impact.subtitle)}</p>
          </header>
          <div class="impact-grid" id="impactGrid"></div>
        </div>
      </section>

      <section id="staff" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.staff.code)}</span> ${escapeHtml(sectionTitles.staff.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.staff.subtitle)}</p>
          </header>
          <div class="staffLayout">
            <div>
              <div class="staffBlock">
                <h3 class="staffBlock__title">Case Studies</h3>
                <div id="caseStudiesGrid" class="caseStudies"></div>
              </div>
              <div class="staffBlock">
                <h3 class="staffBlock__title">Decision Artifacts</h3>
                <div id="decisionArtifactsGrid" class="artifacts"></div>
              </div>
            </div>
            <div>
              <div class="staffBlock">
                <h3 class="staffBlock__title">Systems I Have Built</h3>
                <div id="systemsTimeline" class="systemsTimeline"></div>
              </div>
              <div class="staffBlock">
                <h3 class="staffBlock__title">Test and Release Strategy</h3>
                <div id="testStrategyPanel" class="strategyPanel"></div>
              </div>
              <div class="staffBlock">
                <h3 class="staffBlock__title">Technical Writing</h3>
                <div id="writingList" class="writingList"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.experience.code)}</span> ${escapeHtml(sectionTitles.experience.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.experience.subtitle)}</p>
          </header>
          <div class="experience__controls">
            <input id="experienceSearch" class="input input--compact" type="search" placeholder="${escapeHtml(content.experience.searchPlaceholder)}" autocomplete="off" />
            <div class="seg" role="group" aria-label="Experience view">
              <button class="seg__btn seg__btn--active" id="expViewTimeline" type="button">Timeline</button>
              <button class="seg__btn" id="expViewCards" type="button">Cards</button>
            </div>
          </div>
          <div id="experienceContainer" class="experience"></div>
        </div>
      </section>

      <section id="projects" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.projects.code)}</span> ${escapeHtml(sectionTitles.projects.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.projects.subtitle)}</p>
          </header>
          <div class="projects__controls">
            <input id="projectSearch" class="input" type="search" placeholder="Search projects..." autocomplete="off" />
            <div id="projectFilters" class="chips chips--filters" aria-label="Project filters"></div>
          </div>
          <div id="projectsGrid" class="projects"></div>
        </div>
      </section>

      <section id="skills" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.skills.code)}</span> ${escapeHtml(sectionTitles.skills.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.skills.subtitle)}</p>
          </header>
          <div class="skills">
            <div class="panel skills__chart reveal">
              <div class="panel__header">
                <span class="panel__title">Skill Radar</span>
                <span class="panel__sub">(interactive)</span>
              </div>
              <div class="skills__canvasWrap">
                <canvas id="skillsRadar" width="520" height="520" aria-label="Skills radar chart" role="img"></canvas>
                <div id="skillsRadarHint" class="skills__hint mono muted">Hover nodes  |  Click a category to pin</div>
              </div>
            </div>
            <div class="panel skills__list reveal">
              <div class="panel__header">
                <span class="panel__title">Skill Matrix</span>
                <span class="panel__sub">(levels are self-rated)</span>
              </div>
              <div id="skillsList" class="skills__groups"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="education" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.education.code)}</span> ${escapeHtml(sectionTitles.education.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.education.subtitle)}</p>
          </header>
          <div id="educationGrid" class="education"></div>
        </div>
      </section>

      <section id="resume" class="section">
        <div class="container">
          <header class="section__header">
            <h2 class="section__title"><span class="code">${escapeHtml(sectionTitles.resume.code)}</span> ${escapeHtml(sectionTitles.resume.title)}</h2>
            <p class="section__subtitle">${escapeHtml(sectionTitles.resume.subtitle)}</p>
          </header>
          <div class="resume">
            <div class="resume__actions">
              <a class="btn btn--primary" href="resume.pdf" target="_blank" rel="noreferrer">Open in new tab</a>
              <a class="btn btn--ghost" href="resume.pdf" download>Download</a>
              <span class="btnWrap">
                <a class="btn btn--ghost" id="phoneLink" href="${escapeHtml(phoneHref)}">Phone</a>
                <button class="btnCopyIcon" id="copyPhone" type="button" aria-label="Copy phone" data-copy-key="phone">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
                  </svg>
                </button>
              </span>
            </div>
            <div class="resume__viewer">
              <iframe title="Resume PDF" src="resume.pdf#view=FitH" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="section section--contact">
        <div class="container contact">
          <div class="contact__card reveal">
            <h2 class="contact__title">Let's build something that matters.</h2>
            <p class="contact__text">If you're hiring for software engineering, platform, DevOps, release, or reliability roles, I would love to connect.</p>
            <div class="contact__actions">
              <span class="btnWrap">
                <a class="btn btn--primary" id="emailLink" href="mailto:${escapeHtml(profile.email)}">Email</a>
                <button class="btnCopyIcon" type="button" aria-label="Copy email" data-copy-key="email">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
                  </svg>
                </button>
              </span>
              <span class="btnWrap">
                <a class="btn btn--ghost" id="linkedinLink" href="${escapeHtml(profile.social.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>
                <button class="btnCopyIcon" type="button" aria-label="Copy LinkedIn URL" data-copy-key="linkedin">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
                  </svg>
                </button>
              </span>
              <span class="btnWrap">
                <a class="btn btn--ghost" id="githubLink" href="${escapeHtml(profile.social.github)}" target="_blank" rel="noreferrer">GitHub</a>
                <button class="btnCopyIcon" type="button" aria-label="Copy GitHub URL" data-copy-key="github">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
                  </svg>
                </button>
              </span>
              <span class="btnWrap">
                <a class="btn btn--ghost" id="profileLink" href="#overview" data-nav>Profile</a>
                <button class="btnCopyIcon" id="copyProfile" type="button" aria-label="Copy profile link" data-copy-key="profile">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
                  </svg>
                </button>
              </span>
            </div>
            <div class="contact__meta mono muted" id="contactMeta"></div>
          </div>
          <div class="contact__side reveal">
            <div class="panel">
              <div class="panel__header">
                <span class="panel__title">Quick Commands</span>
                <span class="panel__sub">(keyboard)</span>
              </div>
              <ul class="list mono" id="quickCommandsList">
                ${contactQuickCommands
                  .map(
                    (entry) =>
                      `<li><span class="kbd"><kbd>${escapeHtml(entry.keys)}</kbd></span> ${escapeHtml(entry.label)}</li>`,
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="container footer__inner">
          <div class="footer__left">
            <div class="footer__brand mono">${escapeHtml(footer.brand)}</div>
            <div class="footer__muted muted">${escapeHtml(footer.tagline)}</div>
          </div>
          <div class="footer__right">
            <a href="#overview" data-nav class="mono">Back to top ^</a>
          </div>
        </div>
      </footer>
    </main>

    <div id="toast" class="toast" aria-live="polite" aria-atomic="true"></div>
  `;

  const heroMount = document.getElementById("heroMount");
  const heroAsideMount = document.getElementById("heroAsideMount");

  if (heroMount) {
    heroMount.innerHTML = `
      <div class="eyebrow"><span class="muted">${escapeHtml(profile.location)}</span></div>
      <h1 class="hero__title" id="heroName">${escapeHtml(profile.name)}</h1>
      <div class="hero__role" id="heroRole">${escapeHtml(profile.headlineRole)}</div>
      <p class="hero__thesis" id="heroThesis"></p>
      <div class="hero__tagline">
        <span class="muted">$</span>
        <span class="mono" id="typewriter"></span>
        <span class="cursor" aria-hidden="true">|</span>
      </div>
      <p class="hero__summary" id="heroSummary"></p>
      <div class="hero__cta" id="heroCtaList"></div>
      <div class="hero__scope" id="heroScope"></div>
      <div class="hero__chips" id="heroChips"></div>
      <div class="hero__foot mono muted">${escapeHtml(hero.tip)}</div>
    `;
  }

  if (heroAsideMount) {
    heroAsideMount.innerHTML = `
      <div class="panel panel--stats reveal">
        <div class="panel__header">
          <span class="panel__title">${escapeHtml(hero.impactPanelTitle)}</span>
        </div>
        <div class="stats" id="quickStats"></div>
      </div>

      <div class="panel panel--github reveal">
        <div class="panel__header">
          <span class="panel__title">${escapeHtml(hero.radarPanelTitle)}</span>
          <div class="panel__tools">
            <span class="panel__sub" id="githubStatus">${escapeHtml(hero.radarInitialStatus)}</span>
            <button class="icon-btn icon-btn--sm" id="githubToggle" type="button" aria-expanded="false" aria-controls="githubRepos" title="Toggle Ship Radar">v</button>
          </div>
        </div>
        <div id="githubRepos" class="repos"></div>
      </div>
    `;
  }
}
