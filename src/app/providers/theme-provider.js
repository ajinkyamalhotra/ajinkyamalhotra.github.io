import { APP_EVENTS } from "@shared/constants/events.js";
import { STORAGE_KEYS } from "@shared/constants/storage-keys.js";
import { isLightModePreferred } from "@shared/utils/platform.js";

export function createThemeProvider({ themes, buttonId = "themeBtn" }) {
  const ids = themes.map((theme) => theme.id);
  const button = document.getElementById(buttonId);

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || ids[0];
  }

  function applyTheme(requestedId) {
    const themeId = ids.includes(requestedId) ? requestedId : ids[0];
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem(STORAGE_KEYS.theme, themeId);

    window.dispatchEvent(
      new CustomEvent(APP_EVENTS.themeChanged, {
        detail: { themeId },
      }),
    );

    return themeId;
  }

  function cycle(step = 1) {
    const current = currentTheme();
    const currentIndex = ids.indexOf(current);
    const nextIndex = (currentIndex + step + ids.length) % ids.length;
    return applyTheme(ids[nextIndex]);
  }

  function init() {
    const persisted = localStorage.getItem(STORAGE_KEYS.theme);
    if (persisted && ids.includes(persisted)) {
      applyTheme(persisted);
    } else {
      applyTheme(isLightModePreferred() ? "paper" : "midnight");
    }

    button?.addEventListener("click", () => {
      cycle(1);
    });

    window.addEventListener("keydown", (event) => {
      const targetTag = event.target?.tagName?.toLowerCase() || "";
      const typing =
        targetTag === "input" || targetTag === "textarea" || event.target?.isContentEditable;
      if (typing) {
        return;
      }

      if (event.key.toLowerCase() !== "t") {
        return;
      }

      event.preventDefault();
      cycle(1);
    });
  }

  return {
    init,
    cycle,
    setTheme: applyTheme,
    getTheme: currentTheme,
  };
}
