// js/api/github/common.js

// GitHub API credentials and config
export const GITHUB_USERNAME = "ajinkyamalhotra";
export const GITHUB_REPO = "ajinkyamalhotra.github.io";
export const GITHUB_TOKEN = ""; // Insert your GitHub token if available
export const BASE_URL = "https://api.github.com/repos";

// Construct headers based on token presence
export const HEADERS = GITHUB_TOKEN
    ? { "Authorization": `token ${GITHUB_TOKEN}` }
    : {};

/**
 * Generic function for paginated API calls.
 * @param {string} baseUrl - The API endpoint URL (without pagination parameters).
 * @param {object} headers - Request headers.
 * @param {number} perPage - Items per page.
 * @returns {Promise<Array>} - Returns an array with all data from paginated calls.
 */
export async function fetchPaginatedData(baseUrl, headers = HEADERS, perPage = 100) {
    let page = 1;
    let allData = [];

    while (true) {
        const url = `${baseUrl}?page=${page}&per_page=${perPage}`;
        const response = await fetch(url, { headers });

        if (response.status === 403) {
            console.warn("GitHub API rate limit exceeded!");
            return { error: "rate limit" };
        } else if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) break;
        allData = allData.concat(data);
        page++;
    }

    return allData;
}

/**
 * Generic function for single-call API endpoints.
 * @param {string} url - The full API URL.
 * @param {object} headers - Request headers.
 * @returns {Promise<any>} - Returns the parsed JSON response.
 */
export async function fetchData(url, headers = HEADERS) {
    const response = await fetch(url, { headers });
    if (response.status === 403) {
        console.warn("GitHub API rate limit exceeded!");
        return { error: "rate limit" };
    } else if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
