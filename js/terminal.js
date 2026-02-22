import { normalize, escapeHtml } from "./utils.js";

export function initTerminal({
  profile,
  impact,
  experience,
  projects,
  skills,
  themePresets,
  onNavigate,
  onOpenProject,
  onSetTheme,
  toast,
  overlayId = "terminalOverlay",
  openBtnId = "terminalBtn",
  bodyId = "terminalBody",
  outputId = "terminalOutput",
  inputId = "terminalInput",
  promptId = "terminalPrompt",
} = {}) {
  const overlay = document.getElementById(overlayId);
  const terminal = overlay?.querySelector(".terminal") || null;
  const openBtn = document.getElementById(openBtnId);
  const maxBtn = document.getElementById("terminalMaxBtn");
  const body = document.getElementById(bodyId);
  const output = document.getElementById(outputId) || body;
  const input = document.getElementById(inputId);
  const prompt = document.getElementById(promptId);

  if (!overlay || !body || !input || !prompt) {
    return { open() {}, close() {}, toggle() {} };
  }

  let isOpen = false;
  let isMaximized = false;
  const HISTORY_KEY = "ajinkyaos.term.history";
  let history = loadHistory();
  let historyIdx = history.length;

  const focusables = () =>
    [...overlay.querySelectorAll("input, button, [href], [tabindex]:not([tabindex='-1'])")].filter(
      (el) => !el.hasAttribute("disabled")
    );

  const trapTab = (e) => {
    if (!isOpen || e.key !== "Tab") return;
    if (document.activeElement === input) {
      e.preventDefault();
      return;
    }
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const write = (html, cls = "") => {
    const line = document.createElement("div");
    line.className = `termLine ${cls}`.trim();
    line.innerHTML = html;
    output.appendChild(line);
    body.scrollTop = body.scrollHeight;
  };

  const print = (text, cls = "") => write(escapeHtml(text), cls);

  const printCmd = (raw) => {
    write(
      `<span class="termPrompt">${escapeHtml(prompt.textContent)}</span> <span class="termCmd">${escapeHtml(raw)}</span>`
    );
  };

  
  
  const COMMAND_DEFS = [
    { group:"Basics", cmd:"help", aliases:["?","Ctrl+Space"], usage:"help", desc:"Show the terminal manual." },
    { group:"Basics", cmd:"clear", usage:"clear", desc:"Clear terminal output." },
    { group:"Basics", cmd:"exit", aliases:["quit","Esc"], usage:"exit", desc:"Close terminal." },

    { group:"Navigation", cmd:"ls", usage:"ls", desc:"List all sections you can jump to." },
    { group:"Navigation", cmd:"goto", usage:"goto <section>", desc:"Jump to a section (home, impact, staff, experience, projects, skills, contact)." },

    { group:"Portfolio", cmd:"about", aliases:["whoami"], usage:"about", desc:"Quick profile summary." },
    { group:"Portfolio", cmd:"impact", usage:"impact", desc:"Show impact metrics." },
    { group:"Portfolio", cmd:"experience", aliases:["xp"], usage:"experience [filter]", desc:"List experience entries (optional filter by keyword)." },
    { group:"Portfolio", cmd:"projects", aliases:["proj"], usage:"projects [filter]", desc:"List projects (optional filter by keyword)." },
    { group:"Portfolio", cmd:"open", usage:"open <index|name>", desc:"Open a project by index or fuzzy name match." },
    { group:"Portfolio", cmd:"skills", usage:"skills [category]", desc:"Show skills, optionally for one category." },
    { group:"Portfolio", cmd:"radar", aliases:["ship"], usage:"radar", desc:"Show the Ship Radar / Website Info in terminal." },

    { group:"Personal", cmd:"resume", usage:"resume", desc:"Open resume PDF." },
    { group:"Personal", cmd:"contact", usage:"contact", desc:"Show contact info + copy shortcuts." },

    { group:"Customization", cmd:"theme", usage:"theme [name]", desc:"List themes or switch theme." },

    { group:"Utilities", cmd:"history", usage:"history [--grep <text>]", desc:"Show recent commands, optionally filtered." },
    { group:"Utilities", cmd:"!!", usage:"!!", desc:"Repeat the last command." },
    { group:"Utilities", cmd:"!<n>", usage:"!12", desc:"Run command #n from history." },
    { group:"Utilities", cmd:"echo", usage:"echo <text>", desc:"Print text." },
  ];

  const GROUP_ORDER = ["Basics","Navigation","Portfolio","Personal","Customization","Utilities"];

  const help = () => {
    write(`<span class="termOk">Terminal Manual</span>`, "");
    const byGroup = new Map();
    for (const d of COMMAND_DEFS) {
      const g = d.group || "Other";
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g).push(d);
    }
    const groups = [...byGroup.keys()].sort(
      (a, b) =>
        (GROUP_ORDER.indexOf(a) === -1 ? 999 : GROUP_ORDER.indexOf(a)) -
        (GROUP_ORDER.indexOf(b) === -1 ? 999 : GROUP_ORDER.indexOf(b))
    );

    const groupHtml = groups
      .map((g) => {
        const rows = byGroup
          .get(g)
          .map((d) => {
            const aliases = d.aliases?.length
              ? `<span class="termManual__aliases">${d.aliases
                  .map((a) => `<span class="termManual__chip">${escapeHtml(a)}</span>`)
                  .join("")}</span>`
              : "";
            return `<div class="termManual__row"><div class="termManual__left"><span class="termCmd">${escapeHtml(d.usage || d.cmd)}</span>${aliases}</div><div class="termManual__right termDim">${escapeHtml(d.desc || "")}</div></div>`;
          })
          .join("");
        return `<section class="termManual__group" aria-label="${escapeHtml(g)}"><h4 class="termManual__h">${escapeHtml(g)}</h4>${rows}</section>`;
      })
      .join("");

    const manual = `<div class="termManual">${groupHtml}<div class="termManual__foot termDim"><span class="termCmd">Tip:</span> type any command and press Enter.</div></div>`;
    write(manual, "termLine--manual");
  };


  const open = () => {
    if (isOpen) return;
    isOpen = true;
    overlay.setAttribute("data-open", "true");
    overlay.setAttribute("aria-hidden", "false");
    input.value = "";
    setTimeout(() => input.focus(), 0);
    document.addEventListener("keydown", trapTab);
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    setMaximized(false);
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", trapTab);
  };

  const toggle = () => (isOpen ? close() : open());

  const renderMaxButton = () => {
    if (!maxBtn) return;
    maxBtn.innerHTML = isMaximized
      ? '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 4h12v12"></path><path d="M16 8h-8v12h12v-8"></path></svg>'
      : '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>';
    maxBtn.setAttribute("aria-label", isMaximized ? "Restore terminal size" : "Maximize terminal");
    maxBtn.setAttribute("title", isMaximized ? "Restore terminal size" : "Maximize terminal");
    maxBtn.setAttribute("aria-pressed", isMaximized ? "true" : "false");
  };

  const setMaximized = (next) => {
    isMaximized = !!next;
    terminal?.classList.toggle("terminal--maximized", isMaximized);
    renderMaxButton();
  };

    function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.slice(-50) : [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50)));
    } catch {}
  }

  function lastCommand() {
    return history.length ? history[history.length - 1] : "";
  }

  function listSections() {
    return [
      "about",
      "impact",
      "staff",
      "experience",
      "projects",
      "skills",
      "resume",
      "contact",
    ];
  }

  const COMMANDS = [
    "help","?","whoami","about","impact","experience","xp","projects","proj",
    "open","skills","theme","resume","contact","clear","exit","quit",
    "history","ls","goto","echo","!!","radar","ship"
  ];

function setPrompt() {
    prompt.textContent = `${profile.name.split(" ")[0].toLowerCase()}@portfolio:~$`;
  }

  function cmdIdentity() {
    // unified identity block for both `about` and `whoami`
    print(`${profile.name} — ${profile.role} (${profile.location})`);
    print("");
    if (profile.summary) print(profile.summary);
    if (Array.isArray(profile.taglines) && profile.taglines.length) print(profile.taglines[0]);
    print("");
    // quick links
    const links = [];
    if (profile.social?.github) links.push(`GitHub: ${profile.social.github}`);
    if (profile.social?.linkedin) links.push(`LinkedIn: ${profile.social.linkedin}`);
    if (profile.social?.twitter) links.push(`X: ${profile.social.twitter}`);
    if (profile.social?.website) links.push(`Website: ${profile.social.website}`);
    if (links.length) links.forEach(l => print(l));
  }


  function cmdImpact() {
    for (const i of impact) {
      print(`${i.value}  ${i.label} — ${i.desc}`);
    }
  }

  function cmdExperience(filter) {
    const q = normalize(filter);
    const items = experience.filter((x) => {
      if (!q) return true;
      const hay = normalize([x.company, x.location, x.period, ...(x.tags || [])].join(" "));
      return hay.includes(q);
    });

    if (items.length === 0) {
      print(`No matches for "${filter}"`, "termErr");
      return;
    }

    items.forEach((x) => {
      print(`${x.company} — ${x.period} (${x.location})`, "termOk");
      x.roles.forEach((r) => {
        print(`  - ${r.title} · ${r.period}`, "termLine--dim");
      });
    });
  }

  function cmdProjects(filter) {
    const q = normalize(filter);
    const items = projects.filter((p) => {
      if (!q) return true;
      const hay = normalize([p.title, p.desc, ...(p.tags || [])].join(" "));
      return hay.includes(q);
    });

    if (items.length === 0) {
      print(`No projects match "${filter}"`, "termErr");
      return;
    }

    items.forEach((p, idx) => {
      print(`[${idx + 1}] ${p.title} — ${p.period}`);
    });
    print(`Tip: open <index>`, "termLine--dim");
  }

  function cmdOpen(arg) {
    if (!arg) {
      print("Usage: open <index|name>", "termErr");
      return;
    }

    const q = normalize(arg);
    let p = null;

    const asNum = Number(q);
    if (!Number.isNaN(asNum) && asNum >= 1 && asNum <= projects.length) {
      p = projects[asNum - 1];
    } else {
      p = projects.find((x) => normalize(x.title).includes(q));
    }

    if (!p) {
      print(`Project not found: ${arg}`, "termErr");
      return;
    }

    onOpenProject?.(p);
  }

  function cmdSkills(arg) {
    const q = normalize(arg);
    if (!q) {
      print("Skill categories:", "termOk");
      skills.forEach((s) => print(`- ${s.name} (${s.level}/10)`, "termLine--dim"));
      print("Tip: skills aws", "termLine--dim");
      return;
    }

    const cat = skills.find((s) => normalize(s.name).includes(q));
    if (!cat) {
      print(`No skill category: ${arg}`, "termErr");
      return;
    }

    print(`${cat.name} (${cat.level}/10)`, "termOk");
    cat.subSkills?.forEach((ss) => print(`- ${ss.name} (${ss.level}/10)`, "termLine--dim"));
  }

  
  function cmdRadar() {
    const m = (() => {
      try { return window.__radarModel; } catch { return null; }
    })();
    if (!m) {
      print("Ship Radar not loaded yet. Scroll to the top section or wait a second, then try again.", "termDim");
      return;
    }
    print("Ship Radar / Website Info", "termOk");
    print(`Version: ${m.version}`, "termLine--dim");
    print(`Last Updated: ${m.lastUpdated}`, "termLine--dim");
    print(`Deployed By: ${m.deployedBy}`, "termLine--dim");
    print(`Stars: ${m.stars ?? "—"}`, "termLine--dim");
    print(`Forks: ${m.forks ?? "—"}`, "termLine--dim");
    print(`Open Issues: ${m.openIssues ?? "—"}`, "termLine--dim");
    print(`Open PRs: ${m.openPRs ?? "—"}`, "termLine--dim");
    if (Array.isArray(m.languagesUsed) && m.languagesUsed.length) {
      print(`Languages Used: ${m.languagesUsed.join(", ")}`, "termLine--dim");
    } else {
      print(`Languages Used: —`, "termLine--dim");
    }
    print(`Live: ${m.siteUrl}`, "termLine--dim");
    print(`Repo: ${m.repoUrl}`, "termLine--dim");
  }

function cmdTheme(arg) {
    if (!arg) {
      print("Themes:", "termOk");
      themePresets.forEach((t) => print(`- ${t.id}`, "termLine--dim"));
      return;
    }

    const id = normalize(arg);
    const exists = themePresets.some((t) => t.id === id);
    if (!exists) {
      print(`Unknown theme: ${arg}`, "termErr");
      return;
    }

    onSetTheme?.(id);
    toast?.(`Theme: ${id}`);
  }

  function cmdHistory(arg = "") {
    const m = String(arg || "").match(/--grep\s+(.+)/i);
    const grep = m?.[1] ? normalize(m[1]) : "";
    const tail = history.slice(-20);
    if (!tail.length) { print("No history yet.", "termWarn"); return; }

    const filtered = grep
      ? tail
          .map((h, i) => ({ n: history.length - tail.length + i + 1, h }))
          .filter((x) => normalize(x.h).includes(grep))
      : tail.map((h, i) => ({ n: history.length - tail.length + i + 1, h }));

    if (!filtered.length) {
      print(`No history matches "${m?.[1] || ""}"`, "termWarn");
      return;
    }

    filtered.forEach((x) => print(`${x.n}  ${x.h}`, "termLine--dim"));
  }

  function cmdLs() {
    print("Sections:", "termOk");
    listSections().forEach((s) => print(`- ${s}`, "termLine--dim"));
    print("Tip: goto projects", "termLine--dim");
  }

  function cmdGoto(arg) {
    const q = normalize(arg);
    if (!q) { print("Usage: goto <section>", "termErr"); return; }
    const sec = listSections().find((s) => normalize(s).includes(q));
    if (!sec) { print(`Unknown section: ${arg}`, "termErr"); return; }
    const map = {
      about: "#overview",
      impact: "#impact",
      staff: "#staff",
      experience: "#experience",
      projects: "#projects",
      skills: "#skills",
      resume: "#resume",
      contact: "#contact",
    };
    onNavigate?.(map[sec] || "#overview");
  }

  function cmdEcho(arg) {
    print(arg || "");
  }

  function cmdContact() {
    write(
      `Email: <a class="termLink" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>`
    );
    write(
      `GitHub: <a class="termLink" target="_blank" rel="noreferrer" href="${escapeHtml(profile.social.github)}">${escapeHtml(profile.social.github)}</a>`
    );
    write(
      `LinkedIn: <a class="termLink" target="_blank" rel="noreferrer" href="${escapeHtml(profile.social.linkedin)}">${escapeHtml(profile.social.linkedin)}</a>`
    );
  }

  function run(raw) {
    let line = raw.trim();
    if (!line) return;

    // history expansion
    if (line === "!!") {
      line = lastCommand();
      if (!line) { print("No previous command.", "termErr"); return; }
    } else if (/^!\d+$/.test(line)) {
      const n = Number(line.slice(1));
      const idx = n - 1;
      if (!Number.isFinite(idx) || idx < 0 || idx >= history.length) { print(`No such history entry: ${line}`, "termErr"); return; }
      line = history[idx];
    }

    history.push(line);
    historyIdx = history.length;
    saveHistory();

    printCmd(line);

    const [cmdRaw, ...rest] = line.split(/\s+/);
    const cmd = normalize(cmdRaw);
    const arg = rest.join(" ");

    switch (cmd) {
      case "help":
      case "?":
        help();
        break;
      case "whoami":
      case "about":
        cmdIdentity();
        break;
      case "impact":
        cmdImpact();
        break;
      case "experience":
      case "xp":
        cmdExperience(arg);
        break;
      case "projects":
      case "proj":
        cmdProjects(arg);
        break;
      case "open":
        cmdOpen(arg);
        break;
      case "skills":
        cmdSkills(arg);
        break;
      case "radar":
      case "ship":
        cmdRadar();
        break;
      case "theme":
        cmdTheme(arg);
        break;
      case "resume":
        onNavigate?.("#resume");
        break;
      case "contact":
        cmdContact();
        break;
      case "history":
        cmdHistory(arg);
        break;
      case "ls":
        cmdLs();
        break;
      case "goto":
        cmdGoto(arg);
        break;
      case "echo":
        cmdEcho(arg);
        break;
      case "clear":
        output.innerHTML = "";
        break;
      case "exit":
      case "quit":
        close();
        break;
      default:
        print(`Unknown command: ${cmdRaw}. Try: help`, "termErr");
    }
  }

  // Input handling
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = input.value;
      input.value = "";
      run(v);
      return;
    }

    // Ctrl+C: cancel current line (clear input)
    if (e.ctrlKey && (e.key === "c" || e.key === "C" || e.code === "KeyC")) {
      e.preventDefault();
      if (input.value && input.value.length) {
        input.value = "";
      } else {
        printCmd("^C");
      }
      historyIdx = history.length;
      return;
    }

    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();
      help();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      const v = input.value;
      const parts = v.split(/\s+/);
      const head = parts[0] || "";
      const tail = parts.slice(1).join(" ");
      const headNorm = normalize(head);

      // complete command name
      if (parts.length <= 1 && !v.endsWith(" ")) {
        const opts = COMMANDS.filter((c) => c.startsWith(headNorm));
        if (opts.length === 1) {
          input.value = opts[0] + " ";
          input.setSelectionRange(input.value.length, input.value.length);
          return;
        }
        if (opts.length > 1) {
          print(opts.join("  "), "termLine--dim");
          return;
        }
      }

      // second-arg completions
      const cmd = headNorm;
      const arg = tail;
      const argNorm = normalize(arg);

      if (cmd === "theme") {
        const opts = themePresets.map((t) => t.id).filter((id) => id.startsWith(argNorm));
        if (opts.length === 1) input.value = `theme ${opts[0]}`;
        else if (opts.length > 1) print(opts.join("  "), "termLine--dim");
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      }

      if (cmd === "skills") {
        const opts = skills.map((s) => s.name).filter((n) => normalize(n).startsWith(argNorm));
        if (opts.length === 1) input.value = `skills ${opts[0]}`;
        else if (opts.length > 1) print(opts.join("  "), "termLine--dim");
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      }

      if (cmd === "goto") {
        const opts = listSections().filter((s) => s.startsWith(argNorm));
        if (opts.length === 1) input.value = `goto ${opts[0]}`;
        else if (opts.length > 1) print(opts.join("  "), "termLine--dim");
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      }

      if (cmd === "open") {
        const opts = projects.map((p, i) => ({ k: String(i + 1), t: p.title }));
        const hits = opts.filter((o) => o.k.startsWith(argNorm) || normalize(o.t).includes(argNorm)).slice(0, 8);
        if (hits.length === 1) input.value = `open ${hits[0].k}`;
        else if (hits.length > 1) print(hits.map((h) => `${h.k}:${h.t}`).join("  "), "termLine--dim");
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      }
    }


    if (e.key === "ArrowUp") {
      e.preventDefault();
      historyIdx = Math.max(0, historyIdx - 1);
      input.value = history[historyIdx] || "";
      // move caret to end
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIdx = Math.min(history.length, historyIdx + 1);
      input.value = history[historyIdx] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  // Overlay close
  overlay.addEventListener("click", (e) => {
    const closer = e.target.closest("[data-close='terminal']");
    if (closer) close();
  });

  maxBtn?.addEventListener("click", () => {
    setMaximized(!isMaximized);
    input.focus();
  });

  body.addEventListener("click", () => {
    input.focus();
  });

  openBtn?.addEventListener("click", open);

  // Global shortcut: ~
  window.addEventListener("keydown", (e) => {
    const tag = (e.target?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;
    if (typing) return;

    // Avoid interfering with command palette.
    if (e.key === "~" || e.key === "`") {
      e.preventDefault();
      toggle();
    }
  });

  setPrompt();
  renderMaxButton();

  // Welcome
  write(`<span class="termOk">Welcome.</span> Type <span class="termCmd">help</span> to see commands.`, "");

  return { open, close, toggle, run };
}
