import { qsa } from "@shared/utils/dom.js";

export function createRevealProvider() {
  let observer;

  function ensureObserver() {
    if (observer) {
      return observer;
    }

    observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    return observer;
  }

  return {
    observe(root = document) {
      const items = qsa(".reveal:not(.is-visible)", root);
      if (!items.length) {
        return;
      }

      const activeObserver = ensureObserver();
      items.forEach((item) => activeObserver.observe(item));
    },
  };
}
