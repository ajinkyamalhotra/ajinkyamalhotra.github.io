import { normalize, escapeHtml } from "./utils.js";

export function initCommandPalette({
  actions = [],
  overlayId = "paletteOverlay",
  inputId = "paletteInput",
  listId = "paletteList",
  openBtnId = "paletteBtn",
} = {}) {
  const overlay = document.getElementById(overlayId);
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  const openBtn = document.getElementById(openBtnId);

  if (!overlay || !input || !list) {
    return { open() {}, close() {} };
  }

  let isOpen = false;
  let filtered = actions;
  let active = 0;

  function open() {
    if (isOpen) return;
    isOpen = true;
    overlay.setAttribute("data-open", "true");
    overlay.setAttribute("aria-hidden", "false");
    input.value = "";
    filtered = actions;
    active = 0;
    render();
    setTimeout(() => input.focus(), 0);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("aria-hidden", "true");
  }

  function render() {
    const max = 10;
    const items = filtered.slice(0, max);

    if (items.length === 0) {
      list.innerHTML = `<li class="paletteItem" aria-disabled="true"><span class="paletteItem__label">No results</span><span class="paletteItem__meta">try a different query</span></li>`;
      return;
    }

    list.innerHTML = items
      .map((a, idx) => {
        const activeClass = idx === active ? "paletteItem paletteItem--active" : "paletteItem";
        return `
          <li class="${activeClass}" role="option" aria-selected="${idx === active}">
            <span class="paletteItem__label">${escapeHtml(a.label)}</span>
            <span class="paletteItem__meta">${escapeHtml(a.meta || "")}</span>
          </li>
        `;
      })
      .join("");
  }

  function runActive() {
    const item = filtered[active];
    if (!item) return;
    close();
    try {
      item.run?.();
    } catch (e) {
      console.error("Command failed:", e);
    }
  }

  function filter(q) {
    const query = normalize(q);
    if (!query) {
      filtered = actions;
      active = 0;
      render();
      return;
    }

    const tokens = query.split(/\s+/).filter(Boolean);
    filtered = actions
      .map((a) => {
        const hay = normalize([a.label, a.meta, a.keywords].filter(Boolean).join(" "));
        const score = tokens.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
        return { a, score, hay };
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => x.a);

    active = 0;
    render();
  }

  // Click: list item
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const idx = [...list.children].indexOf(li);
    active = idx;
    runActive();
  });

  // Typing
  input.addEventListener("input", () => filter(input.value));

  // Keyboard navigation
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(active + 1, Math.min(filtered.length, 10) - 1);
      render();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(active - 1, 0);
      render();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    }
  });

  // Overlay close
  overlay.addEventListener("click", (e) => {
    const closer = e.target.closest("[data-close='palette']");
    if (closer) close();
  });

  // Open button
  openBtn?.addEventListener("click", open);

  // Keyboard shortcut
  window.addEventListener("keydown", (e) => {
    const tag = (e.target?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;

    // Ctrl+K (or Cmd+K)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (isOpen) close();
      else open();
      return;
    }

    // If palette is open, don't steal keys
    if (isOpen) return;
  });

  return { open, close };
}
