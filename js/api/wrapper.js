// js/api/wrapper.js
import { fetchDeploymentDetails } from './github/deployment.js';
import {
    fetchRepoDetails,
    fetchRepoIssues,
    fetchRepoPRs,
    fetchRepoLanguages
} from './github/repos.js';
import { renderLanguagesChart } from './chart.js';

export async function invokeAPIsAndUpdateUI() {
    // DOM elements
    const versionElement = document.getElementById("versionCount");
    const dateElement = document.getElementById("versionDate");
    const shaElement = document.getElementById("versionSHA");
    const deployerElement = document.getElementById("versionDeployer");
    const starsElement = document.getElementById("repoStars");
    const forksElement = document.getElementById("repoForks");
    const issuesElement = document.getElementById("repoIssues");
    const prsElement = document.getElementById("repoPRs");
    const languagesChartEl = document.getElementById("languagesChart");

    // Set initial loading states
    versionElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    dateElement.innerHTML = "Fetching...";
    shaElement.innerHTML = "Fetching...";
    deployerElement.innerHTML = "Fetching...";
    starsElement.innerHTML = "Loading...";
    forksElement.innerHTML = "Loading...";
    issuesElement.innerHTML = "Loading...";
    prsElement.innerHTML = "Loading...";

    try {
        // --- Fetch Deployment Details ---
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

        versionElement.innerHTML =
            `<span class="fancy-number">${count}</span>`;
        dateElement.innerHTML =
            `<span class="date-text">${formattedDate} EST</span>`;
        shaElement.innerHTML =
            `<span class="geek-text">${commitSHA}</span>`;
        deployerElement.innerHTML =
            `<span class="geek-text">${deployer}</span>`;

        // --- Fetch Repository Details ---
        const repoData = await fetchRepoDetails();
        starsElement.innerHTML =
            `<span class="fancy-number">${repoData.stargazers_count}</span>`;
        forksElement.innerHTML =
            `<span class="fancy-number">${repoData.forks_count}</span>`;

        // --- Fetch Open Issues & Pull Requests ---
        const issuesData = await fetchRepoIssues();
        issuesElement.innerHTML =
            `<span class="fancy-number">${issuesData.length}</span>`;

        const prsData = await fetchRepoPRs();
        prsElement.innerHTML =
            `<span class="fancy-number">${prsData.length}</span>`;

        // --- Fetch Languages and Render Chart ---
        const languagesData = await fetchRepoLanguages();
        renderLanguagesChart(languagesChartEl, languagesData);

    } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally update the UI with an error message.
    }
}
