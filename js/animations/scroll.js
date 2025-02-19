import {
    logAction
} from "../logger.js";

export function initScroll(rightSection) {
    logAction(`${initScroll.name}()`, () => {
        window.addEventListener("wheel", event => {
            // If the ctrl key is pressed, let the browser handle zooming.
            if (!event.ctrlKey) {
                event.preventDefault();

                let scrollAmount = event.deltaY * 4;
                if (Math.abs(event.deltaY) < 4) {
                    scrollAmount *= 500;
                    console.log("scrollAmount * 500 =" + scrollAmount);
                } else if (Math.abs(event.deltaY) < 50) {
                    scrollAmount *= 100;
                    console.log("scrollAmount * 100 =" + scrollAmount);
                }
                rightSection.scrollBy({
                    top: scrollAmount,
                    behavior: "smooth"
                });
            }
        }, { passive: false }); // Marking as non-passive allows preventDefault
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
