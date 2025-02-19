import {
    logAction
} from "../logger.js";

export function initScroll(rightSection) {
    logAction(`${initScroll.name}()`, () => {
        window.addEventListener("wheel", event => {
            // If the ctrl key is pressed, let the browser handle zooming.
            if (!event.ctrlKey) {
                event.preventDefault();

                let multiplier = 1;
                if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
                    multiplier = 16;
                } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
                    multiplier = window.innerHeight;
                }
                console.log("event.deltaY = " + event.deltaY);
                const scrollAmount = event.deltaY * multiplier * 4;
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
