import {
    logAction
} from "../logger.js";

export function initTheme(themeToggle, body) {
    logAction(`${initTheme.name}()`, () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            if (savedTheme === "light") {
                body.classList.add("light");
                themeToggle.checked = true;
            } else {
                body.classList.remove("light");
                themeToggle.checked = false;
            }
        } else {
            const prefersLight = window.matchMedia(
                "(prefers-color-scheme: light)").matches;
            if (prefersLight) {
                body.classList.add("light");
                themeToggle.checked = true;
                localStorage.setItem("theme", "light");
            } else {
                body.classList.remove("light");
                themeToggle.checked = false;
                localStorage.setItem("theme", "dark");
            }
        }

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
