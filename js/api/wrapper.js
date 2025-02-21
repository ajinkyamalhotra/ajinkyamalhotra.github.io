// js/api/wrapper.js
import { fetchDeploymentDetails } from './github/deployment.js';
import {
    fetchRepoDetails,
    fetchRepoIssues,
    fetchRepoPRs,
    fetchRepoLanguages
} from './github/repos.js';
import { renderLanguagesChart } from '../components/chart.js';
import { logActionAsync } from "../logger.js";

export async function githubApiWrapper() {
    try {
        // Invoking APIs and updating UI elements with data
        await logActionAsync(`${githubApiWrapper.name}()`, async () => {
            // Caching
            window._versionElement = document.getElementById("versionCount");
            window._dateElement = document.getElementById("versionDate");
            //window._shaElement = document.getElementById("versionSHA");
            window._deployerElement = document.getElementById("versionDeployer");
            window._starsElement = document.getElementById("repoStars");
            window._forksElement = document.getElementById("repoForks");
            window._issuesElement = document.getElementById("repoIssues");
            window._prsElement = document.getElementById("repoPRs");
            window._languagesChartEl = document.getElementById("languagesChart");
            const versionElement = window._versionElement;
            const dateElement = window._dateElement;
            //const shaElement = window._shaElement;
            const deployerElement = window._deployerElement;
            const starsElement = window._starsElement;
            const forksElement = window._forksElement;
            const issuesElement = window._issuesElement;
            const prsElement = window._prsElement;
            const languagesChartEl = window._languagesChartEl;

            // Setting initial state without data
            versionElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            dateElement.innerHTML = "Fetching...";
            //shaElement.innerHTML = "Fetching...";
            deployerElement.innerHTML = "Fetching...";
            starsElement.innerHTML = "Loading...";
            forksElement.innerHTML = "Loading...";
            issuesElement.innerHTML = "Loading...";
            prsElement.innerHTML = "Loading...";

            // Calling Github API, retriving the data and updating/rendering UI elements
            const deployments = await fetchDeploymentDetails();
            const repoData = await fetchRepoDetails();
            const issuesData = await fetchRepoIssues();
            const prsData = await fetchRepoPRs();
            const languagesData = await fetchRepoLanguages();
            if (deployments && repoData && issuesData && prsData && languagesData) {
                const latestDeployment = deployments[0];
                const deploymentDate = new Date(latestDeployment.created_at);
                const commitSHA = latestDeployment.sha || "Unknown";
                const deployer = latestDeployment.creator?.login || "Unknown";
                const count = deployments.length;
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
                //shaElement.innerHTML =
                //    `<span class="geek-text">${commitSHA}</span>`;
                deployerElement.innerHTML =
                    `<span class="geek-text">${deployer}</span>`;
                starsElement.innerHTML =
                    `<span class="fancy-number">${repoData.stargazers_count}</span>`;
                forksElement.innerHTML =
                    `<span class="fancy-number">${repoData.forks_count}</span>`;
                issuesElement.innerHTML =
                    `<span class="fancy-number">${issuesData.length}</span>`;
                prsElement.innerHTML =
                    `<span class="fancy-number">${prsData.length}</span>`;
                renderLanguagesChart(languagesChartEl, languagesData);
            }
        });

    } catch (error) {
        console.error("Error fetching data from one of GitHub's API: ", error);
    }
}
