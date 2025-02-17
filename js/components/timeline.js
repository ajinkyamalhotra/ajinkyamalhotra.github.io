import {
    logAction
} from "../logger.js";

let timelineReversed = true;

export function initTimeline(container, timelineData) {
    logAction(`${initTimeline.name}()`, () => {
        if (!timelineData || !Array.isArray(timelineData)) {
            console.error("timelineData is not defined or is not an array.");
            return;
        }

        // Clear container and reset animations.
        container.innerHTML = "";
        container.classList.remove("visible");

        // Determine event order based on timelineReversed flag.
        const events = timelineReversed ? [...timelineData].reverse() : timelineData;

        // Create timeline events.
        events.forEach((event, index) => {
            const eventWrapper = document.createElement("div");
            eventWrapper.classList.add("timeline-event");
            eventWrapper.classList.add(index % 2 === 0 ? "left" : "right");

            const card = document.createElement("div");
            card.classList.add("timeline-card");

            const title = document.createElement("h3");
            title.textContent = event.title;

            const period = document.createElement("div");
            period.className = "period";
            period.textContent = event.period;

            const info = document.createElement("p");
            info.className = "info";
            info.textContent = event.info;

            card.appendChild(title);
            card.appendChild(period);
            card.appendChild(info);

            eventWrapper.appendChild(card);

            const yearMarker = document.createElement("div");
            yearMarker.classList.add("timeline-year");
            yearMarker.textContent = event.year || event.period.split(" ")[0];
            eventWrapper.appendChild(yearMarker);

            container.appendChild(eventWrapper);
        });

        // Animate timeline.
        animateTimeline(container);

        // Add hover listeners on year markers.
        container.querySelectorAll('.timeline-year').forEach(yearEl => {
            yearEl.addEventListener('mouseenter', function () {
                const card = this.parentElement.querySelector('.timeline-card');
                if (card) {
                    card.classList.add('highlight');
                }
            });
            yearEl.addEventListener('mouseleave', function () {
                const card = this.parentElement.querySelector('.timeline-card');
                if (card) {
                    card.classList.remove('highlight');
                }
            });
        });
    });
}

/**
 * Animates the timeline events with a staggered effect.
 * @param {HTMLElement} container - The timeline container.
 */
function animateTimeline(container) {
    logAction(`${animateTimeline.name}()`, () => {
        container.classList.add("visible");
        container.querySelectorAll(".timeline-event").forEach((eventEl, idx) => {
            setTimeout(() => {
                eventEl.classList.add("visible");
            }, idx * 150);
        });
    });
}

/**
 * Toggles the sort order of the timeline and re-initializes it.
 * @param {HTMLElement} container - The timeline container.
 * @param {Array} timelineData - The timeline data.
 * @param {HTMLElement} toggleBtn - The button that toggles the timeline sort.
 */
export function toggleTimelineSort(container, timelineData, toggleBtn) {
    logAction(`${toggleTimelineSort.name}()`, () => {
        timelineReversed = !timelineReversed;
        toggleBtn.textContent = timelineReversed ? "View Oldest First" : "View Latest First";
        initTimeline(container, timelineData);
    });
}

export function setupTimelineToggle(toggleBtn, container, timelineData) {
    logAction(`${setupTimelineToggle.name}()`, () => {
        if (!toggleBtn) {
            console.error("Toggle button not found.");
            return;
        }
        // Set initial toggle button text based on current state.
        toggleBtn.textContent = timelineReversed ? "View Oldest First" : "View Latest First";
        // Attach the click event listener.
        toggleBtn.addEventListener("click", () => {
            toggleTimelineSort(container, timelineData, toggleBtn);
        });
    });
}