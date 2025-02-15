// js/api/github/repos.js
import { fetchData, fetchPaginatedData, BASE_URL, GITHUB_USERNAME, GITHUB_REPO, HEADERS } from './common.js';

/**
 * Fetch repository details.
 * @returns {Promise<Object>} - Repository details.
 */
export async function fetchRepoDetails() {
    const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}`;
    return fetchData(url, HEADERS);
}

/**
 * Fetch open issues for the repository using pagination.
 * @returns {Promise<Array>} - Array of open issues.
 */
export async function fetchRepoIssues() {
    const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/issues?state=open`;
    const issues = await fetchData(url, HEADERS);
    if (issues.error) {
        throw new Error("GitHub API rate limit exceeded for issues!");
    }
    return issues;
}

/**
 * Fetch open pull requests for the repository using pagination.
 * @returns {Promise<Array>} - Array of open pull requests.
 */
export async function fetchRepoPRs() {
    const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/pulls?state=open`;
    const prs = await fetchData(url, HEADERS);
    if (prs.error) {
        throw new Error("GitHub API rate limit exceeded for pull requests!");
    }
    return prs;
}

/**
 * Fetch programming languages used in the repository.
 * @returns {Promise<Object>} - Object mapping languages to bytes.
 */
export async function fetchRepoLanguages() {
    const url = `${BASE_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/languages`;
    return fetchData(url, HEADERS);
}
