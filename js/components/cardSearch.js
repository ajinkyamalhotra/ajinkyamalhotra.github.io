import { renderExperiences, renderProjects } from "../render/render.js";
import {
    logAction
} from "../logger.js";

export function initCardSearch(expSearchInput, projSearchInput, experiences,
    projects, expContainer, projContainer) {
    logAction(`${initCardSearch.name}()`, () => {
        // Experience card filtering
        expSearchInput.addEventListener("input", function (e) {
            const query = e.target.value.toLowerCase();
            const filteredExperiences = experiences.filter(exp => {
                if (exp.type !== "experience") return false;
                return (
                    exp.title.toLowerCase().includes(query) ||
                    exp.description.toLowerCase().includes(query) ||
                    (exp.tags && exp.tags.some(
                        tag => tag.toLowerCase().includes(query)))
                );
            });
            // Call render function with the container and filtered data
            renderExperiences(expContainer, filteredExperiences);
        });

        // Project card filtering
        projSearchInput.addEventListener("input", function (e) {
            const query = e.target.value.toLowerCase();
            const filteredProjects = projects.filter(proj =>
                proj.title.toLowerCase().includes(query) ||
                proj.description.toLowerCase().includes(query) ||
                (proj.tags && proj.tags.some(
                    tag => tag.toLowerCase().includes(query)))
            );
            // Call render function with the container and filtered data
            renderProjects(projContainer, filteredProjects);
        });
    });
}
