import { debounce } from "../utils/debounce.js";
import {
    logAction
} from "../logger.js";

// A flag to disable scroll-based nav updates temporarily.
let disableScrollNavUpdate = false;

export function scrollToSection(id) {
    logAction(`${scrollToSection.name}()`, () => {
        const section = document.getElementById(id);
        if (section) {
            // Disable scroll-based nav updates while we're scrolling.
            disableScrollNavUpdate = true;
            section.scrollIntoView({ behavior: "smooth" });
            updateActiveNav(id);
            // Re-enable scroll-based nav updates after a delay.
            setTimeout(() => {
                disableScrollNavUpdate = false;
            }, 800);
        }
    });
}

export function updateActiveNav(activeId) {
    logAction(`${updateActiveNav.name}()`, () => {
        const navButtons = document.querySelectorAll(".nav-button");
        navButtons.forEach(btn => btn.classList.remove("nav-active"));
        const target = document.getElementById("btn-" + activeId);
        if (target) target.classList.add("nav-active");
    });
}

export function updateNavOnScroll(rightSection) {
    // Do not log this method
    // If a nav click triggered a scroll, skip the update
    if (disableScrollNavUpdate) return;

    const sections = document.querySelectorAll(".fade-in");
    const navButtons = document.querySelectorAll(".nav-button");
    let closestSectionIndex = 0;
    let minDistance = Infinity;
    const containerRect = rightSection.getBoundingClientRect();
    const scrollBottom = rightSection.scrollTop + rightSection.clientHeight;
    const scrollHeight = rightSection.scrollHeight;

    if (scrollBottom >= scrollHeight - 5) {
        navButtons.forEach(btn => btn.classList.remove("nav-active"));
        navButtons[sections.length - 1].classList.add("nav-active");
        return;
    }

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - containerRect.top);
        if (distance < minDistance) {
            minDistance = distance;
            closestSectionIndex = index;
        }
    });

    navButtons.forEach(btn => btn.classList.remove("nav-active"));
    navButtons[closestSectionIndex].classList.add("nav-active");
}

export function initNav(rightSection) {
    logAction(`${initNav.name}()`, () => {
        // Update nav on document scroll
        document.addEventListener("scroll", debounce(() => {
            // Skip updating if a nav button click initiated the scroll.
            if (disableScrollNavUpdate) return;

            const sections = document.querySelectorAll(".fade-in");
            const navButtons = document.querySelectorAll(".nav-button");
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                    navButtons.forEach(btn => btn.classList.remove("nav-active"));
                    navButtons[index].classList.add("nav-active");
                }
            });
        }, 100));

        // Update nav on rightSection scroll
        let ticking = false;
        rightSection.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateNavOnScroll(rightSection);
                    ticking = false;
                });
                ticking = true;
            }
        });
    });
}
