export function initFadeIn() {
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        { threshold: 0.2 }
    );
    fadeElements.forEach(element => observer.observe(element));
}
