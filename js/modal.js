import { escapeHtml, copyToClipboard } from "./utils.js";

export function initProjectModal({
  overlayId = "modalOverlay",
  titleId = "modalTitle",
  bodyId = "modalBody",
  toast,
} = {}) {
  const overlay = document.getElementById(overlayId);
  const titleEl = document.getElementById(titleId);
  const bodyEl = document.getElementById(bodyId);

  if (!overlay || !titleEl || !bodyEl) {
    return { open() {}, close() {} };
  }

  let isOpen = false;
  let lastFocus = null;
  let currentProject = null;

  function open(project) {
    currentProject = project;
    isOpen = true;
    lastFocus = document.activeElement;

    titleEl.textContent = project.title;

    const tags = (project.tags || [])
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");

    const highlights = (project.highlights || [])
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join("");

    bodyEl.innerHTML = `
      <div class="modal__meta muted mono">${escapeHtml(project.period || "")}</div>
      <p>${escapeHtml(project.desc || "")}</p>

      ${highlights ? `<h3>Highlights</h3><ul>${highlights}</ul>` : ""}

      ${tags ? `<h3>Stack</h3><div class="tags">${tags}</div>` : ""}

      <div style="height:12px"></div>
      <div style="display:flex; flex-wrap:wrap; gap:10px;">
        ${project.link ? `<a class="btn btn--primary" target="_blank" rel="noreferrer" href="${escapeHtml(project.link)}">Open Repo</a>` : ""}
        <button class="btn btn--ghost" id="modalCopyLink" type="button">Copy link</button>
      </div>
    `;

    overlay.setAttribute("data-open", "true");
    overlay.setAttribute("aria-hidden", "false");

    // Wire copy button
    const copyBtn = document.getElementById("modalCopyLink");
    copyBtn?.addEventListener(
      "click",
      async () => {
        const ok = await copyToClipboard(project.link || window.location.href);
        toast?.(ok ? "Copied." : "Copy failed.");
      },
      { once: true }
    );

    // Focus close button
    const closeBtn = overlay.querySelector("[data-close='modal']") || overlay.querySelector("button");
    setTimeout(() => closeBtn?.focus?.(), 0);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("aria-hidden", "true");
    bodyEl.innerHTML = "";
    currentProject = null;
    lastFocus?.focus?.();
  }

  overlay.addEventListener("click", (e) => {
    const closer = e.target.closest("[data-close='modal']");
    if (closer) close();
  });

  window.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });

  return { open, close, getCurrent: () => currentProject };
}
