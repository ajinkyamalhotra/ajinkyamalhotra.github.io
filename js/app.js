import {
  profile,
  radar,
  impact,
  overviewProofs,
  experience,
  projects,
  skills,
  education,
  caseStudies,
  decisionArtifacts,
  systemsTimeline,
  testStrategy,
  writing,
  themePresets,
} from "./data.js";
import { qs, qsa, debounce, normalize, uniq, copyToClipboard, isReducedMotion } from "./utils.js";
import { initTheme, setTheme, cycleTheme } from "./theme.js";
import { initBootSequence } from "./boot.js";
import { toast } from "./toast.js";
import { initBackgroundCanvas } from "./background.js";
import { loadGithubRadar } from "./github.js";
import { initCommandPalette } from "./palette.js";
import { initTerminal } from "./terminal.js";
import { initProjectModal } from "./modal.js";
import { initSkillsRadar } from "./radar.js";

// Keep one reveal observer alive so dynamically-rendered content doesn't stay hidden.
let _revealObs = null;

// -------------------------------------------------------------
// App bootstrap
// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCursorSpotlight();
  initBootSequence();
  initBackgroundCanvas();
  registerServiceWorker();

  hydrateStaticFields();
  initTypewriter(profile.taglines, qs("#typewriter"));

  renderHero();
  renderImpact();
  renderStaffLens();

  const modal = initProjectModal({ toast });

  const xp = makeExperienceRenderer();
  xp.render();

  const proj = makeProjectsRenderer({ onOpenProject: modal.open });
  proj.render();

  renderSkills();
  initSkillsRadar({ skills });

  renderEducation();

  // Ship/Ops radar (best-effort)
  initShipRadarCollapse();
  loadGithubRadar(radar);

  initNavigation();
  initReveal();
  initGlobalShortcuts({ focusProjectSearch: () => qs("#projectSearch")?.focus() });
  initResponsivePlaceholders();

  // Terminal + palette
  const terminal = initTerminal({
    profile,
    impact,
    experience,
    projects,
    skills,
    themePresets,
    onNavigate: (hash) => scrollToHash(hash),
    onOpenProject: modal.open,
    onSetTheme: (id) => setTheme(id),
    toast,
  });

  initCommandPalette({
    actions: buildPaletteActions({ terminal, modal, proj, xp }),
  });

  // Wire buttons
  qs("#heroTerminal")?.addEventListener("click", () => terminal.open());
  qs("#copyEmail")?.addEventListener("click", () => copy(profile.email, "Email copied."));
  qs("#copyPhone")?.addEventListener("click", () => copy(profile.phone, "Phone copied."));
  qs("#copyProfile")?.addEventListener("click", () => copy(window.location.href.split("#")[0], "Link copied."));
  initInlineCopyButtons();

});

// -------------------------------------------------------------
// Rendering
// -------------------------------------------------------------

function hydrateStaticFields() {
  qs("#brandName").textContent = profile.name;
  qs("#heroName").textContent = profile.name;
  qs("#brandRole").textContent = profile.navRole || profile.role;
  qs("#heroRole").textContent = profile.role;

  qs("#heroSummary").textContent = profile.summary;
  qs("#heroThesis").textContent = profile.leadershipThesis || "";

  const meta = qs("#contactMeta");
  if (meta) meta.textContent = `${profile.email} · ${profile.phone} · ${profile.location}`;

  const emailLink = qs("#emailLink");
  if (emailLink) emailLink.href = `mailto:${profile.email}`;

  const linkedin = qs("#linkedinLink");
  if (linkedin) linkedin.href = profile.social.linkedin;

  const github = qs("#githubLink");
  if (github) github.href = profile.social.github;

  const phone = qs("#phoneLink");
  if (phone) phone.href = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;

  const profileLink = qs("#profileLink");
  if (profileLink) profileLink.href = window.location.href.split("#")[0];
}

function renderHero() {
  const scopeWrap = qs("#heroScope");
  if (scopeWrap) {
    scopeWrap.innerHTML = (profile.scopeChips || [])
      .map((c) => `<span class="chip chip--scope">${escape(c)}</span>`)
      .join("");
  }

  // Chips
  const chipWrap = qs("#heroChips");
  if (chipWrap) {
    chipWrap.innerHTML = profile.focusChips
      .map((c) => `<span class="chip">${escape(c)}</span>`)
      .join("");
  }

  // Proof-focused impact snapshot
  const statsWrap = qs("#quickStats");
  if (statsWrap) {
    const top = (overviewProofs || []).slice(0, 3);
    statsWrap.innerHTML = top
      .map(
        (s) => `
        <div class="stat statProof">
          <div class="statProof__top">
            <div class="stat__value">${escape(s.value)}</div>
            <div class="stat__label">${escape(s.label)}</div>
          </div>
          <div class="statProof__meta"><strong>Baseline:</strong> ${escape(s.baseline)}</div>
          <div class="statProof__meta"><strong>Current:</strong> ${escape(s.current)}</div>
          <div class="statProof__meta"><strong>Window:</strong> ${escape(s.window)}</div>
          <div class="statProof__meta"><strong>Method:</strong> ${escape(s.method)}</div>
        </div>
      `
      )
      .join("");
  }
}

function renderImpact() {
  const grid = qs("#impactGrid");
  if (!grid) return;

  grid.innerHTML = impact
    .map(
      (i) => `
      <div class="impact reveal">
        <div class="impact__value">${escape(i.value)}</div>
        <div class="impact__label">${escape(i.label)}</div>
        <div class="impact__desc">${escape(i.desc)}</div>
        <div class="impact__meta">
          ${(i.tags || []).map((t) => `<span class="tag">${escape(t)}</span>`).join("")}
        </div>
      </div>
    `
    )
    .join("");
}

function renderStaffLens() {
  renderCaseStudies();
  renderDecisionArtifacts();
  renderSystemsTimeline();
  renderTestStrategy();
  renderWriting();
}

function renderCaseStudies() {
  const grid = qs("#caseStudiesGrid");
  if (!grid) return;

  grid.innerHTML = caseStudies
    .map(
      (c) => `
      <article class="caseStudy reveal">
        <div class="caseStudy__top">
          <div class="caseStudy__title">${escape(c.title)}</div>
          <div class="caseStudy__period">${escape(c.period || "")}</div>
        </div>
        <div class="caseStudy__meta">${escape(c.scope || "")} • ${escape(c.role || "")}</div>
        <div class="caseStudy__section"><strong>Problem:</strong> ${escape(c.problem || "")}</div>
        <div class="caseStudy__section"><strong>Constraints:</strong><ul>${(c.constraints || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="caseStudy__section"><strong>Architecture:</strong><ul>${(c.architecture || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="caseStudy__section"><strong>Tradeoffs:</strong><ul>${(c.tradeoffs || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="caseStudy__section"><strong>Outcomes:</strong><ul>${(c.outcomes || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="caseStudy__tags">${(c.stack || []).map((x) => `<span class="tag">${escape(x)}</span>`).join("")}</div>
      </article>
    `
    )
    .join("");
}

function renderDecisionArtifacts() {
  const grid = qs("#decisionArtifactsGrid");
  if (!grid) return;

  grid.innerHTML = decisionArtifacts
    .map(
      (a) => `
      <article class="artifact reveal">
        <div class="artifact__head">
          <span class="artifact__type mono">${escape(a.type)}</span>
          <span class="badge">${escape((a.type || "").toUpperCase())}</span>
        </div>
        <div class="artifact__title">${escape(a.title || "")}</div>
        <div class="artifact__row"><strong>Context:</strong> ${escape(a.context || "")}</div>
        <div class="artifact__row"><strong>Decision:</strong> ${escape(a.decision || "")}</div>
        <div class="artifact__row"><strong>Alternatives:</strong><ul>${(a.alternatives || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="artifact__row"><strong>Result:</strong> ${escape(a.result || "")}</div>
      </article>
    `
    )
    .join("");
}

function renderSystemsTimeline() {
  const wrap = qs("#systemsTimeline");
  if (!wrap) return;

  wrap.innerHTML = systemsTimeline
    .map(
      (s) => `
      <article class="systemPhase reveal">
        <div class="systemPhase__top">
          <div class="systemPhase__name">${escape(s.phase || "")}</div>
          <div class="systemPhase__period">${escape(s.period || "")}</div>
        </div>
        <div class="systemPhase__theme">${escape(s.theme || "")}</div>
        <ul class="systemPhase__list">
          ${(s.details || []).map((d) => `<li>${escape(d)}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");
}

function renderTestStrategy() {
  const panel = qs("#testStrategyPanel");
  if (!panel) return;

  panel.innerHTML = `
    <div class="strategy reveal">
      <div class="strategy__group">
        <div class="strategy__title">Principles</div>
        <ul>${(testStrategy.principles || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul>
      </div>
      <div class="strategy__group">
        <div class="strategy__title">Test Pyramid</div>
        <div class="strategy__pyramid">
          ${(testStrategy.pyramid || [])
            .map(
              (x) => `
            <div class="strategy__layer">
              <div class="strategy__layerName">${escape(x.layer || "")}</div>
              <div class="strategy__layerFocus">${escape(x.focus || "")}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="strategy__group">
        <div class="strategy__title">Release Gates</div>
        <ul>${(testStrategy.releaseGates || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul>
      </div>
      <div class="strategy__group">
        <div class="strategy__title">Quality Operations</div>
        <ul>${(testStrategy.qualityOps || []).map((x) => `<li>${escape(x)}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderWriting() {
  const list = qs("#writingList");
  if (!list) return;

  list.innerHTML = writing
    .map(
      (w) => `
      <article class="writingItem reveal">
        <div class="writingItem__top">
          <div class="writingItem__title">${escape(w.title || "")}</div>
          <span class="badge">${escape(w.status || "")}</span>
        </div>
        <div class="writingItem__meta">${escape(w.type || "")}</div>
      </article>
    `
    )
    .join("");
}

function makeExperienceRenderer() {
  const container = qs("#experienceContainer");
  const search = qs("#experienceSearch");
  const btnTimeline = qs("#expViewTimeline");
  const btnCards = qs("#expViewCards");

  let view = "timeline";
  let query = "";

  const setView = (v) => {
    view = v;
    btnTimeline?.classList.toggle("seg__btn--active", v === "timeline");
    btnCards?.classList.toggle("seg__btn--active", v === "cards");
    render();
  };

  btnTimeline?.addEventListener("click", () => setView("timeline"));
  btnCards?.addEventListener("click", () => setView("cards"));

  search?.addEventListener(
    "input",
    debounce(() => {
      query = search.value;
      render();
    }, 120)
  );

  const match = (x, q) => {
    if (!q) return true;
    const hay = normalize(
      [
        x.company,
        x.location,
        x.period,
        ...(x.tags || []),
        ...x.roles.flatMap((r) => [r.title, r.period, ...(r.bullets || [])]),
      ].join(" ")
    );
    const qq = normalize(q);
    return hay.includes(qq);
  };

  function render() {
    if (!container) return;

    const items = experience.filter((x) => match(x, query));

    const wrapClass = view === "timeline" ? "timeline" : "cards";

    container.innerHTML = `
      <div class="${wrapClass}">
        ${items.map(renderCompany).join("")}
      </div>
    `;

    // Re-run reveal observation for newly inserted nodes.
    initReveal(container);
  }

  function renderCompany(x) {
    const rolesHtml = x.roles
      .map(
        (r) => `
        <div class="role">
          <div class="role__head">
            <div class="role__title">${escape(r.title)}</div>
            <div class="role__period">${escape(r.period)}</div>
          </div>
          <ul class="role__bullets">
            ${(r.bullets || []).map((b) => `<li>${escape(b)}</li>`).join("")}
          </ul>
        </div>
      `
      )
      .join("");

    const tagsHtml = (x.tags || []).map((t) => `<span class="tag">${escape(t)}</span>`).join("");

    const company = x.link
      ? `<a href="${escape(x.link)}" target="_blank" rel="noreferrer" class="xp__company">${escape(x.company)}</a>`
      : `<div class="xp__company">${escape(x.company)}</div>`;

    return `
      <div class="xp reveal">
        <div class="xp__top">
          ${company}
          <div class="xp__period">${escape(x.period)} · ${escape(x.location)}</div>
        </div>
        <div class="xp__roles">${rolesHtml}</div>
        ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ""}
      </div>
    `;
  }

  return { render, setView };
}

function makeProjectsRenderer({ onOpenProject } = {}) {
  const grid = qs("#projectsGrid");
  const search = qs("#projectSearch");
  const filters = qs("#projectFilters");

  let query = "";
  let activeTag = "All";

  const allTags = projects.flatMap((p) => p.tags || []);
  const tagCounts = allTags.reduce((m, t) => {
    m[t] = (m[t] || 0) + 1;
    return m;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t]) => t);

  function renderFilters() {
    if (!filters) return;

    const tags = ["All", ...topTags];

    filters.innerHTML = tags
      .map((t) => {
        const active = t === activeTag ? "chip chip--active" : "chip";
        return `<button type="button" class="${active}" data-filter="${escape(t)}">${escape(t)}</button>`;
      })
      .join("");

    filters.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTag = btn.getAttribute("data-filter") || "All";
        render();
        renderFilters();
      });
    });
  }

  function matches(p) {
    const q = normalize(query);
    const tagOk = activeTag === "All" || (p.tags || []).includes(activeTag);

    if (!q) return tagOk;

    const hay = normalize([p.title, p.desc, ...(p.tags || [])].join(" "));
    return tagOk && hay.includes(q);
  }

  function render() {
    if (!grid) return;

    const items = projects.filter(matches);
    grid.innerHTML = items.map(renderCard).join("");

    // Ensure newly rendered cards animate in (and aren't stuck invisible).
    initReveal(grid);

    // Click to open modal
    grid.querySelectorAll("[data-project]").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = Number(el.getAttribute("data-project"));
        const p = items[idx];
        if (p) onOpenProject?.(p);
      });
    });
  }

  function renderCard(p, idx) {
    const tags = (p.tags || []).slice(0, 4).map((t) => `<span class="tag">${escape(t)}</span>`).join("");
    return `
      <article class="project reveal" role="button" tabindex="0" data-project="${idx}">
        <div class="project__top">
          <div class="project__title">${escape(p.title)}</div>
          <div class="project__period">${escape(p.period || "")}</div>
        </div>
        <div class="project__desc">${escape(p.desc || "")}</div>
        <div class="project__tags">${tags}</div>
      </article>
    `;
  }

  renderFilters();

  search?.addEventListener(
    "input",
    debounce(() => {
      query = search.value;
      render();
    }, 100)
  );

  // Keyboard: open via Enter on focused card
  grid?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.key === " ") e.preventDefault();
    const card = e.target.closest("[data-project]");
    if (!card) return;
    card.click();
  });

  return { render, setFilter: (t) => (activeTag = t) };
}

function renderSkills() {
  const list = qs("#skillsList");
  if (!list) return;

  list.innerHTML = skills
    .map(
      (s) => `
      <div class="skillGroup">
        <div class="skillGroup__head">
          <div class="skillGroup__name">${escape(s.name)}</div>
          <div class="skillGroup__level">${escape(String(s.level))}/10</div>
        </div>
        <div class="subskills">
          ${(s.subSkills || []).map((ss) => `<span class="subskill">${escape(ss.name)}</span>`).join("")}
        </div>
      </div>
    `
    )
    .join("");
}

function renderEducation() {
  const grid = qs("#educationGrid");
  if (!grid) return;

  grid.innerHTML = education
    .map(
      (e) => `
      <div class="edu reveal">
        <div class="edu__top">
          <div class="edu__title">${escape(e.degree)}</div>
          <div class="edu__period">${escape(e.period)}</div>
        </div>
        <div class="edu__meta">
          <div><strong>${escape(e.school)}</strong></div>
          <div class="muted mono" style="margin-top:6px;">${escape(e.meta || "")}</div>
          <div style="margin-top:10px;">${escape("Coursework:")}</div>
          <div class="edu__chips">
            ${(e.coursework || []).map((c) => `<span class="tag">${escape(c)}</span>`).join("")}
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// -------------------------------------------------------------
// Navigation, reveal, shortcuts
// -------------------------------------------------------------

function initNavigation() {
  qsa("a[data-nav]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();
      history.pushState(null, "", href);
      scrollToHash(href);
    });
  });

  const links = qsa(".nav a[data-nav]");
  const sections = qsa("main section[id]");
  const topbar = document.getElementById("topbar");

  const updateActive = () => {
    if (!sections.length) return;
    const offset = (topbar?.offsetHeight || 0) + 20;
    const y = window.scrollY + offset;

    let activeId = sections[0].id;
    for (const s of sections) {
      const start = s.offsetTop;
      const end = start + s.offsetHeight;
      if (y >= start && y < end) {
        activeId = s.id;
        break;
      }
      if (y >= start) activeId = s.id;
    }

    const hash = `#${activeId}`;
    links.forEach((l) => l.classList.toggle("nav--active", l.getAttribute("href") === hash));
    history.replaceState(null, "", hash);
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive, { passive: true });
  updateActive();

  // On initial load with hash
  if (window.location.hash) {
    setTimeout(() => scrollToHash(window.location.hash, { smooth: false }), 0);
    setTimeout(updateActive, 20);
  }
}

function initResponsivePlaceholders() {
  const input = qs("#experienceSearch");
  if (!input) return;

  const full = input.getAttribute("placeholder") || "";
  const short = "Filter experience…";

  const apply = () => {
    const useShort = window.innerWidth <= 620;
    input.setAttribute("placeholder", useShort ? short : full);
  };

  apply();
  window.addEventListener("resize", debounce(apply, 150), { passive: true });
}

export function scrollToHash(hash, { smooth = true } = {}) {
  const id = (hash || "").replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const topbar = document.getElementById("topbar");
  const offset = (topbar?.offsetHeight || 0) + 10;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  window.scrollTo({
    top: Math.max(0, y),
    behavior: smooth && !reduced ? "smooth" : "auto",
  });
}

function initReveal(root = document) {
  const els = qsa(".reveal:not(.is-visible)", root);
  if (els.length === 0) return;

  if (!_revealObs) {
    _revealObs = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.15 }
    );
  }

  els.forEach((el) => _revealObs.observe(el));
}

function initGlobalShortcuts({ focusProjectSearch } = {}) {
  window.addEventListener("keydown", (e) => {
    const tag = (e.target?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;
    if (typing) return;

    if (e.key === "/") {
      e.preventDefault();
      focusProjectSearch?.();
    }

    // Extra: Shift+T cycles backwards
    if (e.key.toLowerCase() === "t" && e.shiftKey) {
      e.preventDefault();
      cycleTheme(-1);
    }
  });
}

// -------------------------------------------------------------
// Command palette actions
// -------------------------------------------------------------

function buildPaletteActions({ terminal, modal } = {}) {
  const actions = [];

  const go = (hash) => () => scrollToHash(hash);

  // Sections
  const sectionActions = [
    ["Overview", "#overview"],
    ["Impact", "#impact"],
    ["Staff Lens", "#staff"],
    ["Experience", "#experience"],
    ["Projects", "#projects"],
    ["Skills", "#skills"],
    ["Resume", "#resume"],
    ["Contact", "#contact"],
  ];

  for (const [label, hash] of sectionActions) {
    actions.push({
      label: `Go to ${label}`,
      meta: hash,
      keywords: `navigate ${label}`,
      run: go(hash),
    });
  }

  // Terminal
  actions.push({
    label: "Open Terminal",
    meta: "~",
    keywords: "terminal cli shell",
    run: () => terminal?.open?.(),
  });

  // Themes
  actions.push({
    label: "Theme: cycle",
    meta: "T",
    keywords: "theme toggle",
    run: () => {
      const next = cycleTheme(1);
      toast(`Theme: ${next}`);
    },
  });

  for (const t of themePresets) {
    actions.push({
      label: `Theme: ${t.label}`,
      meta: t.id,
      keywords: `theme ${t.id} ${t.label}`,
      run: () => {
        setTheme(t.id);
        toast(`Theme: ${t.id}`);
      },
    });
  }

  // Copy
  actions.push({
    label: "Copy email",
    meta: profile.email,
    keywords: "copy email contact",
    run: () => copy(profile.email, "Email copied."),
  });
  actions.push({
    label: "Copy phone",
    meta: profile.phone,
    keywords: "copy phone contact",
    run: () => copy(profile.phone, "Phone copied."),
  });

  // Links
  actions.push({
    label: "Open GitHub",
    meta: "↗",
    keywords: "github repos",
    run: () => window.open(profile.social.github, "_blank", "noopener"),
  });
  actions.push({
    label: "Open LinkedIn",
    meta: "↗",
    keywords: "linkedin",
    run: () => window.open(profile.social.linkedin, "_blank", "noopener"),
  });

  // Resume
  actions.push({
    label: "Open resume.pdf",
    meta: "PDF",
    keywords: "resume pdf",
    run: () => window.open("resume.pdf", "_blank", "noopener"),
  });

  // Projects
  projects.forEach((p) => {
    actions.push({
      label: `Project: ${p.title}`,
      meta: p.period,
      keywords: `project open ${p.title} ${(p.tags || []).join(" ")}`,
      run: () => modal?.open?.(p),
    });
  });

  return actions;
}

// -------------------------------------------------------------
// Typewriter
// -------------------------------------------------------------

function initTypewriter(lines, el) {
  if (!el || !Array.isArray(lines) || lines.length === 0) return;

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduced) {
    el.textContent = lines[0];
    return;
  }

  let i = 0;
  let j = 0;
  let dir = 1; // 1 typing, -1 deleting

  const typeSpeed = 28;
  const deleteSpeed = 18;
  const hold = 850;

  const tick = () => {
    const current = lines[i];

    if (dir === 1) {
      j++;
      el.textContent = current.slice(0, j);
      if (j >= current.length) {
        dir = -1;
        setTimeout(tick, hold);
        return;
      }
      setTimeout(tick, typeSpeed);
      return;
    }

    // deleting
    j--;
    el.textContent = current.slice(0, Math.max(0, j));
    if (j <= 0) {
      dir = 1;
      i = (i + 1) % lines.length;
      setTimeout(tick, 220);
      return;
    }
    setTimeout(tick, deleteSpeed);
  };

  tick();
}

// -------------------------------------------------------------
// PWA
// -------------------------------------------------------------

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch(() => {
        // ignore
      });
  });
}

// -------------------------------------------------------------
// Small helpers
// -------------------------------------------------------------

function escape(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function copy(text, msg) {
  const ok = await copyToClipboard(text);
  toast(ok ? msg : "Copy failed.");
}

function initInlineCopyButtons() {
  qsa("[data-copy-key]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const key = btn.getAttribute("data-copy-key");
      const valueMap = {
        email: profile.email,
        linkedin: profile.social.linkedin,
        github: profile.social.github,
        phone: profile.phone,
        profile: window.location.href.split("#")[0],
      };

      const value = valueMap[key];
      if (!value) {
        toast("Copy failed.");
        return;
      }

      const ok = await copyToClipboard(value);
      const labelMap = {
        email: "Email copied.",
        linkedin: "LinkedIn URL copied.",
        github: "GitHub URL copied.",
        phone: "Phone copied.",
        profile: "Profile link copied.",
      };
      toast(ok ? labelMap[key] : "Copy failed.");
    });
  });
}

function initShipRadarCollapse() {
  const panel = qs(".panel--github");
  const btn = qs("#githubToggle");
  if (!panel || !btn) return;

  const KEY = "ajinkyaos.github.collapsed";
  const setCollapsed = (collapsed) => {
    panel.classList.toggle("is-collapsed", collapsed);
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.setAttribute("aria-label", collapsed ? "Expand Ship Radar" : "Collapse Ship Radar");
    try {
      localStorage.setItem(KEY, collapsed ? "1" : "0");
    } catch {
      // ignore persistence failures
    }
  };

  let collapsed = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "0" || saved === "1") collapsed = saved === "1";
  } catch {
    // ignore
  }
  setCollapsed(collapsed);

  btn.addEventListener("click", () => setCollapsed(!panel.classList.contains("is-collapsed")));
}

function initCursorSpotlight() {
  const root = document.documentElement;
  if (!root) return;

  const coarsePointer = window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches;
  if (coarsePointer || isReducedMotion()) {
    root.classList.remove("spotlight-on");
    return;
  }

  root.classList.add("spotlight-on");

  let x = window.innerWidth * 0.5;
  let y = window.innerHeight * 0.3;
  let raf = 0;

  const flush = () => {
    raf = 0;
    root.style.setProperty("--spot-x", `${x}px`);
    root.style.setProperty("--spot-y", `${y}px`);
  };

  const onMove = (e) => {
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(flush);
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", () => {
    x = window.innerWidth * 0.5;
    y = window.innerHeight * 0.3;
    if (!raf) raf = requestAnimationFrame(flush);
  });

  flush();
}
