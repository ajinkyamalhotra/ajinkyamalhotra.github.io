// js/api/wrapper.js
import { fetchDeploymentDetails } from './github/deployment.js';
import {
    fetchRepoDetails,
    fetchRepoIssues,
    fetchRepoPRs,
    fetchRepoLanguages
} from './github/repos.js';
import { renderLanguagesChart } from './chart.js';
import { logAction, logActionAsync } from "../logger.js"; // Adjust relative path as needed

export async function invokeAPIsAndUpdateUI() {
    try {
        // --- Cache DOM elements ---
        logAction("Cache DOM elements", () => {
            // DOM elements
            window._versionElement = document.getElementById("versionCount");
            window._dateElement = document.getElementById("versionDate");
            window._shaElement = document.getElementById("versionSHA");
            window._deployerElement = document.getElementById("versionDeployer");
            window._starsElement = document.getElementById("repoStars");
            window._forksElement = document.getElementById("repoForks");
            window._issuesElement = document.getElementById("repoIssues");
            window._prsElement = document.getElementById("repoPRs");
            window._languagesChartEl = document.getElementById("languagesChart");
        });

        // For easier reference, assign cached elements to local variables.
        const versionElement = window._versionElement;
        const dateElement = window._dateElement;
        const shaElement = window._shaElement;
        const deployerElement = window._deployerElement;
        const starsElement = window._starsElement;
        const forksElement = window._forksElement;
        const issuesElement = window._issuesElement;
        const prsElement = window._prsElement;
        const languagesChartEl = window._languagesChartEl;

        // --- Set initial loading states ---
        logAction("Set initial loading states", () => {
            versionElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            dateElement.innerHTML = "Fetching...";
            shaElement.innerHTML = "Fetching...";
            deployerElement.innerHTML = "Fetching...";
            starsElement.innerHTML = "Loading...";
            forksElement.innerHTML = "Loading...";
            issuesElement.innerHTML = "Loading...";
            prsElement.innerHTML = "Loading...";
        });
        // --- Fetch Deployment Details ---
        await logActionAsync("Fetch Deployment Details", async () => {
            const deployments = await fetchDeploymentDetails();
            const latestDeployment = deployments[0];
            const deploymentDate = new Date(latestDeployment.created_at);
            const commitSHA = latestDeployment.sha || "Unknown";
            const deployer = latestDeployment.creator?.login || "Unknown";
            const count = deployments.length;

            // Format deployment date
            const options = {
                timeZone: "America/New_York",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            };
            const formattedDate = deploymentDate.toLocaleString("en-US", options);

            logAction("Update Deployment Details UI", () => {
                versionElement.innerHTML =
                    `<span class="fancy-number">${count}</span>`;
                dateElement.innerHTML =
                    `<span class="date-text">${formattedDate} EST</span>`;
                shaElement.innerHTML =
                    `<span class="geek-text">${commitSHA}</span>`;
                deployerElement.innerHTML =
                    `<span class="geek-text">${deployer}</span>`;
            });
        });

        // --- Fetch Repository Details ---
        await logActionAsync("Fetch Repository Details", async () => {
            const repoData = await fetchRepoDetails();
            logAction("Update Repository Details UI", () => {
                starsElement.innerHTML =
                    `<span class="fancy-number">${repoData.stargazers_count}</span>`;
                forksElement.innerHTML =
                    `<span class="fancy-number">${repoData.forks_count}</span>`;
            });
        });

        // --- Fetch Open Issues & Pull Requests ---
        await logActionAsync("Fetch Open Issues & PRs", async () => {
            const issuesData = await fetchRepoIssues();
            const prsData = await fetchRepoPRs();
            logAction("Update Issues & PRs UI", () => {
                issuesElement.innerHTML =
                    `<span class="fancy-number">${issuesData.length}</span>`;
                prsElement.innerHTML =
                    `<span class="fancy-number">${prsData.length}</span>`;
            });
        });

        // --- Fetch Languages and Render Chart ---
        await logActionAsync("Fetch Languages and Render Chart", async () => {
            const languagesData = await fetchRepoLanguages();
            logAction("Render Languages Chart", () => {
                renderLanguagesChart(languagesChartEl, languagesData);
            });
        });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
