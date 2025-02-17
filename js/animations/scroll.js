import {
    logAction
} from "../logger.js";

export function initScroll(rightSection) {
    logAction(`${initScroll.name}()`, () => {
        window.addEventListener("wheel", event => {
            const scrollSpeed = 4;
            rightSection.scrollBy({
                top: event.deltaY * scrollSpeed,
                behavior: "smooth"
            });
        });
    });
}
