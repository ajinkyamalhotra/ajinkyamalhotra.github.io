// js/api/github/repos.js
import { fetchData, BASE_URL, GITHUB_USERNAME, GITHUB_REPO, HEADERS } from './common.js';
import {
    logAction, logActionAsync
} from "../../logger.js";

/**
 * Fetch repository details.
 * @returns {Promise<Object>} - Repository details.
 */
export async function fetchRepoDetails() {
    return await logActionAsync(`${fetchRepoDetails.name}()`, async () => {
        const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}`;
        return fetchData(url, HEADERS);
    });
}

/**
 * Fetch open issues for the repository using pagination.
 * @returns {Promise<Array>} - Array of open issues.
 */
export async function fetchRepoIssues() {
    return await logActionAsync(`${fetchRepoIssues.name}()`, async () => {
        const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/issues?state=open`;
        const issues = await fetchData(url, HEADERS);
        return issues;
    });
}

/**
 * Fetch open pull requests for the repository using pagination.
 * @returns {Promise<Array>} - Array of open pull requests.
 */
export async function fetchRepoPRs() {
    return await logActionAsync(`${fetchRepoPRs.name}()`, async () => {
        const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/pulls?state=open`;
        const prs = await fetchData(url, HEADERS);
        return prs;
    });
}

/**
 * Fetch programming languages used in the repository.
 * @returns {Promise<Object>} - Object mapping languages to bytes.
 */
export async function fetchRepoLanguages() {
    return await logActionAsync(`${fetchRepoLanguages.name}()`, async () => {
        const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/languages`;
        return fetchData(url, HEADERS);
    });
}
