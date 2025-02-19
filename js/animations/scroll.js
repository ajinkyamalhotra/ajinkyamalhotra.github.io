import {
    logAction
} from "../logger.js";

export function initScroll(rightSection) {
    logAction(`${initScroll.name}()`, () => {
        window.addEventListener("wheel", event => {
            const isTrackpad = Math.abs(event.deltaY) < 100;
            rightSection.scrollBy({
                top: isTrackpad ? event.deltaY : event.deltaY * 4,
                behavior: isTrackpad ? 'auto' : 'smooth'
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
