import {
    logAction
} from "../logger.js";

export function initTheme(themeToggle, body) {
    logAction(`${initTheme.name}()`, () => {
        themeToggle.checked = false;
        localStorage.setItem("theme", "dark");

        themeToggle.addEventListener("change", () => {
            if (themeToggle.checked) {
                body.classList.add("light");
                localStorage.setItem("theme", "light");
            } else {
                body.classList.remove("light");
                localStorage.setItem("theme", "dark");
            }
        });

        let touchHandled = false;
        if ("ontouchstart" in window || navigator.maxTouchPoints) {
            const toggleLabel = themeToggle.parentElement;
            toggleLabel.addEventListener("touchend", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!touchHandled) {
                    touchHandled = true;
                    themeToggle.checked = !themeToggle.checked;
                    themeToggle.dispatchEvent(new Event("change"));
                    setTimeout(() => { touchHandled = false; }, 500);
                }
            });
        }
    });
}
