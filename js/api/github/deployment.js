// js/api/github/deployment.js
import { fetchPaginatedData, BASE_URL, GITHUB_USERNAME, GITHUB_REPO, HEADERS } from './common.js';

/**
 * Fetch all deployments for the repository.
 * @returns {Promise<Array>} - Array of deployment objects.
 */
export async function fetchDeploymentDetails() {
    const deploymentsUrl = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/deployments`;
    const deployments = await fetchPaginatedData(deploymentsUrl, HEADERS);

    if (deployments.error) {
        throw new Error("GitHub API rate limit exceeded!");
    }
    if (!deployments || deployments.length === 0) {
        throw new Error("No deployments found.");
    }
    return deployments;
}
