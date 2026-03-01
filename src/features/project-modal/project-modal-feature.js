import { copyText } from "@shared/services/clipboard-service.js";
import { escapeHtml } from "@shared/utils/text.js";

export function createProjectModalFeature({ toast }) {
  const overlay = document.getElementById("modalOverlay");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!overlay || !title || !body) {
    return {
      open() {},
      close() {},
      getCurrent() {
        return undefined;
      },
    };
  }

  let current;
  let openState = false;
  let previousActive;

  const focusables = () =>
    [...overlay.querySelectorAll("a, button, [href], [tabindex]:not([tabindex='-1'])")].filter(
      (node) => !node.hasAttribute("disabled"),
    );

  const onTrapTab = (event) => {
    if (!openState || event.key !== "Tab") {
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
  };

  function close() {
    if (!openState) {
      return;
    }

    openState = false;
    current = undefined;
    overlay.dataset.open = "false";
    overlay.setAttribute("aria-hidden", "true");
    body.innerHTML = "";

    document.removeEventListener("keydown", onTrapTab);
    previousActive?.focus?.();
  }

  async function onCopyLink() {
    const value = current?.link || window.location.href;
    const success = await copyText(value);
    toast.show(success ? "Copied." : "Copy failed.");
  }

  function open(project) {
    current = project;
    openState = true;
    previousActive = document.activeElement;

    title.textContent = project.title;

    const highlights = (project.highlights || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    const tags = (project.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    body.innerHTML = `
      <div class="modal__meta muted mono">${escapeHtml(project.period || "")}</div>
      <p>${escapeHtml(project.desc || "")}</p>
      ${highlights ? `<h3>Highlights</h3><ul>${highlights}</ul>` : ""}
      ${tags ? `<h3>Stack</h3><div class="tags">${tags}</div>` : ""}
      <div class="modal__actions">
        ${project.link ? `<a class="btn btn--primary" target="_blank" rel="noreferrer" href="${escapeHtml(project.link)}">Open Repo</a>` : ""}
        <button class="btn btn--ghost" id="projectModalCopyLink" type="button">Copy link</button>
      </div>
    `;

    body
      .querySelector("#projectModalCopyLink")
      ?.addEventListener("click", onCopyLink, { once: true });

    overlay.dataset.open = "true";
    overlay.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onTrapTab);

    window.setTimeout(() => {
      overlay.querySelector("[data-close='modal']")?.focus?.();
    }, 0);
  }

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-close='modal']")) {
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (!openState || event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    close();
  });

  return {
    open,
    close,
    getCurrent() {
      return current;
    },
  };
}
