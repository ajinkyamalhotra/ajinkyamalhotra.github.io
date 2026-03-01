import { escapeHtml, normalize } from "@shared/utils/text.js";

function scoreAction(action, tokens) {
  const haystack = normalize(
    [action.label, action.meta, action.keywords].filter(Boolean).join(" "),
  );
  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

export function createCommandPaletteFeature({ actions }) {
  const overlay = document.getElementById("paletteOverlay");
  const input = document.getElementById("paletteInput");
  const list = document.getElementById("paletteList");
  const openButton = document.getElementById("paletteBtn");

  if (!overlay || !input || !list) {
    return { open() {}, close() {} };
  }

  let isOpen = false;
  let filteredActions = actions;
  let activeIndex = 0;

  const focusableNodes = () =>
    [...overlay.querySelectorAll("input, button, [href], [tabindex]:not([tabindex='-1'])")].filter(
      (node) => !node.hasAttribute("disabled"),
    );

  const trapTab = (event) => {
    if (!isOpen || event.key !== "Tab") {
      return;
    }

    const nodes = focusableNodes();
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
  };

  function renderList() {
    const visible = filteredActions.slice(0, 10);

    if (!visible.length) {
      list.innerHTML = `<li class="paletteItem" aria-disabled="true"><span class="paletteItem__label">No results</span><span class="paletteItem__meta">try a different query</span></li>`;
      return;
    }

    list.innerHTML = visible
      .map((action, index) => {
        const className = index === activeIndex ? "paletteItem paletteItem--active" : "paletteItem";
        return `
          <li class="${className}" role="option" aria-selected="${index === activeIndex}">
            <span class="paletteItem__label">${escapeHtml(action.label)}</span>
            <span class="paletteItem__meta">${escapeHtml(action.meta || "")}</span>
          </li>
        `;
      })
      .join("");
  }

  function filterActions(value) {
    const query = normalize(value);
    if (!query) {
      filteredActions = actions;
      activeIndex = 0;
      renderList();
      return;
    }

    const tokens = query.split(/\s+/).filter(Boolean);
    filteredActions = actions
      .map((action) => ({ action, score: scoreAction(action, tokens) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.action);

    activeIndex = 0;
    renderList();
  }

  function runActiveAction() {
    const action = filteredActions[activeIndex];
    if (!action) {
      return;
    }

    close();
    action.run?.();
  }

  function open() {
    if (isOpen) {
      return;
    }

    isOpen = true;
    overlay.dataset.open = "true";
    overlay.setAttribute("aria-hidden", "false");

    filteredActions = actions;
    activeIndex = 0;
    input.value = "";

    renderList();

    window.setTimeout(() => {
      input.focus();
    }, 0);

    document.addEventListener("keydown", trapTab);
  }

  function close() {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    overlay.dataset.open = "false";
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", trapTab);
  }

  list.addEventListener("click", (event) => {
    const item = event.target.closest("li");
    if (!item) {
      return;
    }

    const listIndex = [...list.children].indexOf(item);
    activeIndex = listIndex;
    runActiveAction();
  });

  input.addEventListener("input", () => {
    filterActions(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, Math.min(filteredActions.length, 10) - 1);
      renderList();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderList();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      runActiveAction();
    }
  });

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-close='palette']")) {
      close();
    }
  });

  openButton?.addEventListener("click", open);

  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (isOpen) {
        close();
      } else {
        open();
      }
    }
  });

  return { open, close };
}
