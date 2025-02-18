import {
    logAction
} from "../logger.js";

export function initBackToTop(backToTopContainer, backToTop, rightSection) {
    logAction(`${initBackToTop.name}()`, () => {
        if (window.innerWidth <= 768) {
            window.addEventListener("scroll", () => {
                window.pageYOffset > 200
                    ? backToTopContainer.classList.add("show")
                    : backToTopContainer.classList.remove("show");
            });
            backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        } else {
            rightSection.addEventListener("scroll", () => {
                rightSection.scrollTop > 200
                    ? backToTopContainer.classList.add("show")
                    : backToTopContainer.classList.remove("show");
            });
            backToTop.addEventListener("click", () => {
                rightSection.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    });
}
