import { debounce } from "../utils/debounce.js";

export function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        updateActiveNav(id);
    }
}

export function updateActiveNav(activeId) {
    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach(btn => btn.classList.remove("nav-active"));
    const target = document.getElementById("btn-" + activeId);
    if (target) target.classList.add("nav-active");
}

export function updateNavOnScroll(rightSection) {
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
    // Update nav on document scroll
    document.addEventListener("scroll", debounce(() => {
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
}
