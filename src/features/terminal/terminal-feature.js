import { STORAGE_KEYS } from "@shared/constants/storage-keys.js";
import { escapeHtml, normalize } from "@shared/utils/text.js";

const COMMAND_REFERENCE = [
  {
    group: "Basics",
    cmd: "help",
    aliases: ["?", "Ctrl+Space"],
    usage: "help",
    desc: "Show the terminal manual.",
  },
  { group: "Basics", cmd: "clear", usage: "clear", desc: "Clear terminal output." },
  {
    group: "Basics",
    cmd: "exit",
    aliases: ["quit", "Esc"],
    usage: "exit",
    desc: "Close terminal.",
  },
  { group: "Navigation", cmd: "ls", usage: "ls", desc: "List sections available for navigation." },
  {
    group: "Navigation",
    cmd: "goto",
    usage: "goto <section>",
    desc: "Navigate to a section hash.",
  },
  {
    group: "Portfolio",
    cmd: "about",
    aliases: ["whoami"],
    usage: "about",
    desc: "Print profile summary.",
  },
  { group: "Portfolio", cmd: "impact", usage: "impact", desc: "Print impact metrics." },
  {
    group: "Portfolio",
    cmd: "experience",
    aliases: ["xp"],
    usage: "experience [filter]",
    desc: "List experience entries, optionally filtered.",
  },
  {
    group: "Portfolio",
    cmd: "projects",
    aliases: ["proj"],
    usage: "projects [filter]",
    desc: "List projects, optionally filtered.",
  },
  {
    group: "Portfolio",
    cmd: "open",
    usage: "open <index|name>",
    desc: "Open a project in the modal.",
  },
  {
    group: "Portfolio",
    cmd: "skills",
    usage: "skills [category]",
    desc: "List skill categories or one category.",
  },
  {
    group: "Portfolio",
    cmd: "radar",
    aliases: ["ship"],
    usage: "radar",
    desc: "Print Ship Radar telemetry.",
  },
  { group: "Personal", cmd: "resume", usage: "resume", desc: "Jump to resume section." },
  { group: "Personal", cmd: "contact", usage: "contact", desc: "Print contact links." },
  {
    group: "Customization",
    cmd: "theme",
    usage: "theme [name]",
    desc: "List themes or switch theme.",
  },
  {
    group: "Utilities",
    cmd: "history",
    usage: "history [--grep <text>]",
    desc: "Show command history with optional filter.",
  },
  { group: "Utilities", cmd: "!!", usage: "!!", desc: "Run the previous command." },
  { group: "Utilities", cmd: "!<n>", usage: "!12", desc: "Run history command #n." },
  { group: "Utilities", cmd: "echo", usage: "echo <text>", desc: "Print text." },
];

const GROUP_PRIORITY = [
  "Basics",
  "Navigation",
  "Portfolio",
  "Personal",
  "Customization",
  "Utilities",
];

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.terminalHistory);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(-50) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.terminalHistory, JSON.stringify(history.slice(-50)));
  } catch {
    // Ignore storage persistence failures.
  }
}

function hasTypingFocus(target) {
  const tag = target?.tagName?.toLowerCase() || "";
  return tag === "input" || tag === "textarea" || target?.isContentEditable;
}

function renderManual() {
  const grouped = COMMAND_REFERENCE.reduce((map, command) => {
    const key = command.group || "Other";
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(command);
    return map;
  }, new Map());

  const orderedGroups = [...grouped.keys()].sort((left, right) => {
    const leftIndex = GROUP_PRIORITY.includes(left)
      ? GROUP_PRIORITY.indexOf(left)
      : Number.MAX_SAFE_INTEGER;
    const rightIndex = GROUP_PRIORITY.includes(right)
      ? GROUP_PRIORITY.indexOf(right)
      : Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });

  return `
    <div class="termManual">
      ${orderedGroups
        .map((group) => {
          const rows = grouped
            .get(group)
            .map((command) => {
              const aliases = command.aliases?.length
                ? `<span class="termManual__aliases">${command.aliases
                    .map((alias) => `<span class="termManual__chip">${escapeHtml(alias)}</span>`)
                    .join("")}</span>`
                : "";

              return `
                <div class="termManual__row">
                  <div class="termManual__left">
                    <span class="termCmd">${escapeHtml(command.usage || command.cmd)}</span>
                    ${aliases}
                  </div>
                  <div class="termManual__right termDim">${escapeHtml(command.desc || "")}</div>
                </div>
              `;
            })
            .join("");

          return `<section class="termManual__group"><h4 class="termManual__h">${escapeHtml(group)}</h4>${rows}</section>`;
        })
        .join("")}
      <div class="termManual__foot termDim"><span class="termCmd">Tip:</span> type a command and press Enter.</div>
    </div>
  `;
}

export function createTerminalFeature({
  profile,
  shell,
  impact,
  experience,
  projects,
  skills,
  themes,
  toast,
  onNavigate,
  onOpenProject,
  onThemeSet,
}) {
  const overlay = document.getElementById("terminalOverlay");
  const terminal = overlay?.querySelector(".terminal") || null;
  const openButton = document.getElementById("terminalBtn");
  const maxButton = document.getElementById("terminalMaxBtn");
  const body = document.getElementById("terminalBody");
  const output = document.getElementById("terminalOutput");
  const input = document.getElementById("terminalInput");
  const prompt = document.getElementById("terminalPrompt");

  if (!overlay || !terminal || !body || !output || !input || !prompt) {
    return { open() {}, close() {}, toggle() {}, run() {} };
  }

  const commandNames = [
    "help",
    "?",
    "about",
    "whoami",
    "impact",
    "experience",
    "xp",
    "projects",
    "proj",
    "open",
    "skills",
    "radar",
    "ship",
    "theme",
    "resume",
    "contact",
    "history",
    "ls",
    "goto",
    "echo",
    "clear",
    "exit",
    "quit",
    "!!",
  ];

  let openState = false;
  let maximizedState = false;
  let history = loadHistory();
  let historyPointer = history.length;
  let pointerDownInsideBody = false;
  let draggedInsideBody = false;

  const listSections = () => [
    "about",
    "impact",
    "staff",
    "experience",
    "projects",
    "skills",
    "resume",
    "contact",
  ];

  function writeLine(html, className = "") {
    const line = document.createElement("div");
    line.className = `termLine ${className}`.trim();
    line.innerHTML = html;
    output.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function print(text, className = "") {
    writeLine(escapeHtml(text), className);
  }

  function printCommand(raw) {
    writeLine(
      `<span class="termPrompt">${escapeHtml(prompt.textContent)}</span> <span class="termCmd">${escapeHtml(raw)}</span>`,
    );
  }

  function focusInput({ preventScroll = false } = {}) {
    try {
      if (preventScroll) {
        input.focus({ preventScroll: true });
      } else {
        input.focus();
      }
    } catch {
      input.focus();
    }
  }

  function focusables() {
    return [
      ...overlay.querySelectorAll("input, button, [href], [tabindex]:not([tabindex='-1'])"),
    ].filter((node) => !node.hasAttribute("disabled"));
  }

  function onTrapTab(event) {
    if (!openState || event.key !== "Tab") {
      return;
    }

    if (document.activeElement === input) {
      event.preventDefault();
      return;
    }

    const nodes = focusables();
    if (!nodes.length) {
      return;
    }

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setPrompt() {
    const firstName = profile.name.split(" ")[0].toLowerCase();
    const host = shell?.terminalPromptHost || "portfolio";
    prompt.textContent = `${firstName}@${host}:~$`;
  }

  function renderMaxButton() {
    maxButton.innerHTML = maximizedState
      ? '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 4h12v12"></path><path d="M16 8h-8v12h12v-8"></path></svg>'
      : '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>';

    maxButton.setAttribute(
      "aria-label",
      maximizedState ? "Restore terminal size" : "Maximize terminal",
    );
    maxButton.setAttribute("title", maximizedState ? "Restore terminal size" : "Maximize terminal");
    maxButton.setAttribute("aria-pressed", maximizedState ? "true" : "false");
  }

  function setMaximized(next) {
    maximizedState = Boolean(next);
    terminal.classList.toggle("terminal--maximized", maximizedState);
    renderMaxButton();
  }

  function open() {
    if (openState) {
      return;
    }

    openState = true;
    overlay.dataset.open = "true";
    overlay.setAttribute("aria-hidden", "false");
    input.value = "";

    window.setTimeout(() => {
      focusInput();
    }, 0);

    document.addEventListener("keydown", onTrapTab);
  }

  function close() {
    if (!openState) {
      return;
    }

    openState = false;
    setMaximized(false);
    overlay.dataset.open = "false";
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onTrapTab);
  }

  function toggle() {
    if (openState) {
      close();
    } else {
      open();
    }
  }

  function printIdentity() {
    print(`${profile.name} - ${profile.headlineRole} (${profile.location})`);
    print("");
    if (profile.summary) {
      print(profile.summary);
    }

    if (profile.taglines?.length) {
      print(profile.taglines[0]);
    }

    print("");
    print(`GitHub: ${profile.social.github}`);
    print(`LinkedIn: ${profile.social.linkedin}`);
  }

  function printImpact() {
    impact.forEach((metric) => {
      print(`${metric.value}  ${metric.label} - ${metric.desc}`);
    });
  }

  function printExperience(filter) {
    const query = normalize(filter);
    const matched = experience.filter((entry) => {
      if (!query) {
        return true;
      }

      const blob = normalize(
        [entry.company, entry.location, entry.period, ...(entry.tags || [])].join(" "),
      );
      return blob.includes(query);
    });

    if (!matched.length) {
      print(`No matches for "${filter}"`, "termErr");
      return;
    }

    matched.forEach((entry) => {
      print(`${entry.company} - ${entry.period} (${entry.location})`, "termOk");
      entry.roles.forEach((role) => {
        print(`  - ${role.title}  |  ${role.period}`, "termLine--dim");
      });
    });
  }

  function printProjects(filter) {
    const query = normalize(filter);
    const matched = projects.filter((entry) => {
      if (!query) {
        return true;
      }

      const blob = normalize([entry.title, entry.desc, ...(entry.tags || [])].join(" "));
      return blob.includes(query);
    });

    if (!matched.length) {
      print(`No projects match "${filter}"`, "termErr");
      return;
    }

    matched.forEach((entry, index) => {
      print(`[${index + 1}] ${entry.title} - ${entry.period}`);
    });

    print("Tip: open <index>", "termLine--dim");
  }

  function openProject(argument) {
    if (!argument) {
      print("Usage: open <index|name>", "termErr");
      return;
    }

    const normalized = normalize(argument);
    const numericIndex = Number(normalized);

    let project;

    if (!Number.isNaN(numericIndex) && numericIndex >= 1 && numericIndex <= projects.length) {
      project = projects[numericIndex - 1];
    } else {
      project = projects.find((entry) => normalize(entry.title).includes(normalized));
    }

    if (!project) {
      print(`Project not found: ${argument}`, "termErr");
      return;
    }

    onOpenProject?.(project);
  }

  function printSkills(argument) {
    const query = normalize(argument);

    if (!query) {
      print("Skill categories:", "termOk");
      skills.forEach((category) => {
        print(`- ${category.name} (${category.level}/10)`, "termLine--dim");
      });
      print("Tip: skills aws", "termLine--dim");
      return;
    }

    const category = skills.find((entry) => normalize(entry.name).includes(query));
    if (!category) {
      print(`No skill category: ${argument}`, "termErr");
      return;
    }

    print(`${category.name} (${category.level}/10)`, "termOk");
    category.subSkills?.forEach((skill) => {
      print(`- ${skill.name} (${skill.level}/10)`, "termLine--dim");
    });
  }

  function printRadar() {
    const model = window.__radarModel;
    if (!model) {
      print(
        "Ship Radar not loaded yet. Scroll to the top section or wait a second, then try again.",
        "termDim",
      );
      return;
    }

    print("Ship Radar / Website Info", "termOk");
    print(`Version: ${model.version}`, "termLine--dim");
    print(`Last Updated: ${model.lastUpdated}`, "termLine--dim");
    print(`Deployed By: ${model.deployedBy}`, "termLine--dim");
    print(`Stars: ${model.stars ?? " - "}`, "termLine--dim");
    print(`Forks: ${model.forks ?? " - "}`, "termLine--dim");
    print(`Open Issues: ${model.openIssues ?? " - "}`, "termLine--dim");
    print(`Open PRs: ${model.openPRs ?? " - "}`, "termLine--dim");

    if (Array.isArray(model.languagesUsed) && model.languagesUsed.length) {
      print(`Languages Used: ${model.languagesUsed.join(", ")}`, "termLine--dim");
    } else {
      print("Languages Used:  - ", "termLine--dim");
    }

    print(`Live: ${model.siteUrl}`, "termLine--dim");
    print(`Repo: ${model.repoUrl}`, "termLine--dim");
    if (model.coverageUrl) {
      print(`Coverage: ${model.coverageUrl}`, "termLine--dim");
    }
  }

  function setTheme(argument) {
    if (!argument) {
      print("Themes:", "termOk");
      themes.forEach((theme) => {
        print(`- ${theme.id}`, "termLine--dim");
      });
      return;
    }

    const themeId = normalize(argument);
    const exists = themes.some((theme) => theme.id === themeId);

    if (!exists) {
      print(`Unknown theme: ${argument}`, "termErr");
      return;
    }

    onThemeSet?.(themeId);
    toast.show(`Theme: ${themeId}`);
  }

  function printHistory(argument = "") {
    const matcher = String(argument).match(/--grep\s+(.+)/i);
    const grep = matcher?.[1] ? normalize(matcher[1]) : "";
    const tail = history.slice(-20);

    if (!tail.length) {
      print("No history yet.", "termWarn");
      return;
    }

    const numbered = tail.map((value, index) => ({
      number: history.length - tail.length + index + 1,
      value,
    }));

    const filtered = grep
      ? numbered.filter((entry) => normalize(entry.value).includes(grep))
      : numbered;
    if (!filtered.length) {
      print(`No history matches "${matcher?.[1] || ""}"`, "termWarn");
      return;
    }

    filtered.forEach((entry) => {
      print(`${entry.number}  ${entry.value}`, "termLine--dim");
    });
  }

  function printSections() {
    print("Sections:", "termOk");
    listSections().forEach((section) => {
      print(`- ${section}`, "termLine--dim");
    });
    print("Tip: goto projects", "termLine--dim");
  }

  function gotoSection(argument) {
    const query = normalize(argument);
    if (!query) {
      print("Usage: goto <section>", "termErr");
      return;
    }

    const section = listSections().find((name) => normalize(name).includes(query));
    if (!section) {
      print(`Unknown section: ${argument}`, "termErr");
      return;
    }

    const routeMap = {
      about: "#overview",
      impact: "#impact",
      staff: "#staff",
      experience: "#experience",
      projects: "#projects",
      skills: "#skills",
      resume: "#resume",
      contact: "#contact",
    };

    onNavigate?.(routeMap[section] || "#overview");
  }

  function printContact() {
    writeLine(
      `Email: <a class="termLink" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>`,
    );
    writeLine(
      `GitHub: <a class="termLink" target="_blank" rel="noreferrer" href="${escapeHtml(profile.social.github)}">${escapeHtml(
        profile.social.github,
      )}</a>`,
    );
    writeLine(
      `LinkedIn: <a class="termLink" target="_blank" rel="noreferrer" href="${escapeHtml(
        profile.social.linkedin,
      )}">${escapeHtml(profile.social.linkedin)}</a>`,
    );
  }

  function expandHistory(raw) {
    const line = raw.trim();

    if (line === "!!") {
      return history.length ? history[history.length - 1] : null;
    }

    if (/^!\d+$/.test(line)) {
      const index = Number(line.slice(1)) - 1;
      if (!Number.isFinite(index) || index < 0 || index >= history.length) {
        return undefined;
      }
      return history[index];
    }

    return line;
  }

  function execute(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return;
    }

    const expanded = expandHistory(trimmed);
    if (expanded === null) {
      print("No previous command.", "termErr");
      return;
    }

    if (expanded === undefined) {
      print(`No such history entry: ${trimmed}`, "termErr");
      return;
    }

    history.push(expanded);
    historyPointer = history.length;
    saveHistory(history);

    printCommand(expanded);

    const [rawCommand, ...argTokens] = expanded.split(/\s+/);
    const command = normalize(rawCommand);
    const argument = argTokens.join(" ");

    switch (command) {
      case "help":
      case "?":
        writeLine('<span class="termOk">Terminal Manual</span>');
        writeLine(renderManual(), "termLine--manual");
        break;
      case "about":
      case "whoami":
        printIdentity();
        break;
      case "impact":
        printImpact();
        break;
      case "experience":
      case "xp":
        printExperience(argument);
        break;
      case "projects":
      case "proj":
        printProjects(argument);
        break;
      case "open":
        openProject(argument);
        break;
      case "skills":
        printSkills(argument);
        break;
      case "radar":
      case "ship":
        printRadar();
        break;
      case "theme":
        setTheme(argument);
        break;
      case "resume":
        onNavigate?.("#resume");
        break;
      case "contact":
        printContact();
        break;
      case "history":
        printHistory(argument);
        break;
      case "ls":
        printSections();
        break;
      case "goto":
        gotoSection(argument);
        break;
      case "echo":
        print(argument || "");
        break;
      case "clear":
        output.innerHTML = "";
        break;
      case "exit":
      case "quit":
        close();
        break;
      default:
        print(`Unknown command: ${rawCommand}. Try: help`, "termErr");
    }
  }

  function completeInput() {
    const value = input.value;
    const segments = value.split(/\s+/);
    const commandFragment = segments[0] || "";
    const command = normalize(commandFragment);

    if (segments.length <= 1 && !value.endsWith(" ")) {
      const suggestions = commandNames.filter((name) => name.startsWith(command));
      if (suggestions.length === 1) {
        input.value = `${suggestions[0]} `;
      } else if (suggestions.length > 1) {
        print(suggestions.join("  "), "termLine--dim");
      }
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    const argument = normalize(segments.slice(1).join(" "));

    if (command === "theme") {
      const matches = themes
        .map((theme) => theme.id)
        .filter((themeId) => themeId.startsWith(argument));
      if (matches.length === 1) {
        input.value = `theme ${matches[0]}`;
      } else if (matches.length > 1) {
        print(matches.join("  "), "termLine--dim");
      }
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (command === "skills") {
      const matches = skills
        .map((entry) => entry.name)
        .filter((name) => normalize(name).startsWith(argument));
      if (matches.length === 1) {
        input.value = `skills ${matches[0]}`;
      } else if (matches.length > 1) {
        print(matches.join("  "), "termLine--dim");
      }
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (command === "goto") {
      const matches = listSections().filter((name) => name.startsWith(argument));
      if (matches.length === 1) {
        input.value = `goto ${matches[0]}`;
      } else if (matches.length > 1) {
        print(matches.join("  "), "termLine--dim");
      }
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (command === "open") {
      const options = projects.map((project, index) => ({
        index: String(index + 1),
        title: project.title,
      }));
      const matches = options
        .filter(
          (option) =>
            option.index.startsWith(argument) || normalize(option.title).includes(argument),
        )
        .slice(0, 8);

      if (matches.length === 1) {
        input.value = `open ${matches[0].index}`;
      } else if (matches.length > 1) {
        print(matches.map((match) => `${match.index}:${match.title}`).join("  "), "termLine--dim");
      }
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = input.value;
      input.value = "";
      execute(value);
      return;
    }

    if (event.ctrlKey && (event.key === "c" || event.key === "C" || event.code === "KeyC")) {
      event.preventDefault();
      if (input.value) {
        input.value = "";
      } else {
        printCommand("^C");
      }
      historyPointer = history.length;
      return;
    }

    if (event.ctrlKey && event.code === "Space") {
      event.preventDefault();
      writeLine('<span class="termOk">Terminal Manual</span>');
      writeLine(renderManual(), "termLine--manual");
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
      completeInput();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      historyPointer = Math.max(0, historyPointer - 1);
      input.value = history[historyPointer] || "";
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      historyPointer = Math.min(history.length, historyPointer + 1);
      input.value = history[historyPointer] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-close='terminal']")) {
      close();
    }
  });

  maxButton.addEventListener("click", () => {
    setMaximized(!maximizedState);
    focusInput({ preventScroll: true });
  });

  body.addEventListener("mousedown", (event) => {
    if (event.button !== 0) {
      return;
    }

    pointerDownInsideBody = true;
    draggedInsideBody = false;
  });

  body.addEventListener("mousemove", () => {
    if (pointerDownInsideBody) {
      draggedInsideBody = true;
    }
  });

  window.addEventListener("mouseup", () => {
    pointerDownInsideBody = false;
  });

  body.addEventListener("click", () => {
    const selection = window.getSelection?.();
    const hasSelection = Boolean(
      selection && !selection.isCollapsed && body.contains(selection.anchorNode),
    );
    const draggedSelection = draggedInsideBody && hasSelection;
    draggedInsideBody = false;

    if (!draggedSelection) {
      focusInput({ preventScroll: true });
    }
  });

  openButton?.addEventListener("click", open);

  window.addEventListener("keydown", (event) => {
    if (hasTypingFocus(event.target)) {
      return;
    }

    if (event.key === "~" || event.key === "`") {
      event.preventDefault();
      toggle();
    }
  });

  setPrompt();
  renderMaxButton();
  writeLine(
    '<span class="termOk">Welcome.</span> Type <span class="termCmd">help</span> to see commands.',
  );

  return {
    open,
    close,
    toggle,
    run: execute,
  };
}
