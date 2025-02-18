import {
    logAction
} from "../logger.js";

export function initScroll(rightSection) {
    logAction(`${initScroll.name}()`, () => {
        window.addEventListener("wheel", event => {
            // If the ctrl key is pressed, let the browser handle zooming.
            if (!event.ctrlKey) {
                event.preventDefault(); // Only prevent default when not zooming.

                const baseSpeed = 4;
                let multiplier = baseSpeed;

                // Adjust multiplier based on deltaMode:
                // 0: Pixels, 1: Lines, 2: Pages.
                if (event.deltaMode === 1) {
                    multiplier = baseSpeed * 15;  // For line scrolling
                } else if (event.deltaMode === 2) {
                    multiplier = baseSpeed * 100; // For page scrolling
                }
                console.log("multipler is " + multiplier);

                rightSection.scrollBy({
                    top: event.deltaY * multiplier,
                    behavior: "smooth"
                });
            }
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
