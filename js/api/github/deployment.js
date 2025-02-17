// js/api/github/deployment.js
import { fetchPaginatedData, BASE_URL, GITHUB_USERNAME, GITHUB_REPO, HEADERS } from './common.js';
import {
    logActionAsync
} from "../../logger.js";

/**
 * Fetch all deployments for the repository.
 * @returns {Promise<Array>} - Array of deployment objects.
 */
export async function fetchDeploymentDetails() {
    return await logActionAsync(`${fetchDeploymentDetails.name}()`, async () => {
        const deploymentsUrl = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/deployments`;
        const deployments = await fetchPaginatedData(deploymentsUrl, HEADERS);

        if (deployments && deployments.length === 0) {
            throw new Error("No Github deployments found to pull data from.");
        }
        return deployments;
    });
}
