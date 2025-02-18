import {
    logAction
} from "../logger.js";

export function initScroll(rightSection) {
    logAction(`${initScroll.name}()`, () => {
        window.addEventListener("wheel", event => {
            event.preventDefault();
            const scrollSpeed = 4;
            rightSection.scrollBy({
                top: event.deltaY * scrollSpeed,
                behavior: "smooth"
            });
        }, { passive: false });
        // Update sessionStorage on every scroll of the container.
        rightSection.addEventListener('scroll', () => {
            sessionStorage.setItem('scrollPosition', rightSection.scrollTop);
        });
        // Save scroll position on beforeunload as a backup.
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', rightSection.scrollTop);
        });
    });
}
