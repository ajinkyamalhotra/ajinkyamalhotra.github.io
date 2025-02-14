export function initScroll(rightSection) {
    window.addEventListener("wheel", event => {
        const scrollSpeed = 4;
        rightSection.scrollBy({
            top: event.deltaY * scrollSpeed,
            behavior: "smooth"
        });
    });
}
