export function initSpotlight() {
    document.addEventListener("mousemove", e => {
        const spotlight = document.getElementById("spotlight");
        if (spotlight) {
            spotlight.style.left = e.clientX + "px";
            spotlight.style.top = e.clientY + "px";
        }
    });
}
