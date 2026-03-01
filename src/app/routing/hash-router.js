import { qsa } from "@shared/utils/dom.js";

export function createHashRouter({
  topbarId = "topbar",
  sectionSelector = "main section[id]",
} = {}) {
  const topbar = document.getElementById(topbarId);

  function scrollToHash(hash, options = {}) {
    const { smooth = true } = options;
    const id = String(hash || "").replace("#", "");
    if (!id) {
      return;
    }

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const offset = (topbar?.offsetHeight || 0) + 10;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: smooth && !reduced ? "smooth" : "auto",
    });
  }

  function bindLinks() {
    qsa("a[data-nav]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        if (!href.startsWith("#")) {
          return;
        }

        event.preventDefault();
        history.pushState(null, "", href);
        scrollToHash(href);
      });
    });
  }

  function trackActiveSection() {
    const links = qsa(".nav a[data-nav]");
    const sections = qsa(sectionSelector);

    if (!sections.length || !links.length) {
      return;
    }

    const update = () => {
      const offset = (topbar?.offsetHeight || 0) + 20;
      const currentY = window.scrollY + offset;
      let activeSectionId = sections[0].id;

      for (const section of sections) {
        const start = section.offsetTop;
        const end = start + section.offsetHeight;

        if (currentY >= start && currentY < end) {
          activeSectionId = section.id;
          break;
        }

        if (currentY >= start) {
          activeSectionId = section.id;
        }
      }

      const route = `#${activeSectionId}`;
      links.forEach((link) => {
        const isActive = link.getAttribute("href") === route;
        link.classList.toggle("nav--active", isActive);
      });

      history.replaceState(null, "", route);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    update();

    if (window.location.hash) {
      window.setTimeout(() => {
        scrollToHash(window.location.hash, { smooth: false });
      }, 0);
      window.setTimeout(update, 20);
    }
  }

  return {
    init() {
      bindLinks();
      trackActiveSection();
    },
    scrollToHash,
  };
}
